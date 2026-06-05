<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adoption_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('application_id')->constrained('adoption_applications')->cascadeOnDelete();
            $table->enum('status', ['pending', 'reviewing', 'approved', 'rejected', 'completed']);
            $table->text('notes')->nullable();
            $table->foreignUuid('changed_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['application_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adoption_statuses');
    }
};
