<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the old pets table and recreate with full schema
        Schema::dropIfExists('pets');

        Schema::create('pets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('breed');
            $table->string('species', 50)->default('cat');
            $table->date('birthday')->nullable();
            $table->enum('gender', ['male', 'female', 'unknown'])->default('unknown');
            $table->string('color', 100)->nullable();
            $table->text('description')->nullable();
            $table->decimal('weight', 5, 2)->nullable()->comment('Weight in kilograms');
            $table->enum('status', ['available', 'pending', 'adopted', 'unavailable'])->default('available')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->string('featured_image')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Indexes for common filter/sort patterns
            $table->index(['status', 'is_featured']);
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');

        // Restore the original schema if needed
        Schema::create('pets', function (Blueprint $table) {
            $table->uuid('id');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('breed');
            $table->date('birthday');
            $table->string('image')->nullable();
            $table->boolean('for_adoption')->default(false)->nullable();
            $table->integer('heart_count')->nullable();
            $table->timestamps();
        });
    }
};
