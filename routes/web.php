<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CoverLetterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InterviewPrepController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\OnlineExamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResumeController;
use App\Models\Resume;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

// Route::get('/', function () {
//     return Auth::check() ? redirect()->route('dashboard') : redirect()->route('login');
// });

Route::get('/', [HomeController::class, 'index'])->name('home');
/*
|--------------------------------------------------------------------------|
| Authenticated Routes                                                     |
|--------------------------------------------------------------------------|
*/

Route::get('/resumes/view/{filename}', function (string $filename) {
    abort_unless(Auth::check(), 403);

    $resume = Resume::where('user_id', Auth::id())
        ->get(['file_path'])
        ->first(function (Resume $resume) use ($filename): bool {
            return basename($resume->file_path) === $filename;
        });

    abort_unless($resume, 404);

    return redirect()->away(storageFileUrl($resume->file_path));
});

Route::middleware(['auth'])->group(function () {
    // Verified routes
    Route::middleware('verified')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('jobs', JobController::class);
        Route::get('/logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index')->middleware(['auth']);
    });

    //  interview prep route:
    Route::resource('interview-preps', InterviewPrepController::class);
    // Resume routes
    Route::resource('resumes', ResumeController::class);
    Route::resource('cover-letters', CoverLetterController::class);
    Route::post('cover-letters/{coverLetter}/update', [CoverLetterController::class, 'update'])->name('cover-letters.update');
    Route::post('cover-letters/{coverLetter}/preview', [CoverLetterController::class, 'preview'])->name('cover-letters.preview');
    Route::get('/cover-letters/{id}', [CoverLetterController::class, 'show'])->name('coverLetters.show');
    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::resource('online-exams', OnlineExamController::class);

    // Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('/', [AnalyticsController::class, 'index'])->name('analytics.index');
        Route::post('/scan', [AnalyticsController::class, 'scan'])->name('analytics.scan');
        Route::delete('/{match}', [AnalyticsController::class, 'destroy'])->name('analytics.destroy');
        Route::get('/match-history/{id}', [AnalyticsController::class, 'showMatchHistory'])->name('analytics.match-history');
    });
});
