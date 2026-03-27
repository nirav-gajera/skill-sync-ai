<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('online_exams', function (Blueprint $table) {
            if (! Schema::hasColumn('online_exams', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
            }

            if (! Schema::hasColumn('online_exams', 'resume_id')) {
                $table->foreignId('resume_id')->after('user_id')->constrained('resumes')->onDelete('cascade');
            }

            if (! Schema::hasColumn('online_exams', 'job_description_id')) {
                $table->foreignId('job_description_id')->after('resume_id')->constrained('job_descriptions')->onDelete('cascade');
            }

            if (! Schema::hasColumn('online_exams', 'focus')) {
                $table->string('focus')->nullable()->after('job_description_id');
            }

            if (! Schema::hasColumn('online_exams', 'ai_result')) {
                $table->longText('ai_result')->nullable()->after('focus');
            }

            if (! Schema::hasColumn('online_exams', 'summary')) {
                $table->text('summary')->nullable()->after('ai_result');
            }
        });
    }

    public function down(): void
    {
        Schema::table('online_exams', function (Blueprint $table) {
            if (Schema::hasColumn('online_exams', 'job_description_id')) {
                $table->dropForeign(['job_description_id']);
            }
            if (Schema::hasColumn('online_exams', 'resume_id')) {
                $table->dropForeign(['resume_id']);
            }
            if (Schema::hasColumn('online_exams', 'user_id')) {
                $table->dropForeign(['user_id']);
            }

            $columns = ['user_id', 'resume_id', 'job_description_id', 'focus', 'ai_result', 'summary'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('online_exams', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
