<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProtocolFactory extends Factory
{
    private static array $protocols = [
        [
            'title' => '30-Day Cold Exposure Protocol for Immune Resilience',
            'tags'  => ['cold-therapy', 'immune', 'longevity', 'stress'],
            'content' => "## Overview\n\nCold exposure activates the sympathetic nervous system and triggers adaptive hormonal responses. This 30-day protocol introduces progressive cold exposure to build resilience and improve immune function.\n\n## Why This Protocol Works\n\nCold thermogenesis increases norepinephrine by up to 300% and stimulates cold shock proteins with protective effects across multiple systems. Regular exposure reduces inflammatory cytokines.\n\n## Week 1 — Foundation\n\nEnd showers with 30 seconds of cold water. Focus on controlled breathing. Morning timing preferred.\n\n## Week 2 — Progression\n\nExtend to 60-90 seconds. Begin face and neck submersion if accessible.\n\n## Week 3 — Integration\n\nFull body exposure targeting 2-3 minutes. Aim for water below 15°C.\n\n## Expected Outcomes\n\nImproved mood, reduced inflammation markers, and better stress resilience by week 3.\n\n## Safety Notes\n\nAvoid if pregnant or have cardiac conditions. Never practice alone in open water.",
        ],
        [
            'title' => 'Intermittent Fasting: 16:8 Circadian Rhythm Reset',
            'tags'  => ['fasting', 'circadian', 'metabolism', 'nutrition'],
            'content' => "## Overview\n\nThe 16:8 protocol aligns food intake with your circadian rhythm, leveraging the body's natural hormonal cycles for metabolic optimization.\n\n## Why This Protocol Works\n\nInsulin sensitivity peaks in the morning and declines through the day. Eating earlier produces measurably better metabolic outcomes than the same calories consumed later.\n\n## Week 1 — Foundation\n\nStart with a 12-hour eating window. Track your first and last meal times consistently.\n\n## Week 2 — Progression\n\nNarrow to a 14-hour window. Introduce electrolytes during the fasting period.\n\n## Week 3 — Integration\n\nFull 16:8 implementation. Eating window ideally 8am-4pm or 9am-5pm.\n\n## Expected Outcomes\n\nImproved metabolic flexibility, stable energy levels, and reduced inflammatory markers.\n\n## Safety Notes\n\nNot recommended for those with history of eating disorders or Type 1 diabetes without medical supervision.",
        ],
        [
            'title' => 'Nervous System Regulation Through Breathwork',
            'tags'  => ['breathwork', 'stress', 'vagal-nerve', 'mindfulness'],
            'content' => "## Overview\n\nBreathwork is one of the only voluntary pathways into the autonomic nervous system. This protocol uses three evidence-based techniques to build vagal tone and reduce baseline anxiety.\n\n## Why This Protocol Works\n\nControlled breathing directly modulates the vagus nerve, shifting the body from sympathetic to parasympathetic dominance. HRV improvements are measurable within 4-6 weeks.\n\n## Week 1 — Foundation\n\nPractice box breathing (4-4-4-4) for 5 minutes each morning. Focus on the exhale length.\n\n## Week 2 — Progression\n\nIntroduce resonance breathing at 5.5 breaths per minute for 20 minutes before sleep.\n\n## Week 3 — Integration\n\nCombine both techniques. Use the physiological sigh on demand for acute stress relief.\n\n## Expected Outcomes\n\nReduced resting heart rate, improved HRV, better stress recovery, and deeper sleep.\n\n## Safety Notes\n\nAvoid hyperventilation techniques if prone to anxiety or seizures.",
        ],
        [
            'title' => 'Gut Microbiome Restoration: 12-Week Plan',
            'tags'  => ['gut-health', 'nutrition', 'inflammation', 'probiotics'],
            'content' => "## Overview\n\nThe gut microbiome contains approximately 38 trillion microorganisms and produces 95% of the body's serotonin. This 12-week protocol systematically rebuilds microbial diversity.\n\n## Why This Protocol Works\n\nDietary diversity directly drives microbial diversity. 30+ different plant foods per week is the single strongest predictor of a healthy microbiome.\n\n## Week 1 — Foundation\n\nEliminate processed foods and refined sugars. Introduce fermented foods: kefir, sauerkraut, kimchi.\n\n## Week 2 — Progression\n\nTargeted probiotic supplementation. Add prebiotic foods: garlic, onion, leeks, asparagus.\n\n## Week 3 — Integration\n\nAim for 30+ different plant foods per week. Introduce resistant starch.\n\n## Expected Outcomes\n\nReduced bloating, improved mood, better energy, and measurable microbiome diversity increases.\n\n## Safety Notes\n\nIntroduce fermented foods slowly to avoid initial bloating during adaptation.",
        ],
        [
            'title' => 'Dopamine Detox — Reset Your Reward Pathways',
            'tags'  => ['dopamine', 'detox', 'mindfulness', 'digital'],
            'content' => "## Overview\n\nDopamine dysregulation from constant digital stimulation creates a tolerance effect — ordinary activities feel unrewarding. This protocol resets the reward system through structured abstinence.\n\n## Why This Protocol Works\n\nWhen you constantly spike dopamine through social media and junk food, the baseline rises and natural rewards lose their signal. Reset requires removing artificial spikes.\n\n## Week 1 — Foundation\n\n24-hour digital fast once per week. No social media, streaming, or gaming. Replace with walking and journaling.\n\n## Week 2 — Progression\n\nExtend to 3-day resets. Observe what you naturally gravitate toward without artificial stimulation.\n\n## Week 3 — Integration\n\nFull 7-day reset. Track mood and motivation daily. Notice recovery of natural reward sensitivity.\n\n## Expected Outcomes\n\nRestored motivation, improved focus, more enjoyment from simple activities, reduced compulsive phone checking.\n\n## Safety Notes\n\nExpect restlessness and irritability in days 1-3. This is normal and passes.",
        ],
        [
            'title' => 'Morning Sunlight & Cortisol Anchoring Protocol',
            'tags'  => ['sunlight', 'cortisol', 'sleep', 'circadian'],
            'content' => "## Overview\n\nMorning light exposure within 30 minutes of waking anchors your circadian clock, optimizes cortisol awakening response, and sets the foundation for melatonin release 12-16 hours later.\n\n## Why This Protocol Works\n\nThe suprachiasmatic nucleus requires bright light input to calibrate daily hormonal rhythms. Artificial indoor light is 50-100x too dim to trigger this response effectively.\n\n## Week 1 — Foundation\n\nGet outside within 30 minutes of waking for 10 minutes. No sunglasses. Overcast days still work.\n\n## Week 2 — Progression\n\nExtend to 20-30 minutes. Combine with a short walk for additional benefits.\n\n## Week 3 — Integration\n\nPair with evening blue light elimination. The morning and evening anchors work synergistically.\n\n## Expected Outcomes\n\nImproved morning alertness, better sleep onset at night, more stable energy throughout the day.\n\n## Safety Notes\n\nDo not look directly at the sun. Eyes open and facing the direction of light is sufficient.",
        ],
        [
            'title' => 'Magnesium Stack for Deep Sleep Optimization',
            'tags'  => ['sleep', 'magnesium', 'supplements', 'recovery'],
            'content' => "## Overview\n\nMagnesium deficiency affects an estimated 75% of adults and is directly linked to poor sleep quality, muscle tension, and elevated stress hormones. This protocol addresses the deficiency systematically.\n\n## Why This Protocol Works\n\nMagnesium activates GABA receptors, reduces cortisol, and regulates melatonin precursor synthesis. Different forms have different bioavailability and effects.\n\n## Week 1 — Foundation\n\nIntroduce magnesium glycinate 200mg before bed. Track sleep onset time and morning energy.\n\n## Week 2 — Progression\n\nAdd dietary magnesium sources: dark leafy greens, pumpkin seeds, dark chocolate, legumes.\n\n## Week 3 — Integration\n\nOptional: add magnesium threonate for cognitive benefits alongside glycinate for sleep.\n\n## Expected Outcomes\n\nFaster sleep onset, fewer night wakings, reduced muscle cramps, improved morning recovery.\n\n## Safety Notes\n\nStart with lower doses to avoid digestive discomfort. Consult a doctor if on medications.",
        ],
        [
            'title' => 'Zone 2 Cardio for Metabolic Flexibility',
            'tags'  => ['cardio', 'metabolism', 'longevity', 'exercise'],
            'content' => "## Overview\n\nZone 2 training — low-intensity aerobic exercise at 60-70% max heart rate — is emerging as one of the most powerful longevity interventions available. This protocol builds the metabolic base.\n\n## Why This Protocol Works\n\nZone 2 specifically trains mitochondrial efficiency and fat oxidation capacity. Most people are severely undertrained in this zone, defaulting to intensities that are too high to build the base.\n\n## Week 1 — Foundation\n\n3x 30-minute sessions at conversational pace. You should be able to speak full sentences. Use heart rate monitor to stay in zone.\n\n## Week 2 — Progression\n\nExtend to 45-minute sessions. Maintain strict zone adherence — resist the urge to push harder.\n\n## Week 3 — Integration\n\nBuild to 4x 45-60 minute sessions. Combine with one higher intensity session for hormonal variety.\n\n## Expected Outcomes\n\nImproved fat burning, better endurance, lower resting heart rate, and measurably better lactate clearance.\n\n## Safety Notes\n\nThe most common mistake is going too hard. If you cannot hold a conversation, slow down.",
        ],
        [
            'title' => 'Anti-Inflammatory Diet: 21-Day Reset',
            'tags'  => ['anti-inflammatory', 'nutrition', 'gut-health', 'diet'],
            'content' => "## Overview\n\nChronic low-grade inflammation is implicated in virtually every major disease of aging. This 21-day dietary reset systematically removes inflammatory inputs and replaces them with anti-inflammatory foods.\n\n## Why This Protocol Works\n\nDiet is the primary driver of inflammatory cytokine levels. Removing seed oils, refined sugars, and ultra-processed foods while increasing omega-3s and polyphenols produces measurable CRP reductions within 3 weeks.\n\n## Week 1 — Foundation\n\nEliminate: seed oils, refined sugars, gluten (optional), alcohol, and processed foods.\n\n## Week 2 — Progression\n\nEmphasize: fatty fish, olive oil, turmeric, ginger, berries, leafy greens, and cruciferous vegetables.\n\n## Week 3 — Integration\n\nMaintenance mode. Identify personal inflammatory triggers through systematic reintroduction.\n\n## Expected Outcomes\n\nReduced joint pain, better skin clarity, improved energy, and measurable inflammatory marker reduction.\n\n## Safety Notes\n\nConsult a dietitian if managing autoimmune conditions. Rapid dietary changes can temporarily worsen symptoms.",
        ],
        [
            'title' => 'Sauna + Cold Plunge: Weekly Contrast Therapy',
            'tags'  => ['sauna', 'cold-therapy', 'recovery', 'cardiovascular'],
            'content' => "## Overview\n\nContrast therapy — alternating between heat and cold — produces cardiovascular adaptations, accelerates muscle recovery, and triggers hormonal responses that support longevity.\n\n## Why This Protocol Works\n\nHeat stress induces heat shock proteins and growth hormone release. Cold stress triggers norepinephrine and anti-inflammatory cascades. The contrast between them amplifies both effects.\n\n## Week 1 — Foundation\n\n15 minutes sauna at 80-90°C followed by 2-minute cold shower. Once per week.\n\n## Week 2 — Progression\n\nExtend sauna to 20 minutes. Introduce 2-3 rounds of contrast (heat/cold/heat/cold).\n\n## Week 3 — Integration\n\n2x per week. Full protocol: 3 rounds of 15-20 minute sauna + 3-minute cold plunge.\n\n## Expected Outcomes\n\nFaster exercise recovery, improved cardiovascular markers, enhanced mood, and better heat and cold tolerance.\n\n## Safety Notes\n\nHydrate before and after. Avoid if pregnant or have cardiovascular conditions without clearance.",
        ],
        [
            'title' => 'Polyvagal Toning: Daily Vagal Nerve Exercises',
            'tags'  => ['vagal-nerve', 'stress', 'breathwork', 'nervous-system'],
            'content' => "## Overview\n\nPolyvagal theory explains how the vagus nerve regulates our social engagement, stress response, and physiological state. This protocol builds vagal tone through daily targeted practices.\n\n## Why This Protocol Works\n\nHigher vagal tone correlates with better emotional regulation, reduced inflammation, improved heart rate variability, and greater resilience to stress.\n\n## Week 1 — Foundation\n\nCold water face immersion for 30 seconds (activates dive reflex). Humming and gargling daily. 5-minute resonance breathing.\n\n## Week 2 — Progression\n\nAdd extended exhale breathing (4 in, 8 out). Introduce gentle neck stretches targeting vagal pathways.\n\n## Week 3 — Integration\n\nFull daily practice: 20-minute morning routine combining all techniques. Track HRV weekly.\n\n## Expected Outcomes\n\nImproved stress recovery, better social connection, reduced anxiety, and measurable HRV improvements.\n\n## Safety Notes\n\nFace immersion should use cool not ice-cold water initially. Progress gradually.",
        ],
        [
            'title' => 'Blue Light Elimination for Melatonin Recovery',
            'tags'  => ['blue-light', 'sleep', 'melatonin', 'hormones'],
            'content' => "## Overview\n\nBlue light from screens and LED lighting suppresses melatonin production by up to 50%, delaying sleep onset and reducing sleep quality. This protocol systematically eliminates the interference.\n\n## Why This Protocol Works\n\nMelatonin suppression from evening light exposure is one of the most well-documented causes of modern sleep dysfunction. The fix is simple but requires environmental changes.\n\n## Week 1 — Foundation\n\nNo screens after 9pm. Install blue light filtering apps on all devices. Switch to warm bulbs in bedroom.\n\n## Week 2 — Progression\n\nIntroduce blue-light blocking glasses from sunset onward. Blackout curtains in the bedroom.\n\n## Week 3 — Integration\n\nPair with morning sunlight exposure to create a complete circadian anchor at both ends of the day.\n\n## Expected Outcomes\n\nFaster sleep onset, improved sleep depth, better morning alertness, and improved mood stability.\n\n## Safety Notes\n\nBlue light glasses vary significantly in quality. Ensure they block the 480nm wavelength specifically.",
        ],
    ];

    private static int $index = 0;

    private static array $tagPool = [
        'sleep', 'cold-therapy', 'fasting', 'breathwork', 'gut-health',
        'dopamine', 'sunlight', 'magnesium', 'cardio', 'anti-inflammatory',
        'detox', 'vagal-nerve', 'ketosis', 'blue-light', 'lymphatic',
        'stress', 'inflammation', 'hormones', 'longevity', 'mindfulness',
    ];

    public function definition(): array
    {
        $protocol = static::$protocols[static::$index % count(static::$protocols)];
        static::$index++;

        $tags = collect(static::$tagPool)->random(fake()->numberBetween(2, 5))->toArray();

        return [
            'user_id'         => User::factory(),
            'title'           => $protocol['title'],
            'slug'            => Str::slug($protocol['title']) . '-' . fake()->unique()->numberBetween(1, 9999),
            'content'         => $protocol['content'],
            'tags'            => $tags,
            'status'          => fake()->randomElement(['published', 'published', 'published', 'draft']),
            'views_count'     => fake()->numberBetween(0, 5000),
            'reviews_count'   => 0,
            'average_rating'  => 0.00,
            'upvotes_count'   => fake()->numberBetween(0, 200),
            'downvotes_count' => fake()->numberBetween(0, 20),
        ];
    }
}