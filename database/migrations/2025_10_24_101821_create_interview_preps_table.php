<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('interview_preps')) {
            Schema::create('interview_preps', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('resume_id')->constrained('resumes')->onDelete('cascade');
                $table->foreignId('job_description_id')->constrained('job_descriptions')->onDelete('cascade');
                $table->json('questions_answers')->nullable();
                $table->text('summary')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview_preps');
    }
};
