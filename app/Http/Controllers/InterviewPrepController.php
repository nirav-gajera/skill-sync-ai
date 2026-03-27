<?php

namespace App\Http\Controllers;

use App\AppNeuronMyAgent;
use App\Models\InterviewPrep;
use App\Models\Job;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InterviewPrepController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $perPage = $request->input('per_page', 10);

        $InterviewPreps = InterviewPrep::with(['job'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage)
            ->appends(['per_page' => $perPage]);

        $jobs = Job::where('user_id', $userId)->latest()->get(['id', 'title', 'description']);

        return Inertia::render('InterviewPreps/Index', [
            'InterviewPreps' => $InterviewPreps,
            'jobs' => $jobs,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $userId = Auth::id();

        $jobs = Job::where('user_id', $userId)->latest()->get(['id', 'title']);
        $resumes = Resume::where('user_id', $userId)->latest()->get(['id', 'name', 'file_path']);

        return Inertia::render('InterviewPreps/Create', [
            'jobs' => $jobs,
            'resumes' => $resumes,
        ]);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'job_id' => 'required',
            'resume_id' => 'required',
        ]);

        // --- Get Job data ---
        $job = Job::where('id', $validated['job_id'])->where('user_id', $userId)->firstOrFail();

        // --- Get Resume data ---
        $resume = Resume::where('id', $validated['resume_id'])->where('user_id', $userId)->firstOrFail();

        $content = withStoredFile($resume->file_path, function (string $filePath): string {
            // --- Extract resume text ---
            return extractResumeContent($filePath);
        });

        // --- AI Generation ---
        try {
            $agent = new AppNeuronMyAgent;
            $aiResult = $agent->createInterviewPrep($job->title, $job->description ?? '', [
                ['id' => $resume->id, 'content' => $content],
            ]);
        } catch (\Exception $e) {
            Log::error('InterviewPrep AI error: '.$e->getMessage());

            return back()->with('error', 'AI generation failed.');
        }

        // --- Save to DB ---
        InterviewPrep::create([
            'user_id' => $userId,
            'resume_id' => $resume->id,
            'job_description_id' => $job->id,
            'questions_answers' => $aiResult, // JSON from AI
            'summary' => json_decode($aiResult, true)['summary'] ?? null,
        ]);

        return redirect()->route('interview-preps.index')->with('success', 'Interview prep created successfully.');
    }

    public function show($id)
    {
        $InterviewPrepData = InterviewPrep::with('job')->findOrFail($id);

        $questionsAnswers = [];
        if (! empty($InterviewPrepData->questions_answers)) {
            $decoded = json_decode($InterviewPrepData->questions_answers, true);
            if (is_array($decoded)) {
                // Handle nested case: { "questions_answers": [...] }
                if (isset($decoded['questions_answers']) && is_array($decoded['questions_answers'])) {
                    $questionsAnswers = $decoded['questions_answers'];
                } else {
                    $questionsAnswers = $decoded;
                }
            }
        }

        return Inertia::render('InterviewPreps/Show', [
            'interviewPrep' => [
                'id' => $InterviewPrepData->id,
                'job' => $InterviewPrepData->job,
                'summary' => $InterviewPrepData->summary,
                'questions_answers' => $questionsAnswers,
                'created_at' => $InterviewPrepData->created_at->format('d M, Y H:i'),
            ],
        ]);
    }

    public function destroy($id)
    {
        $InterviewPrep = InterviewPrep::find($id);
        if (! $InterviewPrep) {
            return back()->with('error', 'Interview Prep not found.');
        }

        $InterviewPrep->delete();

        return redirect()->route('interview-preps.index')->with('success', 'Interview Prep data deleted successfully.');
    }
}
