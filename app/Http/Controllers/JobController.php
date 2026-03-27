<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Job::query();

        if ($user) {
            $query->where('user_id', $user->id);
        }
        // Search filter
        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        $perPage = $request->get('per_page', 10);
        $jobs = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Job::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('jobs.index')->with('success', 'Job created successfully.');
    }

    public function edit(Job $job)
    {
        $this->authorizeJobAccess($job);

        return Inertia::render('Jobs/Edit', ['job' => $job]);
    }

    public function update(Request $request, Job $job)
    {
        $this->authorizeJobAccess($job);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $job->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('jobs.index')->with('success', 'Job updated successfully.');
    }

    public function destroy(Job $job)
    {
        $this->authorizeJobAccess($job);
        $job->delete();

        return redirect()->route('jobs.index')->with('success', 'Job deleted successfully.');
    }

    public function show(Job $job)
    {
        $this->authorizeJobAccess($job);

        return Inertia::render('Jobs/Show', ['job' => $job]);
    }

    /**
     * Ensure job belongs to logged-in user.
     */
    private function authorizeJobAccess(Job $job)
    {
        if ($job->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
