<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pet_medical_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pet_id')->constrained()->cascadeOnDelete();
            $table->enum('record_type', ['checkup', 'surgery', 'emergency', 'deworming', 'dental', 'other'])->index();
            $table->date('visit_date');
            $table->string('vet_name')->nullable();
            $table->string('clinic_name')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('treatment')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['pet_id', 'visit_date']);
            $table->index(['pet_id', 'record_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_medical_records');
    }
};
