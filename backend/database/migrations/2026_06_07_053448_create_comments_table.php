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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('thread_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->nullOnDelete();
            $table->longText('body');
            $table->integer('upvotes_count')->default(0);
            $table->integer('downvotes_count')->default(0);
            $table->boolean('is_deleted')->default(false); // soft-delete content but preserve tree
            $table->timestamps();

            $table->index(['thread_id', 'parent_id']);
            $table->index(['thread_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
