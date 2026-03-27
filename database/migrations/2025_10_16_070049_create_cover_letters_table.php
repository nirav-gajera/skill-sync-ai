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
        if (! Schema::hasTable('cover_letters')) {
            Schema::create('cover_letters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('resume_id')->constrained('resumes')->onDelete('cascade');
                $table->foreignId('job_description_id')->constrained('job_descriptions')->onDelete('cascade');
                $table->string('company_name')->nullable();
                $table->longText('ai_result')->nullable();
                $table->string('file_path')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cover_letters');
    }
};
