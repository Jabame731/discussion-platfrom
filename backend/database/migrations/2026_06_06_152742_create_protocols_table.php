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
        Schema::create('protocols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->json('tags')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->unsignedInteger('views_count')->default(0);
            
            // Computed/cached columns for performance
            $table->unsignedInteger('reviews_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0.00);
            $table->integer('upvotes_count')->default(0);
            $table->integer('downvotes_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('average_rating');
            $table->fullText(['title', 'content']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('protocols');
    }
};
