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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('protocol_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('feedback')->nullable();
            $table->timestamps();

            // One review per user per protocol
            $table->unique(['user_id', 'protocol_id']);
            $table->index(['protocol_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
