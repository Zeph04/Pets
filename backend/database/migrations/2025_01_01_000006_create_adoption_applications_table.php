<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('adoption_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pet_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('applicant_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', [
                'pending', 'reviewing', 'approved', 'rejected', 'completed'
            ])->default('pending')->index();
            $table->text('reason');
            $table->text('living_situation');
            $table->boolean('has_other_pets')->default(false);
            $table->text('other_pets_description')->nullable();
            $table->boolean('has_children')->default(false);
            $table->string('children_ages', 100)->nullable();
            $table->text('experience')->nullable();
            $table->text('references')->nullable();
            $table->date('preferred_date')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['pet_id', 'status']);
            $table->index(['applicant_id', 'status']);
            $table->index('created_at');

            // A user can only have one active application per pet
            $table->unique(['pet_id', 'applicant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('adoption_applications');
    }
};
