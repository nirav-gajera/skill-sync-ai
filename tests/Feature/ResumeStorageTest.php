<?php

use App\Models\Resume;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('resume uploads use the configured filesystem disk', function () {
    Storage::fake('s3');
    config()->set('filesystems.default', 's3');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/resumes', [
            'name' => 'Backend Resume',
            'file' => UploadedFile::fake()->create('resume.pdf', 10, 'application/pdf'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/resumes');

    $resume = Resume::query()->first();

    expect($resume)->not->toBeNull();
    Storage::disk('s3')->assertExists($resume->file_path);
});

test('resume uploads use the public disk when it is remapped to cloud storage', function () {
    Storage::fake('public');
    config()->set('filesystems.default', 'public');
    config()->set('filesystems.disks.public.driver', 's3');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/resumes', [
            'name' => 'Cloud Resume',
            'file' => UploadedFile::fake()->create('resume.pdf', 10, 'application/pdf'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/resumes');

    $resume = Resume::query()->latest('id')->first();

    expect($resume)->not->toBeNull();
    Storage::disk('public')->assertExists($resume->file_path);
});

test('resume replacement deletes the old file from the configured disk', function () {
    Storage::fake('s3');
    config()->set('filesystems.default', 's3');

    $user = User::factory()->create();
    $existingPath = 'resumes/existing.pdf';

    Storage::disk('s3')->put($existingPath, 'old resume content');

    $resume = Resume::create([
        'user_id' => $user->id,
        'name' => 'Original Resume',
        'file_path' => $existingPath,
    ]);

    $response = $this
        ->actingAs($user)
        ->post("/resumes/{$resume->id}", [
            '_method' => 'PUT',
            'name' => 'Updated Resume',
            'file' => UploadedFile::fake()->create('updated.pdf', 10, 'application/pdf'),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/resumes');

    $resume->refresh();

    Storage::disk('s3')->assertMissing($existingPath);
    Storage::disk('s3')->assertExists($resume->file_path);
});

test('resume deletion removes the file from the configured disk', function () {
    Storage::fake('s3');
    config()->set('filesystems.default', 's3');

    $user = User::factory()->create();
    $filePath = 'resumes/delete-me.pdf';

    Storage::disk('s3')->put($filePath, 'resume content');

    $resume = Resume::create([
        'user_id' => $user->id,
        'name' => 'Delete Resume',
        'file_path' => $filePath,
    ]);

    $response = $this
        ->actingAs($user)
        ->delete("/resumes/{$resume->id}");

    $response->assertRedirect('/resumes');

    Storage::disk('s3')->assertMissing($filePath);
    expect(Resume::find($resume->id))->toBeNull();
});
