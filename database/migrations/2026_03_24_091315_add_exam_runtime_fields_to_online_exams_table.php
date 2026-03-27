<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('online_exams', function (Blueprint $table) {
            if (! Schema::hasColumn('online_exams', 'status')) {
                $table->string('status')->default('in_progress')->after('summary');
            }

            if (! Schema::hasColumn('online_exams', 'questions')) {
                $table->json('questions')->nullable()->after('status');
            }

            if (! Schema::hasColumn('online_exams', 'submitted_answers')) {
                $table->json('submitted_answers')->nullable()->after('questions');
            }

            if (! Schema::hasColumn('online_exams', 'evaluation_result')) {
                $table->json('evaluation_result')->nullable()->after('submitted_answers');
            }

            if (! Schema::hasColumn('online_exams', 'question_count')) {
                $table->unsignedInteger('question_count')->default(10)->after('evaluation_result');
            }

            if (! Schema::hasColumn('online_exams', 'time_limit_minutes')) {
                $table->unsignedInteger('time_limit_minutes')->default(20)->after('question_count');
            }

            if (! Schema::hasColumn('online_exams', 'started_at')) {
                $table->timestamp('started_at')->nullable()->after('time_limit_minutes');
            }

            if (! Schema::hasColumn('online_exams', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('started_at');
            }

            if (! Schema::hasColumn('online_exams', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->after('expires_at');
            }

            if (! Schema::hasColumn('online_exams', 'time_taken_seconds')) {
                $table->unsignedInteger('time_taken_seconds')->nullable()->after('submitted_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('online_exams', function (Blueprint $table) {
            $columns = [
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

            foreach ($columns as $column) {
                if (Schema::hasColumn('online_exams', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
