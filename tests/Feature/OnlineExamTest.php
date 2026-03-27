<?php

use App\AppNeuronMyAgent;
use App\Models\Job;
use App\Models\OnlineExam;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('a user can start an online exam from a resume and job description', function () {
    Storage::fake('public');
    config(['filesystems.default' => 'public']);

    $user = User::factory()->create();
    $job = Job::create([
        'user_id' => $user->id,
        'title' => 'Frontend Engineer',
        'description' => 'Build React interfaces and collaborate with designers.',
    ]);
    Storage::disk('public')->put('resumes/frontend.txt', 'React JavaScript Tailwind testing');
    $resume = Resume::create([
        'user_id' => $user->id,
        'name' => 'Frontend Resume',
        'file_path' => 'resumes/frontend.txt',
    ]);

    $mock = \Mockery::mock(AppNeuronMyAgent::class);
    $mock->shouldReceive('createOnlineExamSession')
        ->once()
        ->andReturn(json_encode([
            'summary' => 'Strong frontend fit.',
            'questions' => [
                [
                    'question' => 'Which hook handles local state in React?',
                    'choices' => ['useState', 'useRoute', 'useLink', 'useVisit'],
                    'answer' => 'useState',
                    'explanation' => 'useState manages local component state.',
                ],
                [
                    'question' => 'Which utility is part of Tailwind CSS?',
                    'choices' => ['bg-cyan-500', 'display:block()', 'route()', 'queue:work'],
                    'answer' => 'bg-cyan-500',
                    'explanation' => 'bg-cyan-500 is a valid Tailwind utility class.',
                ],
            ],
        ]));
    app()->instance(AppNeuronMyAgent::class, $mock);

    $response = $this
        ->actingAs($user)
        ->post('/online-exams', [
            'job_id' => $job->id,
            'resume_id' => $resume->id,
            'focus' => 'Frontend fundamentals',
            'time_limit_minutes' => 15,
            'question_count' => 8,
        ]);

    $exam = OnlineExam::first();

    $response->assertRedirect(route('online-exams.show', $exam));

    expect($exam)->not->toBeNull();
    expect($exam->status)->toBe('in_progress');
    expect($exam->question_count)->toBe(2);
    expect($exam->time_limit_minutes)->toBe(15);
    expect($exam->summary)->toBe('Strong frontend fit.');
    expect($exam->questions)->toHaveCount(2);
    expect($exam->started_at)->not->toBeNull();
    expect($exam->expires_at)->not->toBeNull();
});

test('a user can submit an online exam and store the evaluated result', function () {
    $user = User::factory()->create();
    $job = Job::create([
        'user_id' => $user->id,
        'title' => 'Frontend Engineer',
        'description' => 'Build React interfaces and collaborate with designers.',
    ]);
    $resume = Resume::create([
        'user_id' => $user->id,
        'name' => 'Frontend Resume',
        'file_path' => 'resumes/frontend.txt',
    ]);
    $exam = OnlineExam::create([
        'user_id' => $user->id,
        'resume_id' => $resume->id,
        'job_description_id' => $job->id,
        'status' => 'in_progress',
        'summary' => 'Exam summary',
        'questions' => [
            [
                'question_index' => 0,
                'question' => 'Which hook handles local state in React?',
                'type' => 'multiple_choice',
                'choices' => ['useState', 'useRoute', 'useLink', 'useVisit'],
                'answer' => 'useState',
                'explanation' => 'useState manages local state.',
            ],
            [
                'question_index' => 1,
                'question' => 'Which utility is part of Tailwind CSS?',
                'type' => 'multiple_choice',
                'choices' => ['bg-cyan-500', 'display:block()', 'route()', 'queue:work'],
                'answer' => 'bg-cyan-500',
                'explanation' => 'bg-cyan-500 is a Tailwind utility.',
            ],
        ],
        'question_count' => 2,
        'time_limit_minutes' => 20,
        'started_at' => now()->subMinutes(4),
        'expires_at' => now()->addMinutes(16),
    ]);

    $mock = \Mockery::mock(AppNeuronMyAgent::class);
    $mock->shouldReceive('evaluateOnlineExam')
        ->once()
        ->andReturn(json_encode([
            'score' => 1,
            'correct_answers' => 1,
            'total_questions' => 2,
            'percentage' => 50,
            'summary' => 'The candidate got one answer right.',
            'results' => [
                [
                    'question_index' => 0,
                    'is_correct' => true,
                    'explanation' => 'useState is the correct hook.',
                ],
                [
                    'question_index' => 1,
                    'is_correct' => false,
                    'explanation' => 'The selected answer is not a Tailwind class.',
                ],
            ],
        ]));
    app()->instance(AppNeuronMyAgent::class, $mock);

    $response = $this
        ->actingAs($user)
        ->put("/online-exams/{$exam->id}", [
            'answers' => [
                ['question_index' => 0, 'selected_option' => 'useState'],
                ['question_index' => 1, 'selected_option' => 'route()'],
            ],
        ]);

    $response->assertRedirect(route('online-exams.show', $exam));

    $exam->refresh();

    expect($exam->status)->toBe('completed');
    expect($exam->submitted_answers)->toHaveCount(2);
    expect($exam->evaluation_result['percentage'])->toBe(50);
    expect($exam->evaluation_result['correct_answers'])->toBe(1);
    expect($exam->evaluation_result['results'])->toHaveCount(2);
    expect($exam->submitted_at)->not->toBeNull();
    expect($exam->time_taken_seconds)->toBeGreaterThan(0);
});
