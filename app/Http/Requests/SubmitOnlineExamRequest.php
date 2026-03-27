<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitOnlineExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array'],
            'answers.*.question_index' => ['required', 'integer', 'min:0'],
            'answers.*.selected_option' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'Submit at least one exam answer payload.',
            'answers.array' => 'The submitted answers are invalid.',
        ];
    }
}
