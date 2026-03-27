<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterviewPrep extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $primarykey = 'id';

    protected $table = 'interview_preps';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'resume_id',
        'job_description_id',
        'questions_answers',
        'summary',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'questions_answers' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_description_id');
    }
}
