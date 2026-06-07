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
        Schema::create('threads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('protocol_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('body');
            $table->json('tags')->nullable();
            $table->enum('status', ['open', 'closed', 'pinned'])->default('open');
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->integer('upvotes_count')->default(0);
            $table->integer('downvotes_count')->default(0);
            $table->timestamps();


            $table->index(['protocol_id', 'created_at']);
            $table->index('upvotes_count');
            $table->fullText(['title', 'body']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('threads');
    }
};
