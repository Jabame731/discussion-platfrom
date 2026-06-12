<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoteFactory extends Factory
{
    protected $model = Vote::class;

    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'votable_type' => Thread::class,
            'votable_id'   => Thread::factory()->create()->id,
            'type'         => fake()->randomElement(['upvote', 'upvote', 'upvote', 'downvote']),
        ];
    }

    public function forComment(): static
    {
        return $this->state(fn () => [
            'votable_type' => Comment::class,
            'votable_id'   => Comment::factory()->create()->id,
        ]);
    }
}