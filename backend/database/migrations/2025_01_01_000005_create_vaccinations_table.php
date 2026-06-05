<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaccinations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pet_id')->constrained()->cascadeOnDelete();
            $table->string('vaccine_name');
            $table->date('administered_date');
            $table->date('next_due_date')->nullable()->index();
            $table->string('administered_by')->nullable();
            $table->string('batch_number', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['pet_id', 'administered_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccinations');
    }
};
