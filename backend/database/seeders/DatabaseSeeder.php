<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Protocol;
use App\Models\Review;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         $this->command->info('SEEDING THE DATA');
         
        //  SEEDING USERS
         $demoUser = User::create([
            'name'              => 'Alex Morgan',
            'username'          => 'alexmorgan',
            'email'             => 'demo@wellness.test',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'bio'               => 'Wellness researcher and protocol enthusiast.',
         ]);

        $users      = User::factory(14)->create();
        $allUsers   = $users->prepend($demoUser);

        // SEEDING PROTOCOLS
        $protocols = Protocol::factory(12)->recycle($allUsers)->create();

        // SEEDING THREADS
        $threads = Thread::factory(10)->recycle($allUsers)->recycle($protocols)->create();

        // SEEDING REVIEWS
        $protocols->each(function ($protocol) use ($allUsers) {
            $reviewers = $allUsers->shuffle()->take(rand(3, 8));

            $reviewers->each(function ($user) use ($protocol) {
                Review::factory()->create([
                    'user_id'     => $user->id,
                    'protocol_id' => $protocol->id,
                ]);
            });

            $protocol->recalculateRating();
        });

        // SEEDING COMMENTS
        $threads->each(function ($thread) use ($allUsers) {
            $rootComments = Comment::factory(rand(3, 6))->recycle($allUsers)->create([
                'thread_id' => $thread->id
            ]);

            $rootComments->random(rand(1, 3))->each(function ($parent) use ($allUsers) {
                Comment::factory(rand(1, 3))->reply($parent)->recycle($allUsers)->create();
            });

            // update cached count
            $thread->comments_count = Comment::where('thread_id', $thread->id)->count();
            $thread->saveQuietly();
        });

        // SEEDING VOTES
        $threads->random(8)->each(function ($thread) use ($allUsers) {
            $allUsers->random(rand(5, 10))->each(function ($user) use ($thread) {
                Vote::firstOrCreate(
                    [
                        'user_id'       => $user->id,
                        'votable_type'  => Thread::class,
                        'votable_id'    => $thread->id
                    ],
                    [
                        'type' => rand(0, 4) === 0 ? 'downvote' : 'upvote'
                    ]
                );
            });

            $thread->recalculateVotes();
        });
 

        // Summary
        $this->command->info('SEEDING DONE');
        $this->command->table(
            ['Resource', 'Count'],
            [
                ['Users',     $allUsers->count()],
                ['Protocols', $protocols->count()],
                ['Threads',   $threads->count()],
                ['Comments',  Comment::count()],
                ['Reviews',   Review::count()],
                ['Votes',     Vote::count()],
            ]
        );
    }

}
