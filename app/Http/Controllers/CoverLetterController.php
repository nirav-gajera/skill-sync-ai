<?php

namespace App\Http\Controllers;

use App\AppNeuronMyAgent;
use App\Models\CoverLetter;
use App\Models\Job;
use App\Models\Resume;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CoverLetterController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $perPage = $request->input('per_page', 10);

        // Fetch user's cover letters with relations
        $coverLetters = CoverLetter::with(['resume', 'job'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage)
            ->appends(['per_page' => $perPage]);

        $jobs = Job::where('user_id', $userId)->latest()->get(['id', 'title', 'description']);
        $resumes = Resume::where('user_id', $userId)->latest()->get(['id', 'name', 'file_path']);

        return Inertia::render('CoverLetters/Index', [
            'coverLetters' => $coverLetters,
            'jobs' => $jobs,
            'resumes' => $resumes,
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

        $templates = [
            [
                'id' => 0,
                'name' => 'Classic',
                'preview' => asset('images/cover_letter_sample_0.jpg'),

            ],
            [
                'id' => 1,
                'name' => 'Modern',
                'preview' => asset('images/cover_letter_sample_1.jpg'),

            ],
            [
                'id' => 2,
                'name' => 'Elegant',
                'preview' => asset('images/cover_letter_sample_2.jpg'),

            ],
            [
                'id' => 3,
                'name' => 'Ivy League',
                'preview' => asset('images/cover_letter_sample_3.jpg') ?? '',

            ],
        ];

        return Inertia::render('CoverLetters/Create', [
            'jobs' => $jobs,
            'resumes' => $resumes,
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'job_id' => 'required',
            'resume_id' => 'required',
            'company_name' => 'required|string|max:255',
            'template_id' => 'required',
        ]);

        // --- Get Job data ---
        $job = Job::where('id', $validated['job_id'])->where('user_id', $userId)->first();
        if (!$job) {
            return back()->with('error', 'Job not found.');
        }

        $jobTitle = $job->title;
        $jobDescription = $job->description ?? '';
        $companyName = $validated['company_name'];

        // --- Get Resume data ---
        $resume = Resume::where('id', $validated['resume_id'])
            ->where('user_id', $userId)
            ->first();

        if (!$resume) {
            Log::error('Resume not found in DB', [
                'user_id' => $userId,
                'resume_id' => $validated['resume_id'],
            ]);
            return back()->with('error', 'Resume not found.');
        }

        // --- Extract content from resume ---
        try {
            $content = withStoredFile($resume->file_path, function (string $filePath): string {
                return extractResumeContent($filePath);
            });
        } catch (\Exception $e) {
            Log::error("Resume extraction failed: " . $e->getMessage());
            return back()->with('error', 'Failed to extract resume content.');
        }

        // --- Optimize AI input ---
        $content = \Illuminate\Support\Str::limit($content, 2000);
        $jobDescription = \Illuminate\Support\Str::limit($jobDescription, 1500);

        // --- AI Generation ---
        try {
            $agent = new AppNeuronMyAgent;
            $aiResult = $agent->createCoverLetterData(
                $jobTitle,
                $jobDescription,
                [['id' => $resume->id, 'content' => $content]],
                $companyName
            );
        } catch (\Exception $e) {
            Log::error("AI error: " . $e->getMessage());
            return back()->with('error', 'AI generation failed.');
        }
        // --- Parse and Save ---
        try {
            $data = json_decode($aiResult, true);

            if (!$data || !isset($data['cover_letter_html'])) {
                return back()->with('error', 'AI returned invalid data.');
            }

            $applicantName = $data['applicant_name'] ?? 'Applicant';
            $email = $data['email'] ?? '';
            $phone = $data['phone'] ?? '';
            $linkedin = $data['linkedin'] ?? '';
            $coverLetterHtml = $data['cover_letter_html'] ?? '';

            $pdfFileName = 'cover_letter_'.time().'.pdf';
            $pdfDiskPath = 'cover_letters/'.$pdfFileName;

            $templateId = (int) $validated['template_id'];
            $view = coverLetterTemplateView($templateId);

            // --- PDF generation ---
            $html = view($view, [
                'name' => $applicantName,
                'email' => $email,
                'phone' => $phone,
                'linkedin' => $linkedin,
                'coverLetterHtml' => $coverLetterHtml,
                'emailIcon' => asset('images/email.png'),
                'phoneIcon' => asset('images/phone.png'),
                'linkedinIcon' => asset('images/linkedin.png'),
            ])->render();

            $pdfContent = Pdf::loadHTML($html)
                ->setPaper('a4')
                ->setOption('isRemoteEnabled', true)
                ->output();

            Storage::disk(storageDiskName())->put($pdfDiskPath, $pdfContent, ['visibility' => 'public']);

            // --- Save DB record ---
            CoverLetter::create([
                'user_id' => $userId,
                'resume_id' => $resume->id,
                'job_description_id' => $job->id,
                'company_name' => $companyName,
                'template_id' => $templateId,
                'ai_result' => $data,
                'file_path' => $pdfDiskPath,
            ]);

        } catch (\Exception $e) {
            Log::error('Error saving AI results or generating PDF: ' . $e->getMessage(), [
                'ai_result' => $aiResult,
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Failed to save cover letter. Check logs.');
        }

        return redirect()->route('cover-letters.index')->with('success', 'Cover letter generated successfully!');
    }

    public function show($id)
    {
        $coverLetter = CoverLetter::findOrFail($id);

        $data = is_array($coverLetter->ai_result)
            ? $coverLetter->ai_result
            : json_decode($coverLetter->ai_result, true);

        // PDF paths (for barryvdh PDF generation)
        $emailIconPDF = public_path('images/email.png');
        $phoneIconPDF = public_path('images/phone.png');
        $linkedinIconPDF = public_path('images/linkedin.png');

        // Web paths (for preview in React)
        $emailIconWeb = asset('images/email.png');
        $phoneIconWeb = asset('images/phone.png');
        $linkedinIconWeb = asset('images/linkedin.png');

        $templateId = $coverLetter->template_id;
        $view = coverLetterTemplateView($templateId);

        $html = view($view, [
            'name' => $data['applicant_name'] ?? 'Applicant',
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? '',
            'linkedin' => $data['linkedin'] ?? '',
            'coverLetterHtml' => $data['cover_letter_html'] ?? '',
            // use PDF icons here for generating PDF
            'emailIcon' => $emailIconPDF,
            'phoneIcon' => $phoneIconPDF,
            'linkedinIcon' => $linkedinIconPDF,
        ])->render();

        return Inertia::render('CoverLetters/Show', [
            'coverLetter' => [
                'id' => $coverLetter->id,
                'company_name' => $coverLetter->company_name,
                // for React preview, use web-accessible icons
                'html' => str_replace(
                    [$emailIconPDF, $phoneIconPDF, $linkedinIconPDF],
                    [$emailIconWeb, $phoneIconWeb, $linkedinIconWeb],
                    $html
                ),
            ],
        ]);
    }
    public function edit($id)
    {
        $coverLetter = CoverLetter::findOrFail($id);

        $aiResult = is_array($coverLetter->ai_result)
            ? $coverLetter->ai_result
            : json_decode($coverLetter->ai_result, true);

        $templateId = $coverLetter->template_id;
        $view = coverLetterTemplateView($templateId);

        $templates = [
            [
                'id' => 0,
                'name' => 'Classic',
                'preview' => asset('images/cover_letter_sample_0.jpg'),

            ],
            [
                'id' => 1,
                'name' => 'Modern',
                'preview' => asset('images/cover_letter_sample_1.jpg'),

            ],
            [
                'id' => 2,
                'name' => 'Elegant',
                'preview' => asset('images/cover_letter_sample_2.jpg'),

            ],
            [
                'id' => 3,
                'name' => 'Ivy League',
                'preview' => asset('images/cover_letter_sample_3.jpg'),

            ],
        ];
        $html = view($view, [
            'name' => $aiResult['applicant_name'] ?? 'Applicant',
            'email' => $aiResult['email'] ?? '',
            'phone' => $aiResult['phone'] ?? '',
            'linkedin' => $aiResult['linkedin'] ?? '',
            'coverLetterHtml' => $aiResult['cover_letter_html'] ?? '',
            'emailIcon' => asset('images/email.png'),
            'phoneIcon' => asset('images/phone.png'),
            'linkedinIcon' => asset('images/linkedin.png'),
        ])->render();

        return Inertia::render('CoverLetters/Edit', [
            'coverLetter' => [
                'id' => $coverLetter->id,
                'company_name' => $coverLetter->company_name,
                'ai_result' => $aiResult,
                'templates' => $templates,
                'template_id' => $templateId,
                'html' => $html,
            ],
        ]);
    }


    public function update(Request $request, CoverLetter $coverLetter)
    {
        $aiResult = $request->ai_result;

        if (is_string($aiResult)) {
            $aiResult = json_decode($aiResult, true);
        }

        $coverLetter->update([
            'company_name' => $request->company_name,
            'ai_result' => json_encode($aiResult, JSON_UNESCAPED_UNICODE),
            'template_id' => $request->template_id,
        ]);

        $templateId = $coverLetter->template_id;
        $view = coverLetterTemplateView($templateId);

        if ($coverLetter->file_path) {
            $pdfContent = Pdf::loadView($view, [
                'name' => $aiResult['applicant_name'] ?? 'Applicant',
                'email' => $aiResult['email'] ?? '',
                'phone' => $aiResult['phone'] ?? '',
                'linkedin' => $aiResult['linkedin'] ?? '',
                'coverLetterHtml' => $aiResult['cover_letter_html'] ?? '',
                'emailIcon' => public_path('images/email.png'),
                'phoneIcon' => public_path('images/phone.png'),
                'linkedinIcon' => public_path('images/linkedin.png'),
            ])->output();

            Storage::disk(storageDiskName())->put($coverLetter->file_path, $pdfContent, ['visibility' => 'public']);
        }

        return redirect()->route('cover-letters.index')->with('success', 'Cover Letter updated successfully!');
    }

    public function preview(Request $request, CoverLetter $coverLetter)
    {
        $aiResult = $request->ai_result;
        $templateId = $request->template_id ?? 0;
        $view = coverLetterTemplateView($templateId);

        $emailIconWeb = asset('images/email.png');
        $phoneIconWeb = asset('images/phone.png');
        $linkedinIconWeb = asset('images/linkedin.png');

        $html = view($view, [
            'name' => $aiResult['applicant_name'] ?? 'Applicant',
            'email' => $aiResult['email'] ?? '',
            'phone' => $aiResult['phone'] ?? '',
            'linkedin' => $aiResult['linkedin'] ?? '',
            'coverLetterHtml' => $aiResult['cover_letter_html'] ?? '',
            'emailIcon' => $emailIconWeb,
            'phoneIcon' => $phoneIconWeb,
            'linkedinIcon' => $linkedinIconWeb,
        ])->render();

        return response()->json(['html' => $html]);
    }


    public function destroy($id)
    {
        $CoverLetter = CoverLetter::find($id);
        if (!$CoverLetter) {
            return back()->with('error', 'Cover Letter not found.');
        }

        if ($CoverLetter->file_path) {
            Storage::disk(storageDiskName())->delete($CoverLetter->file_path);
        }

        $CoverLetter->delete();

        return redirect()->route('cover-letters.index')->with('flash', ['success' => 'Cover Letter  Deleted successfully!']);
    }
}
