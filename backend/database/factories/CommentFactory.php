<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    private static array $bodies = [
        'Really appreciate you sharing this. I had almost the exact same experience around week 3 — something just clicks.',
        'Have you looked into the research on cold thermogenesis? The mechanism makes sense once you understand the hormonal cascade.',
        'Shift worker here too. The anchor-to-wake-time approach is what I ended up doing. Took about 3 weeks to stabilize.',
        'Thank you for posting actual results. This is the kind of data we need more of in this community.',
        'This is such an important point. I wish more protocol authors addressed the hormonal cycle considerations.',
        'Week 1 was brutal for me too. Kept a journal and looking back the data clearly shows the trough before the improvement.',
        'The 21-day thing likely comes from synaptic plasticity research, not wellness-specific literature. The mechanism is real but the timeframe is approximated.',
        'Cold shower is underrated. After 2 months it genuinely became as effective as a plunge for the mental aspects.',
        'I had the same sleep disruption in week 1. It passed. Stick with it.',
        'Weekly check-ins are the way. Daily tracking is optimizing for the feeling of control, not actual outcomes.',
        'Morning breathwork on an empty stomach is most potent. The CO2 tolerance work especially.',
        'Which specific panels did you run? I want to replicate this for my own tracking.',
        'The combination of community and protocol is what made the difference. Hard to isolate the variable.',
        'I think the adaptation phase is being underestimated here. Give it at least 4 weeks before judging.',
        'Electrolytes were the missing piece for me. Once I dialed that in, everything else followed.',
        'Modified this for shift work and it took about a month to find the right anchoring approach.',
        'Anyone combining this with zone 2 cardio? Curious about the interaction between the two.',
        'The safety notes are important — please read them before jumping to advanced stages.',
        'I brought this to my doctor and she was actually impressed with the cited research.',
        'Started skeptically, three months in and I would not go back. The results compound over time.',
    ];

    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'thread_id'        => Thread::factory(),
            'parent_id'        => null,
            'body'             => fake()->randomElement(static::$bodies),
            'is_deleted'       => false,
        ];
    }

    public function reply(Comment $parent): static
    {
        return $this->state(fn () => [
            'thread_id' => $parent->thread_id,
            'parent_id' => $parent->id,
        ]);
    }
}