<?php

use App\Models\CoverLetter;
use App\Models\Resume;
use Illuminate\Support\Facades\Storage;

test('resume file url uses the configured s3 disk url', function () {
    config()->set('filesystems.default', 's3');

    Storage::shouldReceive('disk')
        ->once()
        ->with('s3')
        ->andReturn(new class
        {
            public function temporaryUrl(string $path, \DateTimeInterface $expiration): string
            {
                expect($expiration)->toBeInstanceOf(\DateTimeInterface::class);

                return 'https://files.example.com/'.$path;
            }
        });

    $resume = new Resume([
        'file_path' => 'resumes/resume.pdf',
    ]);

    expect($resume->file_url)->toBe('https://files.example.com/resumes/resume.pdf');
});

test('cover letter file url uses the configured public disk url', function () {
    config()->set('app.url', 'http://skillsync.test');
    config()->set('filesystems.default', 'public');
    config()->set('filesystems.disks.public.driver', 'local');
    config()->set('filesystems.disks.public.root', storage_path('app/public'));
    config()->set('filesystems.disks.public.url', 'http://skillsync.test/storage');

    $coverLetter = new CoverLetter([
        'file_path' => 'cover_letters/letter.pdf',
    ]);

    expect($coverLetter->file_url)->toBe('http://skillsync.test/storage/cover_letters/letter.pdf');
});
