export type Category = "Substance" | "Behavioral" | "Health";

export type Story = {
  author: string;
  days: number;
  text: string;
};

export type Addiction = {
  slug: string;
  aliases?: string[];
  name: string;
  category: Category;
  tagline: string;
  description: string;
  icon?: string;
  questions: string[];
  tips: { low: string[]; medium: string[]; high: string[] };
  stories: Story[];
};

const tips = (topic: string, anchor: string) => ({
  low: [
    `Your relationship with ${topic} looks manageable. Keep the habits and boundary structures that are working for you.`,
    `Set a simple weekly check-in so small shifts don't go unnoticed.`,
    anchor,
  ],
  medium: [
    `${topic} is taking more mental space or energy than you'd like. Start with one measurable boundary this week.`,
    `Track your triggers for seven days — note time of day, mood, and environment. Patterns beat willpower.`,
    `Tell one trusted person what you're changing. Accountability roughly doubles follow-through.`,
    anchor,
  ],
  high: [
    `Your answers suggest ${topic} is significantly impacting your daily life, wellbeing, or relationships. Please consider speaking with a professional or support group.`,
    `Build an immediate short-term safety plan: reduce access, schedule replacement activities, and minimize isolated downtime.`,
    `Find a dedicated peer recovery group. Recovery outcomes improve sharply with community support.`,
    anchor,
  ],
});

export const addictions: Addiction[] = [
  {
    slug: "alcohol",
    aliases: ["alcohol-use", "drinking"],
    name: "Alcohol",
    category: "Substance",
    tagline: "Social lubricant that quietly becomes structural",
    description:
      "Alcohol dependence builds slowly and hides inside ordinary routines — the after-work drink, the weekend reset, or the glass that helps you sleep. Understanding your patterns is the first step toward positive change.",
    icon: "🍷",
    questions: [
      "How often do you drink alcohol?",
      "Do you drink more than you intended?",
      "Have you tried to cut down but couldn't?",
      "Does drinking interfere with work or relationships?",
      "Do you need to drink more to get the same effect?",
      "Do you experience withdrawal symptoms when not drinking?",
      "Have you given up activities because of drinking?",
      "Do you drink alone or in secret?",
      "Has anyone expressed concern about your drinking?",
      "Do you experience blackouts or memory loss from drinking?",
    ],
    tips: tips("alcohol", "Hydrate, eat before social events, and never taper heavy physical dependence alone — medical supervision is vital."),
    stories: [
      { author: "Sarah M.", days: 730, text: "I was drinking every night to cope with work stress. Getting sober was the hardest thing I've done, but I'm 2 years sober now and my life is better than ever." },
      { author: "Mike R.", days: 96, text: "I thought I had it under control on weekends. The support from others who understand is invaluable. Don't wait as long as I did." },
      { author: "Maya R.", days: 412, text: "I stopped counting drinks and started counting mornings. The first clear Saturday was the moment it clicked." },
    ],
  },
  {
    slug: "social-media-screens",
    aliases: ["social-media", "screens", "screen-time"],
    name: "Social Media & Screens",
    category: "Behavioral",
    tagline: "Infinite input, diminishing returns",
    description:
      "Feeds are engineered for variable reward. Compulsive scrolling fragments attention, increases anxiety, and reliably lowers baseline mood.",
    icon: "📱",
    questions: [
      "How many hours per day do you spend on screens?",
      "Do you feel anxious when you can't check social media?",
      "Does screen use interfere with sleep or work?",
      "Have you tried to reduce screen time but struggled?",
      "Do you prioritize screens over in-person activities?",
      "Do you check your phone first thing in the morning?",
      "Does social media affect your self-esteem or mood?",
      "Do you feel FOMO (fear of missing out) when offline?",
      "Have you lied about your screen time to others?",
      "Do you use screens during meals or social gatherings?",
    ],
    tips: tips("social media", "Grayscale mode, turning off non-human notifications, and removing apps from the home screen cut usage dramatically."),
    stories: [
      { author: "Emma T.", days: 90, text: "I was spending 6+ hours a day scrolling. Deleting the apps and setting hard phone-free hours changed everything. My anxiety dropped significantly." },
      { author: "James P.", days: 40, text: "Every notification made me anxious. Setting phone-free family dinners and charging in another room gave me my peace back." },
      { author: "Ben C.", days: 300, text: "I read 22 books this year. That's the trade I made with screen time and I'd make it again." },
    ],
  },
  {
    slug: "gaming",
    aliases: ["video-games"],
    name: "Gaming",
    category: "Behavioral",
    tagline: "Progress that only exists in one world",
    description:
      "Games deliver clear goals and instant feedback that real life rarely matches. Trouble starts when gaming becomes the only coping strategy for stress or loneliness.",
    icon: "🎮",
    questions: [
      "How many hours per day do you spend gaming?",
      "Do you neglect other activities to game?",
      "Do you feel irritable when you can't play?",
      "Have relationships or work been affected by gaming?",
      "Do you use gaming to escape stress or negative feelings?",
      "Do you lose track of time while gaming?",
      "Have you sacrificed sleep to continue gaming?",
      "Do you think about gaming when doing other activities?",
      "Have you spent excessive money on games or in-game purchases?",
      "Do you game alone more than with friends or family?",
    ],
    tips: tips("gaming", "Schedule gaming sessions with a hard stop and plan something enjoyable in the physical world directly afterward."),
    stories: [
      { author: "Alex C.", days: 130, text: "I was gaming 8+ hours a day and skipping sleep. Setting boundaries and finding physical hobbies made gaming fun again rather than a compulsion." },
      { author: "Jordan M.", days: 55, text: "Joining a support group gave me the structure I needed. Real-world achievements now give me genuine fulfillment." },
      { author: "Dex", days: 420, text: "I found a bouldering gym. Same dopamine challenge, but with real movement and genuine friendships." },
    ],
  },
  {
    slug: "smoking-nicotine",
    aliases: ["nicotine", "smoking", "vaping"],
    name: "Smoking / Nicotine",
    category: "Substance",
    tagline: "The shortest loop between craving and relief",
    description:
      "Nicotine dependence is one of the fastest reward loops. Quitting is less about raw willpower and more about interrupting the behavioral trigger loop.",
    icon: "🚬",
    questions: [
      "How many cigarettes or vapes per day do you use?",
      "Do you feel strong cravings when you can't use nicotine?",
      "Have you tried to quit before and found it difficult?",
      "Does nicotine use affect your health or budget?",
      "Do you use nicotine within 30 minutes of waking?",
      "Do you smoke or vape in places where it's prohibited?",
      "Have you continued despite physical health concerns?",
      "Do you experience withdrawal symptoms without nicotine?",
      "Has nicotine use affected your relationships or self-esteem?",
      "Do you smoke or vape significantly more when stressed?",
    ],
    tips: tips("nicotine", "Nicotine replacement therapy (patches/gum) and 4-7-8 breathing during craving waves roughly double quit rates."),
    stories: [
      { author: "Maria G.", days: 3650, text: "I smoked a pack a day for 20 years. Combining replacement therapy with craving surfing worked. 10 years smoke-free now." },
      { author: "Robert K.", days: 180, text: "Six months vape-free. I replaced the hand-to-mouth ritual with cold ice water and a brisk 5-minute walk." },
      { author: "Ines M.", days: 45, text: "Day 45. Cravings now last only 90 seconds instead of all afternoon." },
    ],
  },
  {
    slug: "shopping-spending",
    aliases: ["shopping", "spending", "compulsive-buying"],
    name: "Shopping / Spending",
    category: "Behavioral",
    tagline: "A mood fix with a delivery date",
    description:
      "Compulsive spending is often an emotional coping mechanism. The purchase temporarily resolves an uncomfortable feeling, but the feeling returns before the parcel arrives.",
    icon: "🛍️",
    questions: [
      "Do you shop to relieve stress or negative emotions?",
      "Have you spent more than you can afford?",
      "Do you feel guilty or ashamed after shopping?",
      "Does shopping interfere with your financial goals?",
      "Do you hide purchases or receipts from others?",
      "Do you buy things you don't need or never use?",
      "Do you experience a rush or 'high' when buying?",
      "Have you maxed out credit cards from shopping?",
      "Do you shop even when carrying stressful debt?",
      "Have you tried to stop impulse buying but couldn't?",
    ],
    tips: tips("spending", "Enforce a mandatory 48-hour cooling-off rule on all non-essential purchases and remove saved cards from browsers."),
    stories: [
      { author: "Sarah T.", days: 240, text: "I had $50,000 in credit card debt. Freezing cards and learning to sit with emotions instead of purchasing gave me back my life." },
      { author: "Michael B.", days: 110, text: "I had closets full of tags. A 6-month intentional buying freeze transformed my peace of mind." },
      { author: "Hana W.", days: 180, text: "Unsubscribing from marketing emails starved the buying urge at the root." },
    ],
  },
  {
    slug: "food-eating",
    aliases: ["food", "eating", "binge-eating"],
    name: "Food / Eating",
    category: "Health",
    tagline: "Comfort you have to face three times a day",
    description:
      "Unlike other habits, we cannot simply abstain from eating. Recovery centers on predictable meal structure, self-compassion, and dismantling the restrict–binge cycle.",
    icon: "🍽️",
    questions: [
      "Do you eat when not hungry to cope with emotions?",
      "Do you feel out of control around certain foods?",
      "Does eating affect your self-esteem or body image?",
      "Have you tried restrictive diets that resulted in binges?",
      "Does food dominate your thoughts throughout the day?",
      "Do you eat in secret or hide food wrappers?",
      "Do you feel intense guilt or shame after eating?",
      "Do you binge eat until uncomfortably full?",
      "Has eating pattern affected your physical health?",
      "Do you use food as your primary reward or comfort?",
    ],
    tips: tips("eating patterns", "Regular, balanced meals prevent biological hunger from triggering compulsive urges. Restriction is a trigger, not a cure."),
    stories: [
      { author: "Emily S.", days: 150, text: "Keeping a compassionate reflection journal and eating consistent meals stopped my binge cycle." },
      { author: "Carlos M.", days: 210, text: "I learned to sit with uncomfortable emotions instead of eating them. Finding other self-soothing tools was key." },
      { author: "Bea M.", days: 600, text: "Food is fuel and shared joy again, not a moral verdict on my character." },
    ],
  },
  {
    slug: "caffeine",
    aliases: ["coffee", "energy-drinks"],
    name: "Caffeine",
    category: "Substance",
    tagline: "Borrowed energy, paid back with interest",
    description:
      "Caffeine dependence is socially invisible, but the crash-and-refill cycle frequently drives background anxiety, disrupted sleep architecture, and erratic energy.",
    icon: "☕",
    questions: [
      "How many caffeinated drinks do you consume per day?",
      "Do you get headaches or fatigue without caffeine?",
      "Does caffeine affect your ability to fall or stay asleep?",
      "Do you feel you need caffeine to function normally?",
      "Have you tried to cut back but struggled with withdrawal?",
      "Do you experience jitters, palpitations, or anxiety?",
      "Do you consume caffeine late in the afternoon or evening?",
      "Has caffeine affected your heart rate or blood pressure?",
      "Do you feel irritable or sluggish when intake is delayed?",
      "Have you steadily increased your intake over time?",
    ],
    tips: tips("caffeine", "Taper intake gradually by roughly 25% a week, and cut off caffeine intake at least 8 hours before bed."),
    stories: [
      { author: "Amanda C.", days: 60, text: "Down from 8 cups to 1. My resting heart rate dropped and my daily baseline anxiety dissolved." },
      { author: "Brian L.", days: 120, text: "Replaced 4 energy drinks a day with water and morning sunlight. My natural energy is higher than ever." },
      { author: "Nadia F.", days: 150, text: "Turns out I wasn't an anxious person; I was over-caffeinated and under-slept." },
    ],
  },
  {
    slug: "marijuana-cannabis",
    aliases: ["cannabis", "marijuana", "weed"],
    name: "Marijuana / Cannabis",
    category: "Substance",
    tagline: "When unwinding becomes the only setting",
    description:
      "Cannabis use disorder shows up as motivation flattening, emotional blunting, tolerance creep, and using to feel normal rather than to feel good.",
    icon: "🌿",
    questions: [
      "How often do you use marijuana or cannabis?",
      "Do you use more or more frequently than intended?",
      "Have you tried to cut down or take a tolerance break?",
      "Does cannabis interfere with work, school, or goals?",
      "Do you experience withdrawal symptoms (insomnia, irritability)?",
      "Do you use cannabis daily or multiple times per day?",
      "Has your memory, focus, or mental clarity been affected?",
      "Do you use cannabis to cope with boredom or difficult emotions?",
      "Have you driven or operated machinery under the influence?",
      "Has cannabis use affected your ambition or relationships?",
    ],
    tips: tips("cannabis", "Expect 7–14 days of vivid dreams and sleep shifts after stopping; they are signs of REM sleep recovery."),
    stories: [
      { author: "Tyler J.", days: 120, text: "I smoked daily for 10 years. After 30 days clean, the mental fog lifted and my ambition returned." },
      { author: "Jessica W.", days: 90, text: "I used weed thinking it helped my anxiety, but it made my working memory terrible. Sobriety brought real peace." },
      { author: "Marc L.", days: 365, text: "A full year clean. I still have challenging evenings, but I experience them awake and present." },
    ],
  },
  {
    slug: "opioids-painkillers",
    aliases: ["opioids", "painkillers", "prescription-drugs"],
    name: "Opioids / Painkillers",
    category: "Substance",
    tagline: "Starts as treatment, ends as necessity",
    description:
      "Opioid dependence frequently starts with legitimate pain management. Physical neuroadaptation is a medical reality, not a moral failing, and requires medical guidance.",
    icon: "💊",
    questions: [
      "How often do you use opioids or prescription painkillers?",
      "Do you take higher doses than originally prescribed?",
      "Do you experience severe physical withdrawal without them?",
      "Has opioid use affected your health, work, or relationships?",
      "Do you continue using despite noticing negative consequences?",
      "Have you sought multiple prescriptions or doctors?",
      "Do you take opioids to feel emotionally 'normal' rather than for pain?",
      "Have you used opioids not prescribed to you?",
      "Do you find yourself constantly thinking about your supply?",
      "Have you neglected responsibilities due to medication effects?",
    ],
    tips: tips("opioids", "Do not attempt sudden unassisted detox. Medication-Assisted Treatment (MAT) is the evidence-based clinical standard."),
    stories: [
      { author: "Daniel R.", days: 730, text: "Started after back surgery. With clinical support and therapy, I broke free. Physical therapy manages my pain now." },
      { author: "Michelle K.", days: 365, text: "Rehab and family therapy rebuilt our home. Recovery gave me my family and my life back." },
      { author: "J.W.", days: 1100, text: "Three years clean. I sponsor others now. The debt of kindness gets paid forward every day." },
    ],
  },
  {
    slug: "cocaine-stimulants",
    aliases: ["stimulants", "cocaine", "adhd-medication-misuse"],
    name: "Cocaine / Stimulants",
    category: "Substance",
    tagline: "Peaks that keep getting more expensive",
    description:
      "Stimulants produce rapid dopamine surges followed by steep neurochemical crashes. Recovery focuses on nervous system regulation, sleep restoration, and dopamine rebuilding.",
    icon: "💎",
    questions: [
      "How often do you use cocaine or prescription stimulants?",
      "Do you use larger amounts or stay up longer than planned?",
      "Do you experience intense exhaustion, depression, or crash afterward?",
      "Has stimulant use impacted your finances, job, or relationships?",
      "Do you continue using despite cardiac or psychological concerns?",
      "Do you use stimulants in secret or when alone?",
      "Have you experienced paranoia, severe anxiety, or rapid heart rate?",
      "Do you feel you need stimulants to feel confident or productive?",
      "Have you spent significant portions of income on stimulants?",
      "Has stimulant use affected your physical health or sleep cycle?",
    ],
    tips: tips("stimulants", "The flat mood (anhedonia) during early recovery is temporary dopamine receptor recalibration, not permanent damage."),
    stories: [
      { author: "Alex T.", days: 200, text: "The crash was devastating my mental health. Getting clean was tough, but now I have authentic energy and real joy." },
      { author: "Stephanie B.", days: 365, text: "A health scare was my wake-up call. Therapy helped me address underlying depression without chemical fixes." },
      { author: "Owen H.", days: 500, text: "The flat first few weeks were the hardest. They do pass. Real life is so much richer." },
    ],
  },
  {
    slug: "gambling",
    aliases: ["sports-betting", "casino", "trading-compulsion"],
    name: "Gambling",
    category: "Behavioral",
    tagline: "The near-miss is the product",
    description:
      "Problem gambling exploits near-misses and loss-chasing psychology. Financial and emotional harm compounds rapidly, making boundary structures essential.",
    icon: "🎰",
    questions: [
      "How often do you gamble or place bets?",
      "Do you chase losses by gambling more money?",
      "Have you lied to family or friends about how much you gamble?",
      "Does gambling affect your household budget, savings, or work?",
      "Do you feel restless or irritable when trying to stop?",
      "Do you gamble with money meant for bills or necessities?",
      "Have you borrowed money or sold possessions to gamble?",
      "Do you gamble to escape stress, depression, or boredom?",
      "Have you engaged in risky financial behavior to fund betting?",
      "Has gambling jeopardized important relationships or opportunities?",
    ],
    tips: tips("gambling", "Register with self-exclusion registries (like GamStop), hand card management to a trusted partner, and block gambling apps."),
    stories: [
      { author: "Mark H.", days: 600, text: "I lost my savings chasing losses. GA meetings and financial counseling helped me rebuild. 6 years clean now." },
      { author: "Linda S.", days: 180, text: "Coming clean to my partner was terrifying, but it took all the secret power away from the compulsion." },
      { author: "Paulo R.", days: 240, text: "Self-excluded from all betting sites. The urge to bet evaporated once access was impossible." },
    ],
  },
  {
    slug: "pornography-sexual",
    aliases: ["pornography", "porn", "hypersexuality"],
    name: "Pornography / Sexual Content",
    category: "Behavioral",
    tagline: "Escalation in private",
    description:
      "Compulsive viewing tends to escalate toward novelty and can distort real-world intimacy. Shame keeps the cycle isolated; honest boundaries dismantle it.",
    icon: "🔞",
    questions: [
      "How much time do you spend viewing pornography or sexual content?",
      "Do you feel compelled to view increasingly novel or extreme content?",
      "Does it interfere with real-world relationships or intimacy?",
      "Have you tried to reduce viewing but found yourself relapsing?",
      "Do you use pornography primarily to numb stress, loneliness, or anxiety?",
      "Do you view content in risky environments (work, public)?",
      "Has it affected your real-life sexual function or emotional presence?",
      "Do you feel persistent shame or remorse after viewing?",
      "Have you neglected sleep or daily responsibilities to browse content?",
      "Has a partner expressed hurt or concern regarding your use?",
    ],
    tips: tips("compulsive viewing", "No internet-connected screens in the bedroom after 10 PM is the single highest-yield structural boundary."),
    stories: [
      { author: "Jason M.", days: 180, text: "Porn was my secret escape from stress. Breaking free through therapy opened me up to real, vulnerable intimacy." },
      { author: "Rebecca T.", days: 90, text: "Talking through the emotional triggers without shame was liberating. I'm learning healthy self-worth." },
      { author: "Anon.", days: 520, text: "Therapy and accountability partners made the difference. A clear conscience is priceless." },
    ],
  },
  {
    slug: "work-career",
    aliases: ["work", "workaholism", "career"],
    name: "Work / Career",
    category: "Behavioral",
    tagline: "The socially rewarded compulsion",
    description:
      "Workaholism is frequently praised until it results in severe burnout, chronic illness, and broken relationships. Fusing identity with output makes rest feel dangerous.",
    icon: "💼",
    questions: [
      "How many hours do you work per week on average?",
      "Do you work or check messages when you intended to relax?",
      "Does work constantly interfere with personal and family time?",
      "Do you feel guilty, empty, or anxious when not working?",
      "Has work stress affected your physical health or sleep?",
      "Do you check emails compulsively during vacations and weekends?",
      "Have you cancelled important personal plans repeatedly for work?",
      "Is your entire self-esteem tied to your professional productivity?",
      "Do you lack hobbies or meaningful activities outside of work?",
      "Have loved ones expressed concern about your work schedule?",
    ],
    tips: tips("overwork", "Schedule non-negotiable personal commitments on your calendar with the same gravity as client meetings."),
    stories: [
      { author: "Karen W.", days: 140, text: "I worked 80-hour weeks until a panic attack stopped me. Setting hard boundaries made me healthier and actually more productive." },
      { author: "Thomas B.", days: 200, text: "I traded 24/7 availability for being present with my kids. The company survived just fine." },
      { author: "Ellen T.", days: 330, text: "I'm not less ambitious; I'm simply no longer on call for my own life." },
    ],
  },
  {
    slug: "internet-online",
    aliases: ["internet", "online", "doomscrolling"],
    name: "Internet / Online Activities",
    category: "Behavioral",
    tagline: "Twelve tabs and no destination",
    description:
      "Endless rabbit holes, forums, and doomscrolling consume hours while creating the illusion of productivity. Intentional digital boundaries restore presence.",
    icon: "🌐",
    questions: [
      "How many hours daily do you spend on non-work internet browsing?",
      "Do you frequently lose track of hours online with little to show for it?",
      "Does online browsing interfere with your sleep or commitments?",
      "Do you feel anxious or restless during intentional offline stretches?",
      "Have you attempted digital detoxes that fell apart quickly?",
      "Do you turn to the internet to avoid uncomfortable real-life tasks?",
      "Has late-night browsing damaged your sleep schedule?",
      "Do you prefer online interactions over in-person conversations?",
      "Have you downplayed or hidden how much time you spend online?",
      "Does excessive internet use create tension with friends or family?",
    ],
    tips: tips("internet use", "Write down your explicit search intent on paper before opening a browser tab to break aimless browsing."),
    stories: [
      { author: "Derek L.", days: 85, text: "I lost entire evenings to random links. A strict 9 PM device curfew restored my focus and family life." },
      { author: "Nina S.", days: 60, text: "Breaking the news doomscroll habit reduced my chronic anxiety within two weeks." },
      { author: "Nils P.", days: 260, text: "I traded infinite tabs for evening walks. Life is so much richer offline." },
    ],
  },
  {
    slug: "sugar-sweets",
    aliases: ["sugar", "sweets", "junk-food"],
    name: "Sugar / Sweets",
    category: "Health",
    tagline: "Small hits, all day long",
    description:
      "Refined sugar produces rapid dopamine spikes followed by blood-sugar crashes. Structuring meals and prioritizing protein stabilizes cravings.",
    icon: "🍬",
    questions: [
      "How often do you experience intense cravings for sugary foods?",
      "Do you eat sweets when not physically hungry?",
      "Do you experience severe energy crashes shortly after eating?",
      "Has your sugar intake affected your weight, dental health, or energy?",
      "Do you hide candy, sweets, or wrappers from others?",
      "Do you feel you need sugar or sweet drinks to get through the afternoon?",
      "Do you struggle to stop at a single reasonable serving of dessert?",
      "Do you eat sweets primarily to cope with stress or sadness?",
      "Have you tried to cut back on sugar repeatedly without success?",
      "Does consuming sugar cause noticeable brain fog or mood swings?",
    ],
    tips: tips("sugar", "Eat 25–30g of protein with breakfast; it flattens the glycemic and dopamine craving curve for the entire day."),
    stories: [
      { author: "Melissa H.", days: 90, text: "Cutting processed sugar and eating whole meals ended my afternoon crashes. My energy is stable all day." },
      { author: "James T.", days: 45, text: "Understanding how sugar spikes dopamine helped me treat it like any other habit. Mindful eating works." },
      { author: "Tess O.", days: 180, text: "Dessert is an occasional weekend treat now, and it tastes so much better when it's not a compulsion." },
    ],
  },
  {
    slug: "exercise",
    aliases: ["compulsive-exercise", "overtraining"],
    name: "Exercise",
    category: "Health",
    tagline: "A healthy habit past its limit",
    description:
      "Compulsive exercise ignores physical injury, illness, and life obligations. The indicator is not how much you train, but how much anxiety you feel when you must rest.",
    icon: "🏃",
    questions: [
      "How many hours do you spend exercising or training each day?",
      "Do you exercise even when injured, sick, or physically exhausted?",
      "Does missing a planned workout cause intense anxiety or guilt?",
      "Has your exercise routine damaged personal or social relationships?",
      "Do you prioritize training over family, friends, or medical advice?",
      "Do you exercise compulsively to compensate for calories consumed?",
      "Have you experienced recurring overtraining injuries?",
      "Do you feel your self-worth depends entirely on workout completion?",
      "Have friends, family, or doctors expressed concern about your training?",
      "Do you push through sharp physical pain rather than taking a rest day?",
    ],
    tips: tips("exercise", "Program recovery and rest days into your training schedule as mandatory performance adaptations."),
    stories: [
      { author: "Amanda R.", days: 95, text: "I exercised 4 hours a day until overuse injuries forced a pause. Learning to rest made me stronger mentally and physically." },
      { author: "Chris B.", days: 120, text: "Therapy helped me see exercise was masking body anxiety. Now I train for joy and health, not punishment." },
      { author: "Jonah S.", days: 310, text: "Two scheduled rest days a week actually improved my strength markers and ended my chronic joint pain." },
    ],
  },
  {
    slug: "love-relationships",
    aliases: ["relationships", "love-addiction", "codependency"],
    name: "Love / Relationships",
    category: "Behavioral",
    tagline: "Intensity mistaken for intimacy",
    description:
      "Love addiction chases early-stage dopamine rushes and fears the calm. It manifests as chronic partner-seeking, staying in harmful dynamics, or losing independence.",
    icon: "💔",
    questions: [
      "Do you stay in unhealthy relationships out of an overwhelming fear of being alone?",
      "Do you feel empty or panicky when not actively in a relationship?",
      "Do you idealize new romantic partners and ignore obvious red flags?",
      "Have romantic relationships repeatedly eroded your personal independence?",
      "Do you find yourself repeating the same painful relationship dynamics?",
      "Do you move immediately from one intense relationship to the next?",
      "Do you completely lose your personal hobbies and friendships when dating?",
      "Is your baseline self-worth almost entirely dependent on a partner's validation?",
      "Do you compromise your core boundaries to keep someone interested?",
      "Have you stayed in toxic situations because leaving feels unmanageable?",
    ],
    tips: tips("relationship patterns", "Practice deliberate solitude — scheduled solo activities without digital distraction to build self-grounding."),
    stories: [
      { author: "Jessica M.", days: 150, text: "Therapy helped me realize my fear of being alone was driving me into toxic relationships. Learning self-compassion changed everything." },
      { author: "David R.", days: 180, text: "Taking a conscious 6-month dating break helped me discover who I am when I'm not performing for approval." },
      { author: "Cara D.", days: 400, text: "Calm does not mean boring. Finding peace in ordinary connection took time, and it was worth every day." },
    ],
  },
];

export const categories: Category[] = ["Substance", "Behavioral", "Health"];

export const getAddiction = (slug: string): Addiction | undefined => {
  const clean = slug.toLowerCase().trim();
  return addictions.find(
    (a) =>
      a.slug === clean ||
      (a.aliases && a.aliases.includes(clean)) ||
      a.slug.replace(/-/g, "") === clean.replace(/-/g, ""),
  );
};

export function scoreBand(total: number): "low" | "medium" | "high" {
  if (total <= 12) return "low";
  if (total <= 24) return "medium";
  return "high";
}

export const bandLabel = {
  low: "Low Concern (0–12)",
  medium: "Worth Attention (13–24)",
  high: "High Concern (25–40)",
} as const;
