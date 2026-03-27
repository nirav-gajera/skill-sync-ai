<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoverLetter extends Model
{
    use HasFactory;

    protected $table = 'cover_letters';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'resume_id',
        'job_description_id',
        'company_name',
        'ai_result',
        'file_path',
        'template_id',
    ];

    protected $appends = ['file_url'];

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

    public function getFileUrlAttribute(): ?string
    {
        return storageFileUrl($this->file_path);
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:Y-m-d H:i:s',
            'updated_at' => 'datetime:Y-m-d H:i:s',
            'ai_result' => 'array',
        ];
    }
}
