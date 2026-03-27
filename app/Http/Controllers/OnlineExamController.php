<?php

namespace App\Http\Controllers;

use App\AppNeuronMyAgent;
use App\Http\Requests\StoreOnlineExamRequest;
use App\Http\Requests\SubmitOnlineExamRequest;
use App\Models\Job;
use App\Models\OnlineExam;
use App\Models\Resume;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class OnlineExamController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = Auth::id();
        $perPage = $request->input('per_page', 10);

        $onlineExams = OnlineExam::with(['job', 'resume'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage)
            ->appends(['per_page' => $perPage]);

        return Inertia::render('OnlineExams/Index', [
            'onlineExams' => $onlineExams,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create(): Response
    {
        $userId = Auth::id();
        $jobs = Job::where('user_id', $userId)->latest()->get(['id', 'title', 'description']);
        $resumes = Resume::where('user_id', $userId)->latest()->get(['id', 'name', 'file_path']);

        return Inertia::render('OnlineExams/Create', [
            'jobs' => $jobs,
            'resumes' => $resumes,
        ]);
    }

    public function store(StoreOnlineExamRequest $request): RedirectResponse
    {
        $userId = Auth::id();
        $validated = $request->validated();

        $job = Job::where('id', $validated['job_id'])->where('user_id', $userId)->firstOrFail();
        $resume = Resume::where('id', $validated['resume_id'])->where('user_id', $userId)->firstOrFail();

        $resumeContent = withStoredFile($resume->file_path, function (string $filePath): string {
            return extractResumeContent($filePath);
        });

        try {
            $agent = app(AppNeuronMyAgent::class);
            $aiResult = $agent->createOnlineExamSession(
                $job->title,
                $job->description ?? '',
                [['id' => $resume->id, 'name' => $resume->name, 'content' => $resumeContent]],
                $validated['focus'] ?? '',
                (int) $validated['question_count'],
            );
        } catch (\Exception $e) {
            Log::error('Online exam generation failed: '.$e->getMessage());

            return back()->with('error', 'Failed to generate online exam. Check logs.');
        }

        $decoded = json_decode($aiResult, true);
        $summary = $decoded['summary'] ?? null;
        $questions = $this->normalizeQuestions($decoded['questions'] ?? []);

        if ($questions === []) {
            return back()->with('error', 'The AI did not return a valid set of exam questions. Please try again.');
        }

        $startedAt = now();
        $expiresAt = $startedAt->copy()->addMinutes((int) $validated['time_limit_minutes']);

        $onlineExam = OnlineExam::create([
            'user_id' => $userId,
            'resume_id' => $resume->id,
            'job_description_id' => $job->id,
            'focus' => $validated['focus'] ?? null,
            'ai_result' => $decoded,
            'summary' => $summary,
            'status' => 'in_progress',
            'questions' => $questions,
            'question_count' => count($questions),
            'time_limit_minutes' => (int) $validated['time_limit_minutes'],
            'started_at' => $startedAt,
            'expires_at' => $expiresAt,
        ]);

        return redirect()->route('online-exams.show', $onlineExam)->with('success', 'Exam started successfully.');
    }

    public function show(OnlineExam $onlineExam): Response
    {
        $this->authorizeExamAccess($onlineExam);

        $questions = $onlineExam->questions ?? [];
        $evaluation = $onlineExam->evaluation_result ?? [];
        $submittedAnswers = collect($onlineExam->submitted_answers ?? [])
            ->mapWithKeys(fn (array $answer): array => [
                (string) ($answer['question_index'] ?? '') => $answer['selected_option'] ?? null,
            ])
            ->all();

        return Inertia::render('OnlineExams/Show', [
            'onlineExam' => [
                'id' => $onlineExam->id,
                'status' => $onlineExam->status,
                'focus' => $onlineExam->focus,
                'job' => [
                    'id' => $onlineExam->job?->id,
                    'title' => $onlineExam->job?->title ?? 'N/A',
                    'description' => $onlineExam->job?->description ?? '',
                ],
                'resume' => [
                    'id' => $onlineExam->resume?->id,
                    'name' => $onlineExam->resume?->name ?? 'N/A',
                ],
                'summary' => $onlineExam->summary,
                'questions' => $questions,
                'submitted_answers' => $submittedAnswers,
                'evaluation_result' => $evaluation,
                'question_count' => $onlineExam->question_count,
                'time_limit_minutes' => $onlineExam->time_limit_minutes,
                'started_at' => optional($onlineExam->started_at)->toIso8601String(),
                'expires_at' => optional($onlineExam->expires_at)->toIso8601String(),
                'submitted_at' => optional($onlineExam->submitted_at)->toIso8601String(),
                'time_taken_seconds' => $onlineExam->time_taken_seconds,
                'created_at' => $onlineExam->created_at,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function update(SubmitOnlineExamRequest $request, OnlineExam $onlineExam): RedirectResponse
    {
        $this->authorizeExamAccess($onlineExam);

        if ($onlineExam->status === 'completed') {
            return redirect()->route('online-exams.show', $onlineExam)->with('error', 'This exam has already been submitted.');
        }

        $questions = $onlineExam->questions ?? [];
        $answers = $this->normalizeSubmittedAnswers($request->validated('answers', []), $questions);
        $job = $onlineExam->job;
        $timeTakenSeconds = $this->resolveTimeTakenSeconds($onlineExam);
        $fallbackEvaluation = $this->buildFallbackEvaluation($questions, $answers);

        try {
            $agent = app(AppNeuronMyAgent::class);
            $evaluationJson = $agent->evaluateOnlineExam(
                $job?->title ?? 'Exam',
                $job?->description ?? '',
                $questions,
                $answers,
            );
            $decodedEvaluation = json_decode($evaluationJson, true);
        } catch (\Throwable $e) {
            Log::error('Online exam evaluation failed: '.$e->getMessage());
            $decodedEvaluation = null;
        }

        $evaluation = $this->mergeEvaluation($fallbackEvaluation, is_array($decodedEvaluation) ? $decodedEvaluation : []);

        $onlineExam->update([
            'status' => 'completed',
            'submitted_answers' => $answers,
            'evaluation_result' => $evaluation,
            'submitted_at' => now(),
            'time_taken_seconds' => $timeTakenSeconds,
        ]);

        return redirect()->route('online-exams.show', $onlineExam)->with('success', 'Exam submitted successfully.');
    }

    public function destroy(OnlineExam $onlineExam): RedirectResponse
    {
        $this->authorizeExamAccess($onlineExam);
        $onlineExam->delete();

        return redirect()->route('online-exams.index')->with('success', 'Online exam deleted successfully.');
    }

    private function authorizeExamAccess(OnlineExam $onlineExam): void
    {
        if ($onlineExam->user_id !== Auth::id()) {
            abort(403);
        }
    }

    private function normalizeQuestions(array $questions): array
    {
        return collect($questions)
            ->filter(fn (mixed $question): bool => is_array($question))
            ->values()
            ->map(function (array $question, int $index): array {
                $choices = collect($question['choices'] ?? [])
                    ->filter(fn (mixed $choice): bool => is_string($choice) && trim($choice) !== '')
                    ->map(fn (string $choice): string => trim($choice))
                    ->values()
                    ->take(4)
                    ->all();

                return [
                    'question_index' => $index,
                    'question' => trim((string) ($question['question'] ?? '')),
                    'type' => 'multiple_choice',
                    'choices' => $choices,
                    'answer' => trim((string) ($question['answer'] ?? '')),
                    'explanation' => trim((string) ($question['explanation'] ?? '')),
                ];
            })
            ->filter(fn (array $question): bool => $question['question'] !== '' && count($question['choices']) === 4)
            ->values()
            ->all();
    }

    private function normalizeSubmittedAnswers(array $answers, array $questions): array
    {
        $validIndexes = collect($questions)->pluck('question_index')->map(fn (mixed $index): string => (string) $index)->all();

        return collect($answers)
            ->filter(fn (mixed $answer): bool => is_array($answer))
            ->map(function (array $answer): array {
                return [
                    'question_index' => (int) ($answer['question_index'] ?? -1),
                    'selected_option' => isset($answer['selected_option']) ? trim((string) $answer['selected_option']) : null,
                ];
            })
            ->filter(fn (array $answer): bool => in_array((string) $answer['question_index'], $validIndexes, true))
            ->unique('question_index')
            ->values()
            ->all();
    }

    private function resolveTimeTakenSeconds(OnlineExam $onlineExam): int
    {
        $startedAt = $onlineExam->started_at ?? now();
        $hardLimitSeconds = ((int) $onlineExam->time_limit_minutes) * 60;
        $elapsedSeconds = $startedAt->diffInSeconds(now());

        return min($elapsedSeconds, $hardLimitSeconds);
    }

    private function buildFallbackEvaluation(array $questions, array $answers): array
    {
        $answersByIndex = collect($answers)->mapWithKeys(fn (array $answer): array => [
            (int) $answer['question_index'] => $answer['selected_option'] ?? null,
        ]);

        $results = collect($questions)->map(function (array $question) use ($answersByIndex): array {
            $selectedOption = $this->normalizeAnswerValue($answersByIndex->get((int) $question['question_index']));
            $correctOption = $this->normalizeAnswerValue($question['answer'] ?? null);
            $isCorrect = $selectedOption !== null && $correctOption !== null && strcasecmp($selectedOption, $correctOption) === 0;

            return [
                'question_index' => (int) $question['question_index'],
                'question' => $question['question'],
                'selected_option' => $selectedOption,
                'correct_option' => $correctOption,
                'is_correct' => $isCorrect,
                'explanation' => $question['explanation'] ?: 'The correct option was determined from the generated answer key.',
            ];
        })->values();

        $correctAnswers = $results->where('is_correct', true)->count();
        $totalQuestions = max($results->count(), 1);
        $percentage = (int) round(($correctAnswers / $totalQuestions) * 100);

        return [
            'score' => $correctAnswers,
            'correct_answers' => $correctAnswers,
            'total_questions' => $results->count(),
            'percentage' => $results->isEmpty() ? 0 : $percentage,
            'summary' => $results->isEmpty()
                ? 'No questions were available for evaluation.'
                : "The candidate answered {$correctAnswers} out of {$results->count()} questions correctly.",
            'results' => $results->all(),
        ];
    }

    private function mergeEvaluation(array $fallbackEvaluation, array $aiEvaluation): array
    {
        if (! isset($aiEvaluation['results']) || ! is_array($aiEvaluation['results'])) {
            return $fallbackEvaluation;
        }

        $mergedResults = collect($fallbackEvaluation['results'])
            ->map(function (array $fallbackResult, int $index) use ($aiEvaluation): array {
                $aiResult = $aiEvaluation['results'][$index] ?? [];

                return [
                    'question_index' => $fallbackResult['question_index'],
                    'question' => $fallbackResult['question'],
                    'selected_option' => $fallbackResult['selected_option'],
                    'correct_option' => $fallbackResult['correct_option'],
                    'is_correct' => (bool) ($aiResult['is_correct'] ?? $fallbackResult['is_correct']),
                    'explanation' => trim((string) ($aiResult['explanation'] ?? $fallbackResult['explanation'])),
                ];
            })
            ->values();

        $correctAnswers = $mergedResults->where('is_correct', true)->count();
        $totalQuestions = $mergedResults->count();

        return [
            'score' => (int) ($aiEvaluation['score'] ?? $correctAnswers),
            'correct_answers' => (int) ($aiEvaluation['correct_answers'] ?? $correctAnswers),
            'total_questions' => (int) ($aiEvaluation['total_questions'] ?? $totalQuestions),
            'percentage' => (int) ($aiEvaluation['percentage'] ?? ($totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100) : 0)),
            'summary' => trim((string) ($aiEvaluation['summary'] ?? $fallbackEvaluation['summary'])),
            'results' => $mergedResults->all(),
        ];
    }

    private function normalizeAnswerValue(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
