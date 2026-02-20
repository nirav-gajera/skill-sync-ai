<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    const DISK = 'public;

    public function index(Request $request)
    {
        $query = Resume::where('user_id', Auth::id());

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $perPage = $request->get('per_page', 10);

        $resumes = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Resumes/Index', [
            'resumes' => $resumes,
            'filters' => $request->only(['search']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Resumes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,txt,json,xml',
        ]);

        $filePath = $request->file('file')->store('resumes', self::DISK);

        Resume::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'file_path' => $filePath,
        ]);

        return redirect()->route('resumes.index')->with('success', 'Resume uploaded successfully.');
    }

    public function edit(Resume $resume)
    {
        $this->authorizeResumeAccess( $resume);
        return Inertia::render('Resumes/Edit', ['resume' => $resume]);
    }

    public function update(Request $request, Resume $resume)
    {
        $this->authorizeResumeAccess( $resume);
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt,json,xml',
        ]);

        $data = ['name' => $request->name];

        if ($request->hasFile('file')) {
            Storage::disk(self::DISK)->delete($resume->file_path);

            $data['file_path'] = $request->file('file')->store('resumes', self::DISK);
        }

        $resume->update($data);

        return redirect()->route('resumes.index')->with('success', 'Resume updated successfully.');
    }

    public function destroy(Resume $resume)
    {
        $this->authorizeResumeAccess( $resume);
        Storage::disk(self::DISK)->delete($resume->file_path);

        $resume->delete();

        return redirect()->route('resumes.index')->with('success', 'Resume deleted successfully.');
    }
    private function authorizeResumeAccess(Resume $resume)
    {
        if ($resume->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }

}
