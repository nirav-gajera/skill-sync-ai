<?php

namespace App\Http\Controllers;

use App\AppNeuronMyAgent;
use App\Models\Matches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia; 
use App\Models\Job;
use App\Models\Resume;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    // Show Analytics page
    public function index(Request $request)
    {
        $userId = Auth::id();

        $jobs = Job::where('user_id', $userId)->latest()->get(['id', 'title', 'description']);
        $resumes = Resume::where('user_id', $userId)->latest()->get(['id', 'name', 'file_path']);

        $perPage = $request->get('per_page', 10);
        $matchedHistory = Matches::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
        $matchedHistoryData = $matchedHistory->map(function ($match) use ($jobs) {
            $resume = $match->resume;

            $aiData = [];
            if ($match->ai_result && is_string($match->ai_result)) {
                $decoded = json_decode($match->ai_result, true);
                $aiData = $decoded ?: ['ai_text' => $match->ai_result];
            }

            $aiData['overall_match_percentage'] = $match->match_percentage ?? 0;
            $aiData['scores'] = [
                'semantic_score' => $match->semantic_score ?? 0,
                'keyword_score' => $match->keyword_score ?? 0,
                'keyword_gap' => $match->keyword_gap ?? 0,
            ];


            return [
                'id' => $match->id,
                'resume_id' => $match->resume_id,
                'job_description_id' => $match->job_description_id,
                'created_at' => $match->created_at,
                'resume_name' => $resume->name ?? 'N/A',
                'ai_result' => $aiData,
            ];
        });

        return Inertia::render('Analytics/Index', [
            'jobs' => $jobs,
            'resumes' => $resumes,
            'matchedHistory' => $matchedHistoryData,
            'pagination' => $matchedHistory,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function showMatchHistory($id)
    {
        $match = Matches::with('job', 'resume')->findOrFail($id);

        $aiData = match (true) {
            is_string($match->ai_result) => json_decode($match->ai_result, true) ?: ['ai_text' => $match->ai_result],
            is_array($match->ai_result) => $match->ai_result,
            is_object($match->ai_result) => (array) $match->ai_result,
            default => [],
        };

        $aiData['overall_match_percentage'] = $match->match_percentage ?? 0;
        $aiData['scores'] = [
            'semantic_score' => $match->semantic_score ?? 0,
            'keyword_score' => $match->keyword_score ?? 0,
            'keyword_gap' => $match->keyword_gap ?? 0,
        ];

        $aiData['ats_best_practice'] = $aiData['ats_best_practice'] ?? [];
        $aiData['skills_analysis'] = $aiData['skills_analysis'] ?? [];

        return Inertia::render('Analytics/MatchHistory', [
            'match' => $match,
            'aiData' => $aiData,
            'jobTitle' => $match->job->title ?? 'N/A',
            'resumeName' => $match->resume->name ?? 'N/A',
        ]);
    }



    public function scan(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'job_id' => "required|exists:job_descriptions,id,user_id,{$userId}",
            'resume_ids' => 'required|array|min:1',
            'resume_ids.*' => "exists:resumes,id,user_id,{$userId}",
        ]);

        // Get Job data
        $job = Job::where('id', $validated['job_id'])->where('user_id', $userId)->first();
        if (!$job)
            return back()->with('error', 'Job not found');

        $jobTitle = $job->title;
        $jobDescription = $job->description ?? '';

        // Collect resume data
        $resumesData = [];
        $resumeFileTypes = [];
        foreach ($validated['resume_ids'] as $resumeId) {
            $resume = Resume::where('id', $resumeId)->where('user_id', $userId)->first();
            if (!$resume)
                continue;

            $filePath = storage_path('app/public/' . $resume->file_path);
            $content = '';
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION)) ?? 'UNKNOWN';

            $content = extractResumeContent($filePath);

            $resumesData[] = [
                'id' => $resume->id,
                'name' => $resume->name,
                'content' => $content,
            ];
            $resumeFileTypes[$resume->id] = strtoupper($ext);
        }

        // --- AI Analysis ---
        try {
            $agent = new AppNeuronMyAgent();
            $aiResult = $agent->analyzeJobAndResumes($jobTitle, $jobDescription, $resumesData, $resumeFileTypes);
        } catch (\Exception $e) {
            Log::error("Error during AI analysis: " . $e->getMessage());
            return back()->with('error', 'AI scan failed. Check logs for details.');
        }

        // --- Parse and Save ---
        try {
            $cleanedAiResult = preg_replace('/^```(json)?\s*/i', '', trim($aiResult));
            $cleanedAiResult = preg_replace('/\s*```$/', '', $cleanedAiResult);
            $parsedResults = json_decode($cleanedAiResult, true);

            if (!is_array($parsedResults)) {
                throw new \Exception('Invalid AI result format.');
            }

            foreach ($resumesData as $index => $resume) {
                $resumeResult = $parsedResults[$index] ?? [];
                if (!$resumeResult)
                    continue;
                // Ensure numeric values
                $matchPercentage = $resumeResult['overall_match_percentage'] ?? 0;
                $semanticScore = $resumeResult['scores']['semantic_score'] ?? 0;
                $keywordScore = $resumeResult['scores']['keyword_score'] ?? 0;
                $keywordGap = $resumeResult['scores']['keyword_gap'] ?? 0;

                // Format ATS Best Practices if missing
                if (empty($resumeResult['ats_best_practice'])) {
                    $resumeResult['ats_best_practice'] = [
                        'resume_file_type' => "Your resume is a {$resumeFileTypes[$resume['id']]}, which can be scanned by ATS systems.",
                        'email_address' => "Check that your email address is on your resume.",
                        'phone_number' => "Check that your phone number is on your resume.",
                        'linkedin_profile' => "Include LinkedIn profile for better ATS scoring.",
                        'job_title_match' => "Include your target job title.",
                        'education_match' => "Make sure your education matches JD requirements.",
                        'experience_match' => "Include your relevant experience clearly.",
                        'ats_score' => 0 // default, AI will update if possible
                    ];
                }

                // Compute skills analysis if missing
                if (empty($resumeResult['skills_analysis'])) {
                    $jdKeywords = collect(preg_split('/\s+/', $jobDescription));
                    $resumeKeywords = collect(preg_split('/\s+/', $resume['content']));
                    $skillsAnalysis = [];
                    foreach ($jdKeywords as $keyword) {
                        $resumeCount = $resumeKeywords->filter(fn($k) => strtolower($k) === strtolower($keyword))->count();
                        $jobCount = 1;
                        $skillsAnalysis[] = [
                            'skill' => $keyword,
                            'resume_count' => $resumeCount,
                            'job_count' => $jobCount,
                            'gap' => $jobCount - $resumeCount,
                            'matched' => $resumeCount >= $jobCount,
                        ];
                    }
                    $resumeResult['skills_analysis'] = $skillsAnalysis;
                }

                // Safely encode AI result
                $aiJson = json_encode($resumeResult, JSON_UNESCAPED_UNICODE);
                if ($aiJson === false) {
                    Log::error('json_encode failed', [
                        'resume_id' => $resume['id'],
                        'error' => json_last_error_msg(),
                        'data' => $resumeResult
                    ]);
                    throw new \Exception('json_encode failed: ' . json_last_error_msg());
                }

                Matches::create([
                    'user_id' => $userId,
                    'resume_id' => $resume['id'],
                    'job_description_id' => $job->id,
                    'match_percentage' => $matchPercentage,
                    'semantic_score' => $semanticScore,
                    'keyword_score' => $keywordScore,
                    'keyword_gap' => $keywordGap,
                    'ai_result' => $aiJson,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error saving AI results', [
                'exception' => $e->getMessage(),
                'ai_result' => $aiResult
            ]);
            return back()->with('error', 'Failed to save AI scan results. Check logs.');
        }

        return redirect()->route('analytics.index')->with('flash', ['success' => 'Scan completed successfully!']);
    }

    public function destroy($id)
    {
        $match = Matches::find($id);
        if (!$match) {
            return back()->with('error', 'Match not found.');
        }
        $match->delete();

        return redirect()->route('analytics.index')->with('flash', ['success' => 'Match Deleted successfully!']);
    }

}
