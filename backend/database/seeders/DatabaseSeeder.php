<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Protocol;
use App\Models\Review;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use App\Services\TypesenseService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding wellness platform data...');

        // Users
        $this->command->info('Creating users...');

        // Fixed demo user
        $demoUser = User::create([
            'name'              => 'Alex Morgan',
            'username'          => 'alexmorgan',
            'email'             => 'demo@wellness.test',
            'password'          => Hash::make('password'),
            'email_verified_at' => now(),
            'bio'               => 'Wellness researcher and protocol enthusiast. Sharing what works.',
        ]);

        // 14 more randomized users
        $users = User::factory(14)->create();
        $allUsers = $users->prepend($demoUser);

        // Protocols 
        $this->command->info('Creating protocols...');

        $protocolData = [
            [
                'title'   => '30-Day Cold Exposure Protocol for Immune Resilience',
                'tags'    => ['cold-therapy', 'immune', 'longevity', 'stress'],
                'content' => $this->protocolContent('cold-exposure'),
            ],
            [
                'title'   => 'Intermittent Fasting: 16:8 Circadian Rhythm Reset',
                'tags'    => ['fasting', 'circadian', 'metabolism', 'nutrition'],
                'content' => $this->protocolContent('fasting'),
            ],
            [
                'title'   => 'Nervous System Regulation Through Breathwork',
                'tags'    => ['breathwork', 'stress', 'vagal-nerve', 'mindfulness'],
                'content' => $this->protocolContent('breathwork'),
            ],
            [
                'title'   => 'Gut Microbiome Restoration: 12-Week Plan',
                'tags'    => ['gut-health', 'nutrition', 'inflammation', 'probiotics'],
                'content' => $this->protocolContent('gut-health'),
            ],
            [
                'title'   => 'Dopamine Detox — Reset Your Reward Pathways',
                'tags'    => ['dopamine', 'detox', 'mindfulness', 'digital'],
                'content' => $this->protocolContent('dopamine'),
            ],
            [
                'title'   => 'Morning Sunlight & Cortisol Anchoring Protocol',
                'tags'    => ['sunlight', 'cortisol', 'sleep', 'circadian'],
                'content' => $this->protocolContent('sunlight'),
            ],
            [
                'title'   => 'Magnesium Stack for Deep Sleep Optimization',
                'tags'    => ['sleep', 'magnesium', 'supplements', 'recovery'],
                'content' => $this->protocolContent('sleep'),
            ],
            [
                'title'   => 'Zone 2 Cardio for Metabolic Flexibility',
                'tags'    => ['cardio', 'metabolism', 'longevity', 'exercise'],
                'content' => $this->protocolContent('cardio'),
            ],
            [
                'title'   => 'Anti-Inflammatory Diet: 21-Day Reset',
                'tags'    => ['anti-inflammatory', 'nutrition', 'gut-health', 'diet'],
                'content' => $this->protocolContent('anti-inflammatory'),
            ],
            [
                'title'   => 'Sauna + Cold Plunge: Weekly Contrast Therapy',
                'tags'    => ['sauna', 'cold-therapy', 'recovery', 'cardiovascular'],
                'content' => $this->protocolContent('contrast-therapy'),
            ],
            [
                'title'   => 'Polyvagal Toning: Daily Vagal Nerve Exercises',
                'tags'    => ['vagal-nerve', 'stress', 'breathwork', 'nervous-system'],
                'content' => $this->protocolContent('vagal'),
            ],
            [
                'title'   => 'Blue Light Elimination for Melatonin Recovery',
                'tags'    => ['blue-light', 'sleep', 'melatonin', 'hormones'],
                'content' => $this->protocolContent('blue-light'),
            ],
            [
                'title'   => 'Digital Detox & Attention Restoration Protocol',
                'tags'    => ['digital', 'detox', 'mindfulness', 'focus'],
                'content' => $this->protocolContent('digital-detox'),
            ],
            [
                'title'   => 'Fasted Training & Ketone Adaptation Guide',
                'tags'    => ['fasting', 'ketosis', 'exercise', 'metabolism'],
                'content' => $this->protocolContent('fasted-training'),
            ],
        ];

        $protocols = collect();
        foreach ($protocolData as $i => $data) {
            $author = $allUsers->random();
            $protocol = Protocol::create(array_merge($data, [
                'user_id'     => $author->id,
                'status'      => 'published',
                'views_count' => rand(100, 8000),
            ]));
            $protocols->push($protocol);
        }

        // Reviews
        $this->command->info('Creating reviews...');

        $feedbackPool = [
            'This protocol genuinely transformed my energy levels. Took about 2 weeks to feel the difference.',
            'Well-researched and practical. Not easy to stick to initially, but the results speak for themselves.',
            'Started skeptically but 6 weeks in I am a convert. Clear instructions and solid science.',
            'Good protocol, needed some personal modifications for my schedule, but the core is sound.',
            'The best structured guide I\'ve found on this topic. References are legit.',
            'Decent intro but lacks depth on the mechanisms. Still useful for beginners.',
            'Followed this alongside my doctor\'s advice. Really helped with my recovery.',
            'Excellent progression structure — week by week felt very intentional.',
            'Some parts were hard to apply in a busy household but the core concept works.',
            'Highly recommend to anyone dealing with chronic fatigue. Life-changing.',
        ];

        foreach ($protocols as $protocol) {
            $reviewers = $allUsers->random(rand(3, 9))->unique('id');
            foreach ($reviewers as $user) {
                Review::create([
                    'user_id'     => $user->id,
                    'protocol_id' => $protocol->id,
                    'rating'      => rand(3, 5),
                    'feedback'    => rand(0, 1) ? $feedbackPool[array_rand($feedbackPool)] : null,
                ]);
            }
            // Recalc cached stats (bypassing Typesense observer for speed)
            $stats = $protocol->reviews()->selectRaw('COUNT(*) as cnt, AVG(rating) as avg')->first();
            $protocol->reviews_count = $stats->cnt;
            $protocol->average_rating = round($stats->avg, 2);
            $protocol->saveQuietly();
        }

        // Threads
        $this->command->info('Creating threads...');

        $threadData = [
            ['title' => 'Week 3 results — mood shift I didn\'t expect', 'body' => "I'm now three weeks into the protocol and wanted to share something surprising. Beyond the physical changes everyone talks about, I noticed a significant improvement in my emotional regulation. Less reactivity, better tolerance for stress. Anyone else experience this?\n\nI started tracking my mood daily using a simple 1-10 score and the trend is undeniable. Week 1 was rough (adaptation), week 2 stabilized, week 3 something clicked.\n\nSharing in case it helps others stay consistent during that hard first week."],
            ['title' => 'Is this safe for someone with hypothyroidism?', 'body' => "My endocrinologist is supportive but cautious about some elements of this protocol. Specifically, the cold exposure component and its effects on thyroid hormone conversion.\n\nHas anyone with hypothyroidism (Hashimoto's in particular) done a modified version of this? What adjustments did you make?\n\nWould really appreciate responses from people with actual experience here, not just general advice."],
            ['title' => 'Protocol modifications for shift workers', 'body' => "I work 4 on / 4 off rotating nights and days. The circadian-dependent parts of this protocol are basically impossible to follow as written.\n\nI've been experimenting with anchoring the protocol to my *wake time* rather than sunrise/sunset. Early results are promising but the transition weeks are brutal.\n\nAnyone else in shift work who's cracked this? What's your approach?"],
            ['title' => 'Lab work before and after — sharing my bloodwork', 'body' => "Committed to do full bloodwork before starting and again at 90 days. Here are the headline numbers (values anonymized by range):\n\n**Before:**\n- CRP: 3.2 mg/L (elevated)\n- Fasting glucose: 98 mg/dL\n- Testosterone (total): low-normal\n- HRV: 28ms\n\n**After 90 days:**\n- CRP: 0.8 mg/L (normal!)\n- Fasting glucose: 87 mg/dL\n- Testosterone: mid-normal\n- HRV: 52ms\n\nNot claiming causation but the correlation is striking. Happy to answer questions about methodology."],
            ['title' => 'Women\'s hormonal considerations — what the protocol misses', 'body' => "I love this community but we need to talk about the fact that most protocols are researched primarily on men.\n\nFor women, particularly around the luteal phase, cold exposure tolerance and fasting windows need significant adjustment. I've spent 6 months testing modifications and want to share what I've found.\n\nCore principle: phase your protocol intensity with your cycle. High intensity in follicular, reduced in luteal. This single change eliminated the burnout I experienced in the first three months."],
            ['title' => 'Two months in: where\'s the line between discipline and obsession?', 'body' => "Real talk — I've noticed that my wellness protocols have started to affect my social life and spontaneity. I declined a friend's birthday dinner because it conflicted with my eating window. I felt anxious when I couldn't do my morning cold shower on a trip.\n\nIs this just the adaptation phase or is this a warning sign? How do people here maintain flexibility?\n\nNot looking for anyone to validate the rigidity. Genuinely want to hear how others handle this."],
            ['title' => 'Combining this with carnivore diet — 6-week experience', 'body' => "I've been running this protocol alongside a carnivore diet for 6 weeks. A few things worth noting:\n\n1. Electrolyte needs are significantly higher when combining fasting + carnivore\n2. The cold exposure benefits felt amplified — not sure if placebo\n3. Recovery from Zone 2 was faster than expected\n4. Mental clarity around week 4 was exceptional\n\nThis combination isn't for everyone and I'd recommend starting them separately before combining. Happy to answer specific questions."],
            ['title' => 'Science behind the 21-day adaptation window', 'body' => "Can someone with more background in physiology explain *why* 21 days is cited so consistently across protocols?\n\nI understand basic adaptation principles but I've been trying to find peer-reviewed literature on this specific timeframe and it's surprisingly sparse. Most citations trace back to the same 2-3 papers.\n\nIs the 21-day window evidence-based, experiential, or marketing?"],
            ['title' => 'How I adapted this for apartment living with no outdoor access', 'body' => "My situation: top floor apartment, no balcony, shared building. Here's how I've adapted:\n\n- Cold shower instead of plunge (works surprisingly well with the right mindset shift)\n- Full-spectrum bulb array for morning light exposure\n- App-based HRV tracking instead of wearable\n- Blackout curtains + sleep mask for circadian darkness\n\nNot as effective as the full protocol but 70% of the benefit with 100% of the feasibility. Details on any of these if useful."],
            ['title' => 'Anyone else notice worsened sleep in weeks 1-2?', 'body' => "Almost quit during week 1 because my sleep actually got worse. Less total time, more night waking, vivid dreams.\n\nPushed through based on others' reports of this being normal. By week 3 sleep was measurably better than baseline.\n\nWanted to post this so others don't quit during that adjustment dip. It appears to be part of the process, at least for some people. Anyone else experience this pattern?"],
            ['title' => 'Tracking progress without obsessing over metrics', 'body' => "I got deep into tracking — HRV, sleep scores, glucose, mood, energy. After 8 weeks I realized the tracking itself was creating anxiety that undermined the protocol.\n\nI've now moved to weekly check-ins instead of daily. Three simple questions: energy, mood, sleep quality on a 1-5 scale. That's it.\n\nThe signal-to-noise ratio is actually better now. Anyone else find that less tracking produces better results?"],
            ['title' => 'Best time of day to do the breathwork component?', 'body' => "Tried morning, noon, and evening. Each has different effects for me:\n\n- **Morning**: activating, good for energy but disrupts my fasted state\n- **Midday**: good focus reset, easiest to fit in schedule\n- **Evening**: most relaxing, best for sleep but hardest to find time\n\nProtocol doesn't specify. Curious what's working for others and whether there's a physiologically optimal window."],
        ];

        $threadCollection = collect();
        foreach ($threadData as $i => $data) {
            $protocol = $protocols->random();
            $author   = $allUsers->random();

            $thread = Thread::create([
                'user_id'         => $author->id,
                'protocol_id'     => $protocol->id,
                'title'           => $data['title'],
                'body'            => $data['body'],
                'tags'            => collect(['question', 'experience', 'results', 'science', 'safety'])->random(2)->values()->toArray(),
                'status'          => 'open',
                'views_count'     => rand(50, 3000),
                'upvotes_count'   => rand(5, 120),
                'downvotes_count' => rand(0, 10),
            ]);
            $threadCollection->push($thread);
        }

        // Comments
        $this->command->info('Creating comments...');

        $commentBodies = [
            "Really appreciate you sharing this. I had almost the exact same experience around week 3 — something just clicks.",
            "Have you looked into the research on cold thermogenesis and thyroid function? Dr. Jack Kruse has written about this, though his work is controversial.",
            "Shift worker here too. The anchor-to-wake-time approach is what I ended up doing. Took about 3 weeks to stabilize.",
            "Thank you for posting actual bloodwork. This is the kind of data we need more of in this community.",
            "This is such an important point about women's hormonal cycles. I wish more protocol authors addressed this.",
            "I think you're describing orthorexia-adjacent thinking. Worth examining honestly. The protocol should serve your life, not replace it.",
            "Week 1 was brutal for me too. Kept a journal and looking back the data clearly shows the trough before the improvement.",
            "The 21-day thing likely comes from synaptic plasticity research, not wellness-specific literature. The mechanism is real but the timeframe is approximated.",
            "Cold shower is underrated. After 2 months it genuinely became as effective as my plunge for the mental aspects.",
            "I had the same sleep disruption. It passed. Stick with it.",
            "Weekly check-ins are the way. Daily tracking is optimizing for the feeling of control, not for actual outcomes.",
            "I've found morning breathwork on an empty stomach is most potent. The CO2 tolerance work especially.",
            "Great detailed response. I'll add that electrolytes were crucial for me during the first month.",
            "Which specific bloodwork panels did you run? I want to replicate this for my own tracking.",
            "The combination of community and protocol is what made the difference for me. Hard to isolate the variable.",
        ];

        foreach ($threadCollection as $thread) {
            // 3-6 root comments per thread
            $rootCount = rand(3, 6);
            $rootComments = collect();

            for ($r = 0; $r < $rootCount; $r++) {
                $commenter = $allUsers->random();
                $comment = Comment::create([
                    'user_id'         => $commenter->id,
                    'thread_id'       => $thread->id,
                    'parent_id'       => null,
                    'body'            => $commentBodies[array_rand($commentBodies)],
                    'upvotes_count'   => rand(0, 30),
                    'downvotes_count' => rand(0, 3),
                ]);
                $rootComments->push($comment);
            }

            // 1-3 replies on some root comments
            foreach ($rootComments->random(min($rootComments->count(), rand(1, 3))) as $parent) {
                $replyCount = rand(1, 3);
                for ($rp = 0; $rp < $replyCount; $rp++) {
                    Comment::create([
                        'user_id'         => $allUsers->random()->id,
                        'thread_id'       => $thread->id,
                        'parent_id'       => $parent->id,
                        'body'            => $commentBodies[array_rand($commentBodies)],
                        'upvotes_count'   => rand(0, 15),
                        'downvotes_count' => rand(0, 2),
                    ]);
                }
            }

            // Update cached comment count
            $thread->comments_count = Comment::where('thread_id', $thread->id)
                ->where('is_deleted', false)->count();
            $thread->saveQuietly();
        }

        // Votes
        $this->command->info('Creating votes...');

        $usedVotes = [];

        foreach ($threadCollection->random(min($threadCollection->count(), 8)) as $thread) {
            $voters = $allUsers->random(rand(5, 12))->unique('id');
            foreach ($voters as $voter) {
                $key = "thread-{$thread->id}-{$voter->id}";
                if (!isset($usedVotes[$key])) {
                    Vote::create([
                        'user_id'      => $voter->id,
                        'votable_type' => Thread::class,
                        'votable_id'   => $thread->id,
                        'type'         => rand(0, 4) === 0 ? 'downvote' : 'upvote',
                    ]);
                    $usedVotes[$key] = true;
                }
            }
        }

        // Typesense reindex
        $this->command->info('Indexing data to Typesense...');
        try {
            $typesense = app(TypesenseService::class);
            $typesense->createProtocolsCollection();
            $typesense->createThreadsCollection();

            $freshProtocols = Protocol::with('author')->whereIn('id', $protocols->pluck('id'))->get();
            $freshThreads = Thread::with(['author', 'protocol'])->whereIn('id', $threadCollection->pluck('id'))->get();

            foreach ($freshProtocols as $p) {
                $typesense->indexProtocol($p);
            }
            foreach ($freshThreads as $t) {
                $typesense->indexThread($t);
            }

            $this->command->info('✓ Typesense indexing complete.');
        } catch (\Throwable $e) {
            $this->command->warn("⚠ Typesense indexing failed (check credentials): {$e->getMessage()}");
        }

        $this->command->info('Seeding complete!');
        $this->command->table(
            ['Resource', 'Count'],
            [
                ['Users',     $allUsers->count()],
                ['Protocols', $protocols->count()],
                ['Threads',   $threadCollection->count()],
                ['Comments',  Comment::count()],
                ['Reviews',   Review::count()],
                ['Votes',     Vote::count()],
            ]
        );
    }

    // Protocol content helpers
    private function protocolContent(string $key): string
    {
        $content = [
            'cold-exposure' => "## Overview\n\nCold exposure activates the sympathetic nervous system and triggers a cascade of adaptive hormonal responses. This 30-day protocol introduces progressive cold exposure to build resilience, improve immune function, and enhance stress tolerance.\n\n## Scientific Basis\n\nCold thermogenesis activates brown adipose tissue (BAT), increases norepinephrine by up to 300%, and stimulates cold shock proteins that have protective effects across multiple systems. Regular exposure reduces inflammatory cytokines and enhances natural killer cell activity.\n\n## Protocol Structure\n\n**Week 1 — Adaptation (30 seconds)**\nEnd showers with 30 seconds of cold water. Focus on controlled breathing. Morning timing preferred.\n\n**Week 2 — Extension (60-90 seconds)**\nExtend duration. Begin with face and neck submersion if accessible.\n\n**Week 3 — Full immersion (2-3 minutes)**\nTarget full body exposure. Aim for water temperature below 15°C (59°F).\n\n**Week 4 — Consolidation**\nMaintain 3-4 sessions per week. Begin tracking HRV and mood scores.\n\n## Safety Guidelines\n\n- Never practice alone in open water\n- Avoid if pregnant, cardiac conditions, or Raynaud's disease without medical clearance\n- Exit immediately if you feel chest pain or extreme shivering\n\n## Expected Outcomes\n\nMost practitioners report improved mood, reduced inflammation markers, and better stress resilience by week 3.",

            'fasting' => "## Overview\n\nThe 16:8 intermittent fasting protocol aligns food intake with your circadian rhythm, leveraging the body's natural hormonal cycles for metabolic optimization. This protocol focuses not just on *when* you eat but on synchronizing intake with light exposure and activity patterns.\n\n## The Circadian Connection\n\nInsulin sensitivity peaks in the morning and declines through the day. Eating in alignment with this curve — front-loading calories earlier — produces measurably better metabolic outcomes than the same calories consumed later.\n\n## Implementation\n\n**Eating window:** 8 hours, ideally 8am–4pm or 9am–5pm\n**Fasting window:** 16 hours including sleep\n\n**Phase 1 (Days 1-7):** 12-hour window\n**Phase 2 (Days 8-14):** 14-hour window  \n**Phase 3 (Days 15+):** Full 16:8\n\n## Managing Hunger\n\n- Electrolytes (sodium, magnesium, potassium) during fasting window\n- Black coffee or plain tea acceptable\n- First adaptation week is hardest — hunger diminishes significantly by week 2\n\n## Contraindications\n\nNot recommended for those with history of eating disorders, Type 1 diabetes, pregnancy, or underweight individuals without medical supervision.",

            'breathwork' => "## Overview\n\nBreathwork is one of the only voluntary pathways into the autonomic nervous system. This protocol uses three evidence-based techniques to build vagal tone, reduce baseline anxiety, and improve stress recovery.\n\n## Core Techniques\n\n**1. Physiological Sigh (stress relief — immediate)**\nDouble inhale through nose, long exhale through mouth. The most efficient breath for acute stress reduction. Use on demand.\n\n**2. Box Breathing (4-4-4-4)**\nInhale 4 seconds → hold 4 → exhale 4 → hold 4. Used by US Navy SEALs for performance under pressure. Practice 5 minutes daily.\n\n**3. Resonance Breathing (5.5 breaths/minute)**\nInhale 5.5 seconds, exhale 5.5 seconds. Directly maximizes HRV. Practice 20 minutes daily for measurable vagal tone improvement within 8 weeks.\n\n## Daily Schedule\n\n- Morning: 10 minutes Box Breathing (activating)\n- Before sleep: 20 minutes Resonance Breathing (parasympathetic)\n- On demand: Physiological sigh for acute stress\n\n## Tracking Progress\n\nHRV is the gold standard metric. Expect measurable improvement within 4-6 weeks of consistent resonance breathing practice.",

            'gut-health' => "## Overview\n\nThe gut microbiome contains approximately 38 trillion microorganisms and produces 95% of the body's serotonin. This 12-week protocol systematically rebuilds microbial diversity using diet, targeted supplementation, and lifestyle interventions.\n\n## Phase 1: Reduce Dysbiosis (Weeks 1-4)\n\n- Eliminate processed foods, refined sugars, and seed oils\n- Reduce alcohol to zero\n- Introduce fermented foods: kefir, sauerkraut, kimchi, miso\n- 35g+ dietary fiber daily from diverse plant sources\n\n## Phase 2: Rebuild (Weeks 5-8)\n\n- Targeted probiotic supplementation (Lactobacillus rhamnosus GG + Bifidobacterium longum)\n- Prebiotic foods: garlic, onion, leeks, asparagus, green banana\n- Bone broth for intestinal lining repair\n\n## Phase 3: Diversify (Weeks 9-12)\n\n- Aim for 30+ different plant foods per week\n- Introduce resistant starch\n- Evaluate and adjust based on symptoms\n\n## Biomarkers to Track\n\n- GI symptoms (bloating, regularity) daily log\n- Energy levels\n- Optional: comprehensive stool test at weeks 0 and 12",

            'dopamine' => "## Overview\n\nDopamine dysregulation from constant digital stimulation creates a tolerance effect — ordinary activities feel unrewarding because baseline dopamine levels are chronically elevated. This protocol resets the reward system through structured abstinence from high-dopamine activities.\n\n## The Science\n\nDopamine functions as a prediction and motivation signal, not a pleasure chemical. When you constantly spike it through social media, pornography, junk food, or gaming, the baseline rises and natural rewards lose their signal. Reset requires removing artificial spikes.\n\n## Level 1 (Beginner): 24-hour fast\nOne day free from phone, social media, entertainment. Replace with walking, journaling, conversation.\n\n## Level 2 (Intermediate): 7-day reset\nEliminate: social media, streaming, video games, recreational substances, pornography.\nRetain: exercise, meditation, nature, books, meaningful work.\n\n## Level 3 (Advanced): 30-day rebuild\nFull Level 2 for 30 days. Track mood and motivation weekly. Observe what you actually want when artificial stimulation is removed.\n\n## What to Expect\n\nDays 1-3: Restlessness, boredom, irritability\nDays 4-7: Stabilization, natural rewards begin recovering\nWeek 2+: Clarity, motivation, improved capacity for focus",
        ];

        return $content[$key] ?? "## Overview\n\nThis protocol provides a structured approach to improving health and wellness through evidence-based practices.\n\n## Methodology\n\nThe protocol is divided into progressive phases, each building on the previous. Consistency over intensity is the governing principle.\n\n## Phase 1 — Foundation\n\nEstablish baseline practices. Track starting metrics. Build the habit infrastructure before adding complexity.\n\n## Phase 2 — Development\n\nIncrease intensity or duration. Introduce complementary practices. Review and adjust based on personal response.\n\n## Phase 3 — Integration\n\nMake the protocol sustainable for the long term. Focus on maintenance rather than optimization.\n\n## Safety Considerations\n\nConsult a healthcare provider before beginning if you have any pre-existing conditions.";
    }
}
