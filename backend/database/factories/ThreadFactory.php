<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ThreadFactory extends Factory
{
    private static array $threads = [
        [
            'title' => 'Week 3 results — mood shift I didn\'t expect',
            'body'  => "Three weeks in and I wanted to share something surprising. Beyond the physical changes everyone talks about, I noticed a significant improvement in emotional regulation. Less reactivity, better tolerance for stress. Anyone else experience this?\n\nI started tracking my mood daily using a simple 1-10 score and the trend is undeniable. Week 1 was rough, week 2 stabilized, week 3 something clicked.\n\nSharing in case it helps others stay consistent during that hard first week.",
        ],
        [
            'title' => 'Is this safe for someone with hypothyroidism?',
            'body'  => "My endocrinologist is supportive but cautious about some elements of this protocol. Specifically the cold exposure component and its effects on thyroid hormone conversion.\n\nHas anyone with hypothyroidism or Hashimoto's done a modified version? What adjustments did you make?\n\nWould really appreciate responses from people with actual experience here, not just general advice.",
        ],
        [
            'title' => 'Protocol modifications for shift workers',
            'body'  => "I work rotating nights and days. The circadian-dependent parts of this protocol are basically impossible to follow as written.\n\nI've been experimenting with anchoring the protocol to my wake time rather than sunrise. Early results are promising but the transition weeks are brutal.\n\nAnyone else in shift work who has cracked this? What is your approach?",
        ],
        [
            'title' => 'Lab work before and after — sharing my bloodwork',
            'body'  => "Committed to doing full bloodwork before starting and again at 90 days. The headline numbers were striking — CRP dropped from elevated to normal range, fasting glucose improved by 11 points, and HRV nearly doubled.\n\nI'm not claiming causation but the correlation is hard to ignore. I controlled for diet and sleep as best I could during the period.\n\nHappy to answer questions about methodology. This kind of tracking is what the community needs more of.",
        ],
        [
            'title' => 'Women\'s hormonal considerations — what the protocol misses',
            'body'  => "Most protocols are researched primarily on men and this one is no exception. For women, particularly around the luteal phase, cold exposure tolerance and fasting windows need significant adjustment.\n\nI spent 6 months testing modifications. The core principle: phase your protocol intensity with your cycle. High intensity in follicular, reduced in luteal.\n\nThis single change eliminated the burnout I experienced in the first three months.",
        ],
        [
            'title' => 'Two months in: where\'s the line between discipline and obsession?',
            'body'  => "Real talk — I've noticed my wellness protocols have started affecting my social life. I declined a friend's birthday dinner because it conflicted with my eating window. I felt anxious when I couldn't do my morning routine on a trip.\n\nIs this the adaptation phase or a warning sign? How do people here maintain flexibility?\n\nNot looking for validation of the rigidity. Genuinely want to hear how others handle this tension.",
        ],
        [
            'title' => 'Science behind the 21-day adaptation window',
            'body'  => "Can someone with more background in physiology explain why 21 days is cited so consistently across protocols?\n\nI've been trying to find peer-reviewed literature on this specific timeframe and it's surprisingly sparse. Most citations trace back to the same 2-3 papers.\n\nIs the 21-day window evidence-based, experiential, or marketing?",
        ],
        [
            'title' => 'How I adapted this for apartment living with no outdoor access',
            'body'  => "My situation: top floor apartment, no balcony, shared building with no outdoor access before 7am. Here is how I adapted:\n\nCold shower instead of plunge. Full-spectrum bulb array for morning light. App-based HRV tracking instead of wearable. Blackout curtains for circadian darkness.\n\nNot as effective as the full protocol but roughly 70% of the benefit with 100% of the feasibility.",
        ],
        [
            'title' => 'Anyone else notice worsened sleep in weeks 1-2?',
            'body'  => "Almost quit during week 1 because my sleep actually got worse. Less total time, more night waking, vivid dreams.\n\nPushed through based on others' reports of this being normal. By week 3 sleep was measurably better than baseline.\n\nPosting so others don't quit during that adjustment dip. It appears to be part of the process.",
        ],
        [
            'title' => 'Tracking progress without obsessing over metrics',
            'body'  => "I went deep into tracking — HRV, sleep scores, glucose, mood, energy. After 8 weeks I realized the tracking itself was creating anxiety that undermined the protocol.\n\nMoved to weekly check-ins instead of daily. Three questions: energy, mood, sleep quality on a 1-5 scale. That is it.\n\nThe signal-to-noise ratio is actually better now. Anyone else find that less tracking produces better results?",
        ],
        [
            'title' => 'Best time of day to do the breathwork component?',
            'body'  => "Tried morning, midday, and evening. Each produces different effects for me.\n\nMorning is activating and good for energy but disrupts my fasted state. Midday is a good focus reset and easiest to schedule. Evening is most relaxing and best for sleep but hardest to find time for.\n\nThe protocol doesn't specify. Curious what's working for others and whether there's a physiologically optimal window.",
        ],
        [
            'title' => 'Combining this with carnivore diet — 6-week experience',
            'body'  => "Running this protocol alongside carnivore for 6 weeks. A few things worth noting:\n\nElectrolyte needs are significantly higher when combining fasting and carnivore. The cold exposure benefits felt amplified. Recovery from Zone 2 was faster than expected. Mental clarity around week 4 was exceptional.\n\nThis combination is not for everyone. I would recommend starting them separately before combining.",
        ],
    ];

    private static int $titleIndex = 0;

    private static array $tagPool = [
        'question', 'experience', 'results', 'modification', 'safety',
        'science', 'diet', 'sleep', 'hormones', 'tracking', 'beginners',
    ];

    public function definition(): array
    {
        $thread = static::$threads[static::$titleIndex % count(static::$threads)];
        static::$titleIndex++;
        return [
            'user_id'         => User::factory(),
            'protocol_id'     => Protocol::factory(),
            'title'           => $thread['title'],
            'slug'            => Str::slug($thread['title']) . '-' . fake()->unique()->numberBetween(1, 9999),
            'body'            => $thread['body'],
            'tags'            => fake()->randomElements(static::$tagPool, fake()->numberBetween(1, 3)),
            'status'          => fake()->randomElement(['open', 'open', 'open', 'closed']),
            'views_count'     => fake()->numberBetween(0, 2000),
            'comments_count'  => 0,
            'upvotes_count'   => fake()->numberBetween(0, 150),
            'downvotes_count' => fake()->numberBetween(0, 15),
        ];
    }
}