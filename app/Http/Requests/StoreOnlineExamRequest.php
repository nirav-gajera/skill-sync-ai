<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOnlineExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'job_id' => [
                'required',
                'integer',
                Rule::exists('job_descriptions', 'id')->where('user_id', $this->user()?->id),
            ],
            'resume_id' => [
                'required',
                'integer',
                Rule::exists('resumes', 'id')->where('user_id', $this->user()?->id),
            ],
            'focus' => ['nullable', 'string', 'max:255'],
            'time_limit_minutes' => ['required', 'integer', 'min:5', 'max:120'],
            'question_count' => ['required', 'integer', 'min:5', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'job_id.required' => 'Select a job description before starting the exam.',
            'job_id.exists' => 'The selected job description is invalid.',
            'resume_id.required' => 'Select a resume before starting the exam.',
            'resume_id.exists' => 'The selected resume is invalid.',
            'time_limit_minutes.required' => 'Choose an exam time limit.',
            'time_limit_minutes.min' => 'The exam time limit must be at least 5 minutes.',
            'time_limit_minutes.max' => 'The exam time limit may not exceed 120 minutes.',
            'question_count.required' => 'Choose how many MCQs should be generated.',
            'question_count.min' => 'Generate at least 5 questions.',
            'question_count.max' => 'Generate no more than 20 questions.',
        ];
    }
}
