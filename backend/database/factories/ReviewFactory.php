<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    private static array $feedbackSamples = [
        'This protocol genuinely changed my sleep quality. Worth the initial discomfort.',
        'Solid science-backed approach. I appreciated the gradual progression.',
        'Followed this for 8 weeks. Noticed improved energy levels around week 4.',
        'Good starting point but I had to modify it for my schedule.',
        'Excellent depth of explanation. The safety notes are essential reading.',
        'Took three attempts to stick with it. The community support helps enormously.',
        'Backed by real research. This is not just another biohacking fad.',
        'Mixed results for me personally but I can see why others swear by it.',
        'The best protocol I have found for this specific issue. Clear and actionable.',
        'Evidence-based and practical. Highly recommend to anyone serious about this.',
        'Week 1 is rough but push through. The results after week 3 are undeniable.',
        'I brought this to my doctor and she was impressed with the cited research.',
        'The progression structure is very intentional. Week by week felt well designed.',
        'Some parts were hard to apply in a busy household but the core concept works.',
        'Life-changing for my chronic fatigue. Took about 6 weeks to feel the full effect.',
    ];

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'protocol_id' => Protocol::factory(),
            'rating'      => fake()->numberBetween(3, 5),
            'feedback'    => fake()->optional(0.7)->randomElement(static::$feedbackSamples),
        ];
    }
}