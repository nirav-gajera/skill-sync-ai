<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('cover_letters', function (Blueprint $table) {
            if (! Schema::hasColumn('cover_letters', 'template_id')) {
                $table->unsignedTinyInteger('template_id')->default(0)->after('file_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('cover_letters', function (Blueprint $table) {
            if (Schema::hasColumn('cover_letters', 'template_id')) {
                $table->dropColumn('template_id');
            }
        });
    }
};
