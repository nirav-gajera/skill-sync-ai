<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnlineExam extends Model
{
    use HasFactory;

    protected $table = 'online_exams';

    protected $fillable = [
        'user_id',
        'resume_id',
        'job_description_id',
        'focus',
        'ai_result',
        'summary',
        'status',
        'questions',
        'submitted_answers',
        'evaluation_result',
        'question_count',
        'time_limit_minutes',
        'started_at',
        'expires_at',
        'submitted_at',
        'time_taken_seconds',
    ];

    protected function casts(): array
    {
        return [
            'ai_result' => 'array',
            'questions' => 'array',
            'submitted_answers' => 'array',
            'evaluation_result' => 'array',
            'started_at' => 'datetime:Y-m-d H:i:s',
            'expires_at' => 'datetime:Y-m-d H:i:s',
            'submitted_at' => 'datetime:Y-m-d H:i:s',
            'created_at' => 'datetime:Y-m-d H:i:s',
            'updated_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class, 'job_description_id');
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
