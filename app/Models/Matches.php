<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    protected $table = 'matches';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'resume_id',
        'job_description_id',
        'match_percentage',
        'semantic_score',
        'keyword_score',
        'keyword_gap',
        'ai_result',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'ai_result' => 'array',
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
