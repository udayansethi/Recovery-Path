from app import db
from app.models import Addiction, Questionnaire, Question, AddictionStory
from datetime import datetime, timedelta
import random


def seed_db():
    if Addiction.query.first():
        return

    addictions_data = [
        {
            "name": "Alcohol",
            "slug": "alcohol",
            "category": "Substance",
            "description": "Alcohol use disorder affects millions. Understanding your relationship with alcohol is the first step toward positive change.",
            "icon": "🍷",
            "questions": [
                {"text": "How often do you drink alcohol?", "type": "scale", "order": 0},
                {"text": "Do you drink more than you intended?", "type": "scale", "order": 1},
                {"text": "Have you tried to cut down but couldn't?", "type": "scale", "order": 2},
                {"text": "Does drinking interfere with work or relationships?", "type": "scale", "order": 3},
                {"text": "Do you need to drink more to get the same effect?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Sarah M.",
                    "title": "From Rock Bottom to Recovery",
                    "content": "I was drinking every night to cope with work stress. It started as 'just one glass' but soon I needed more and more. I lost my job, my relationships suffered, and I hit rock bottom. Getting sober was the hardest thing I've done, but it's also the best decision. I'm 2 years sober now and my life is better than ever. If you're struggling, know that recovery is possible."
                },
                {
                    "author_name": "Mike R.",
                    "title": "Finding Balance After 15 Years",
                    "content": "I thought I had it under control - only drinking on weekends. But it crept into weeknights too. The hangovers affected my work and I was always tired. I tried moderation but it didn't work. Going to AA meetings changed everything. The support from others who understand is invaluable. Don't wait as long as I did."
                },
                {
                    "author_name": "Anonymous",
                    "title": "A Mother's Journey",
                    "content": "As a single mom, I used alcohol to deal with the stress of raising kids alone. I never thought I was an alcoholic because I didn't drink every day. But when I did drink, I drank too much. My kids deserved better. Getting help was scary, but now I have 18 months of sobriety and a much closer relationship with my children."
                },
                {
                    "author_name": "David L.",
                    "title": "The Turning Point",
                    "content": "I was a functional alcoholic for years. Good job, nice house, but I was miserable inside. The anxiety, the shame, the constant planning around my next drink. One morning I woke up and decided enough was enough. I checked into rehab and it saved my life. Recovery isn't easy, but it's worth every moment of discomfort."
                },
                {
                    "author_name": "Lisa K.",
                    "title": "Breaking the Family Pattern",
                    "content": "Alcoholism runs in my family. I swore I'd never be like my parents, but here I was, drinking to numb the pain of my divorce. I lost custody battles because of my drinking. Getting sober meant facing all the emotions I'd been avoiding. Therapy and support groups helped me heal. You can break the cycle too."
                }
            ]
        },
        {
            "name": "Social Media & Screens",
            "slug": "social-media-screens",
            "category": "Behavioral",
            "description": "Excessive screen time and social media use can impact mental health, sleep, and daily functioning.",
            "icon": "📱",
            "questions": [
                {"text": "How many hours per day do you spend on screens?", "type": "scale", "order": 0},
                {"text": "Do you feel anxious when you can't check social media?", "type": "scale", "order": 1},
                {"text": "Does screen use interfere with sleep or work?", "type": "scale", "order": 2},
                {"text": "Have you tried to reduce screen time but struggled?", "type": "scale", "order": 3},
                {"text": "Do you prioritize screens over in-person activities?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Emma T.",
                    "title": "Breaking Free from the Scroll",
                    "content": "I was spending 6+ hours a day on social media. I'd wake up and immediately check my phone, scroll through feeds during work breaks, and stay up late doom-scrolling. My anxiety was through the roof from comparing myself to others. Deleting the apps and setting screen time limits changed everything. Now I read books, exercise, and actually talk to people. My mental health has improved dramatically."
                },
                {
                    "author_name": "James P.",
                    "title": "The Notification Trap",
                    "content": "Every notification made me anxious. I had to check every ping, every like, every comment. It was exhausting. I missed important moments with my family because I was glued to my phone. Setting my phone to 'do not disturb' during family time and deleting social apps from my home screen helped. I still use social media, but on my terms now."
                },
                {
                    "author_name": "Anonymous",
                    "title": "From Influencer to Real Life",
                    "content": "I was obsessed with building my 'personal brand' on Instagram. Posting, engaging, analyzing metrics - it consumed my life. I neglected my relationships and my own mental health. Realizing that my worth isn't measured in followers was a turning point. Now I focus on real connections and experiences. Social media is a tool, not my identity."
                },
                {
                    "author_name": "Rachel S.",
                    "title": "Sleep and Sanity Restored",
                    "content": "I couldn't sleep without scrolling. The blue light kept me awake, and the content made me anxious. I'd wake up tired and immediately reach for my phone. Setting a 'no screens after 9 PM' rule and keeping my phone in another room at night changed everything. I sleep better, wake up more rested, and have more energy for real life."
                },
                {
                    "author_name": "Tom W.",
                    "title": "Reconnecting with Reality",
                    "content": "Social media made me feel connected but actually left me feeling more isolated. I'd rather scroll than call friends or go out. My relationships suffered. I started with small changes - putting my phone away during meals, going for walks without it. Now I have deeper, more meaningful connections with people in my life."
                }
            ]
        },
        {
            "name": "Gaming",
            "slug": "gaming",
            "category": "Behavioral",
            "description": "Video game addiction can affect academics, relationships, and overall wellbeing. Acknowledging patterns is key.",
            "icon": "🎮",
            "questions": [
                {"text": "How many hours per day do you spend gaming?", "type": "scale", "order": 0},
                {"text": "Do you neglect other activities to game?", "type": "scale", "order": 1},
                {"text": "Do you feel irritable when you can't play?", "type": "scale", "order": 2},
                {"text": "Have relationships or work been affected by gaming?", "type": "scale", "order": 3},
                {"text": "Do you use gaming to escape stress or negative feelings?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Alex C.",
                    "title": "From All-Nighters to Balanced Gaming",
                    "content": "I was gaming 8+ hours a day, skipping meals and sleep. My grades dropped, I lost friends, and I was always exhausted. I thought gaming was my escape from stress, but it became the stress. Setting time limits and finding other hobbies helped. Now I game in moderation and have time for school, friends, and exercise. Gaming is fun again, not a compulsion."
                },
                {
                    "author_name": "Jordan M.",
                    "title": "The Wake-Up Call",
                    "content": "My gaming addiction cost me my job. I was staying up all night playing, then sleeping through work. The irritability when I couldn't play was intense. I joined a gaming support group and learned about balance. Now I game for fun, not as an escape. My life is so much better with structure and real-world achievements."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Reclaiming My Social Life",
                    "content": "Gaming took over my social life. I'd rather play online with strangers than hang out with real friends. My relationships suffered. I started by scheduling gaming time and protecting time for friends and family. Now I have a healthy balance. Gaming is still enjoyable, but it's not my only social outlet anymore."
                },
                {
                    "author_name": "Sam L.",
                    "title": "Breaking the Cycle",
                    "content": "I used gaming to avoid dealing with anxiety and depression. It was my comfort zone. But it made everything worse - I was isolated, my physical health declined. Therapy helped me address the root causes. Now I game occasionally for fun, but I have real coping strategies for when I'm struggling."
                },
                {
                    "author_name": "Casey R.",
                    "title": "Finding Real Achievements",
                    "content": "Online gaming gave me a sense of accomplishment, but it was artificial. In real life, I was stuck. I started small - limiting gaming to weekends, joining a sports team. The real-world achievements feel so much more meaningful now. Gaming taught me about strategy and teamwork, but real life offers so much more."
                }
            ]
        },
        {
            "name": "Smoking / Nicotine",
            "slug": "smoking-nicotine",
            "category": "Substance",
            "description": "Nicotine dependence is one of the most common addictions. Understanding your use can guide your quit journey.",
            "icon": "🚬",
            "questions": [
                {"text": "How many cigarettes or vapes per day?", "type": "scale", "order": 0},
                {"text": "Do you feel strong cravings when you can't use nicotine?", "type": "scale", "order": 1},
                {"text": "Have you tried to quit before?", "type": "scale", "order": 2},
                {"text": "Does nicotine use affect your health or budget?", "type": "scale", "order": 3},
                {"text": "Do you use nicotine within 30 minutes of waking?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Maria G.",
                    "title": "10 Years Smoke-Free",
                    "content": "I smoked for 20 years, a pack a day. The cravings were intense, especially in the morning. I tried quitting cold turkey multiple times but always went back. What finally worked was nicotine replacement therapy combined with a quit smoking app. The first month was hell, but now at 10 years smoke-free, I can't believe I ever smoked. My sense of taste and smell returned, and I have so much more energy."
                },
                {
                    "author_name": "Robert K.",
                    "title": "From 2 Packs to Zero",
                    "content": "I was smoking 2 packs a day for 15 years. My doctor told me I had COPD and might not live to see my kids graduate. That was my wake-up call. I joined a smoking cessation program and used patches. The first week I thought I'd die from cravings, but I powered through. Now I can run 5K races and breathe normally. Quitting saved my life."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Breaking the Habit",
                    "content": "Vaping seemed 'safer' than cigarettes, but I was addicted to nicotine. I'd wake up craving it, vape all day, and it was costing me $100+ a week. My teeth were stained, my breath smelled, and I was always anxious. I switched to nicotine gum, then gradually reduced. Now I'm completely free. The mental clarity is incredible."
                },
                {
                    "author_name": "Jennifer L.",
                    "title": "A Mother's Resolution",
                    "content": "I started smoking in college and couldn't quit even after having kids. I didn't want my children to see me smoking, but the addiction was too strong. My youngest asked me why I smoked, and I broke down. I quit cold turkey that day with my family's support. It's been 3 years now. My relationship with my kids is stronger, and I feel like a better mom."
                },
                {
                    "author_name": "David M.",
                    "title": "The Financial Freedom",
                    "content": "Smoking was costing me $300 a month. I could never save money. The health warnings didn't motivate me, but the financial aspect did. I started saving the money I would have spent on cigarettes in a jar. Seeing it add up motivated me to quit. Now I have that money for vacations and emergencies. Plus, I feel healthier and have more energy for work."
                }
            ]
        },
        {
            "name": "Shopping / Spending",
            "slug": "shopping-spending",
            "category": "Behavioral",
            "description": "Compulsive buying can lead to financial stress and emotional distress. Recognizing triggers helps regain control.",
            "icon": "🛍️",
            "questions": [
                {"text": "Do you shop to relieve stress or negative emotions?", "type": "scale", "order": 0},
                {"text": "Have you spent more than you can afford?", "type": "scale", "order": 1},
                {"text": "Do you feel guilty after shopping?", "type": "scale", "order": 2},
                {"text": "Does shopping interfere with financial goals?", "type": "scale", "order": 3},
                {"text": "Do you hide purchases from others?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Sarah T.",
                    "title": "From Debt to Financial Freedom",
                    "content": "I had $50,000 in credit card debt from compulsive shopping. Every time I felt stressed, I'd online shop. The high was temporary, followed by crushing guilt. I froze my credit cards and started therapy. Now I have a budget, save regularly, and shop mindfully. Breaking this cycle gave me back control of my life and finances."
                },
                {
                    "author_name": "Michael B.",
                    "title": "The Empty Closet",
                    "content": "I had hundreds of clothes with tags still on them. I'd buy impulsively, feel good for a moment, then never wear the items. My closet was full but I had nothing to wear. I started a 'shopping ban' for 6 months and donated unused items. Now I appreciate what I have and only buy what I need. My self-esteem improved dramatically."
                },
                {
                    "author_name": "Anonymous",
                    "title": "The Retail Therapy Trap",
                    "content": "Shopping was my coping mechanism for anxiety and depression. A bad day meant a shopping spree. I'd max out cards, then stress about bills. I learned to identify my triggers and find healthier ways to deal with emotions - exercise, journaling, talking to friends. Now I have money in savings and feel more emotionally stable."
                },
                {
                    "author_name": "Lisa R.",
                    "title": "Breaking the Cycle for My Kids",
                    "content": "I was teaching my kids bad financial habits through my compulsive shopping. I'd buy them everything they wanted to feel like a good mom, but we were drowning in debt. I started family budget meetings and led by example. Now we save for big purchases and appreciate what we have. My kids are learning healthy financial habits."
                },
                {
                    "author_name": "James W.",
                    "title": "Finding Joy in Experiences",
                    "content": "I thought buying things would make me happy, but it never did. I'd get the rush of purchase, then immediate buyer's remorse. I started spending on experiences instead - travel, classes, concerts. These memories last forever and don't create clutter. Now I find real joy in life experiences rather than material possessions."
                }
            ]
        },
        {
            "name": "Food / Eating",
            "slug": "food-eating",
            "category": "Health",
            "description": "Emotional or compulsive eating can affect physical and mental health. Building awareness is the first step.",
            "icon": "🍽️",
            "questions": [
                {"text": "Do you eat when not hungry to cope with emotions?", "type": "scale", "order": 0},
                {"text": "Do you feel out of control around food?", "type": "scale", "order": 1},
                {"text": "Does eating affect your self-esteem or body image?", "type": "scale", "order": 2},
                {"text": "Have you tried diets or restrictions that didn't work?", "type": "scale", "order": 3},
                {"text": "Does food dominate your thoughts?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Emily S.",
                    "title": "From Binge Eating to Mindful Eating",
                    "content": "I struggled with binge eating for years. Stress at work meant I'd eat entire bags of chips in secret. I'd feel disgusted afterward but couldn't stop. I started keeping a food journal and learning to identify my triggers. Now I eat mindfully, enjoy my food, and have lost 50 pounds. My relationship with food is healthy now."
                },
                {
                    "author_name": "Carlos M.",
                    "title": "Breaking the Emotional Eating Cycle",
                    "content": "Food was my comfort for every emotion - happy, sad, stressed, bored. I'd eat until I was uncomfortably full, then feel guilty. I learned to sit with my emotions instead of eating them. Therapy helped me develop other coping skills. Now I eat when I'm hungry and find joy in movement and hobbies. My mental health is so much better."
                },
                {
                    "author_name": "Anonymous",
                    "title": "The Diet Rollercoaster",
                    "content": "I tried every diet - keto, paleo, intermittent fasting. I'd lose weight, then gain it back plus more. The restriction made me obsessed with food. I gave up dieting and focused on intuitive eating. Listening to my body's signals instead of rules changed everything. Now I have a peaceful relationship with food and maintain a healthy weight naturally."
                },
                {
                    "author_name": "Rachel P.",
                    "title": "Food Freedom After 20 Years",
                    "content": "I hid food and ate in secret for 20 years. My eating controlled my life - what I ate, when I ate, how much I weighed. I was exhausted from the shame. Working with a therapist specializing in eating disorders helped me break free. Now I eat normally around others, enjoy all foods in moderation, and my self-worth isn't tied to my weight."
                },
                {
                    "author_name": "Tom H.",
                    "title": "Finding Balance and Health",
                    "content": "I used food to cope with anxiety. Eating gave me temporary relief, but then I'd feel worse physically and emotionally. I started meditation and exercise to manage anxiety instead. Now I fuel my body properly and feel strong. Food is nourishment, not a coping mechanism. My energy levels and mental clarity are amazing."
                }
            ]
        },
        {
            "name": "Caffeine",
            "slug": "caffeine",
            "category": "Substance",
            "description": "High caffeine intake can cause anxiety, sleep issues, and dependence. Understanding your intake helps balance it.",
            "icon": "☕",
            "questions": [
                {"text": "How many caffeinated drinks per day?", "type": "scale", "order": 0},
                {"text": "Do you get headaches without caffeine?", "type": "scale", "order": 1},
                {"text": "Does caffeine affect your sleep?", "type": "scale", "order": 2},
                {"text": "Do you feel you need caffeine to function?", "type": "scale", "order": 3},
                {"text": "Have you tried to cut back but struggled?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Amanda C.",
                    "title": "From 8 Cups to Calm",
                    "content": "I was drinking 8+ cups of coffee a day. My hands shook, I had constant anxiety, and I couldn't sleep without it. The crash when it wore off was awful. I gradually reduced my intake over 2 weeks, switching to half-caf then decaf. Now I drink 1-2 cups a day and feel so much calmer. My anxiety is gone and I sleep through the night."
                },
                {
                    "author_name": "Brian L.",
                    "title": "Breaking the Energy Drink Habit",
                    "content": "Energy drinks were my crutch for studying and work. I'd drink 4-5 a day, feeling wired but exhausted. My heart raced constantly and I had terrible crashes. I replaced them with water, exercise, and proper sleep. Now I have natural energy and don't need artificial stimulation. My focus and productivity are better than ever."
                },
                {
                    "author_name": "Anonymous",
                    "title": "The Anxiety Connection",
                    "content": "I thought caffeine helped my focus, but it was making my anxiety worse. I'd get jittery, have panic attacks, and then drink more coffee to 'calm down.' Breaking the cycle was hard - the headaches were intense. Now I drink herbal tea and my anxiety is manageable. I can think clearly without the constant buzz."
                },
                {
                    "author_name": "Sophie M.",
                    "title": "Better Sleep, Better Life",
                    "content": "Caffeine after 2 PM ruined my sleep. I'd toss and turn for hours, then be exhausted the next day. It became a vicious cycle. I set a strict cutoff time and switched to caffeine-free alternatives. Now I sleep soundly and wake up refreshed. My mood, energy, and concentration have all improved dramatically."
                },
                {
                    "author_name": "Kevin R.",
                    "title": "Finding Natural Energy",
                    "content": "I relied on caffeine for energy because I was always tired. But it was masking other issues. Once I cut back, I discovered I had sleep apnea and poor diet. Treating those properly gave me real energy. Now I exercise regularly, eat well, and sleep better. I don't need caffeine anymore - I have natural vitality."
                }
            ]
        },
        {
            "name": "Marijuana / Cannabis",
            "slug": "marijuana-cannabis",
            "category": "Substance",
            "description": "Cannabis use can become problematic when it interferes with daily life, relationships, or responsibilities.",
            "icon": "🌿",
            "questions": [
                {"text": "How often do you use marijuana?", "type": "scale", "order": 0},
                {"text": "Do you use more than you intended?", "type": "scale", "order": 1},
                {"text": "Have you tried to cut down or stop?", "type": "scale", "order": 2},
                {"text": "Does cannabis interfere with work or school?", "type": "scale", "order": 3},
                {"text": "Do you experience withdrawal symptoms?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Tyler J.",
                    "title": "From Daily Use to Freedom",
                    "content": "I smoked weed every day for 10 years. It started as fun, but became a habit. I was unmotivated, my grades suffered, and I lost interest in hobbies. The withdrawal was tough - anxiety, insomnia, loss of appetite. But after 30 days clean, everything changed. I have energy, motivation, and enjoy life again. Cannabis was holding me back."
                },
                {
                    "author_name": "Jessica W.",
                    "title": "The Memory and Motivation Return",
                    "content": "I used cannabis daily thinking it helped my anxiety, but it made my memory terrible and killed my motivation. I'd forget conversations, miss deadlines, and feel foggy. Quitting was hard - the anxiety came back temporarily. But now my memory is sharp, I'm productive, and I handle anxiety with therapy and exercise. I wish I'd quit sooner."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Breaking the Habit for My Future",
                    "content": "Medical marijuana helped my pain initially, but I became dependent. I'd use more than prescribed and it affected my job performance. The brain fog was constant. I tapered off gradually and found other pain management methods. Now I'm clear-headed, more productive, and building a better future. Cannabis was a crutch I didn't need."
                },
                {
                    "author_name": "Marcus D.",
                    "title": "Rediscovering Natural Joy",
                    "content": "Cannabis made everything 'better' temporarily, but I lost touch with real emotions. I was always chasing that high. When I quit, I experienced emotions fully for the first time in years. Some were painful, but most were beautiful. I laugh harder, love deeper, and find joy in simple things. Life is more vibrant without the filter."
                },
                {
                    "author_name": "Lauren P.",
                    "title": "The Sleep and Health Recovery",
                    "content": "I used cannabis to help sleep, but it disrupted my REM sleep and made me groggy. I'd wake up tired and use more during the day. Breaking the cycle was challenging, but now I sleep naturally and wake refreshed. My energy levels are higher, I'm exercising regularly, and my overall health has improved dramatically."
                }
            ]
        },
        {
            "name": "Opioids / Painkillers",
            "slug": "opioids-painkillers",
            "category": "Substance",
            "description": "Opioid dependence is serious and can develop from prescription medications. Professional help is often needed.",
            "icon": "💊",
            "questions": [
                {"text": "How often do you use opioids or painkillers?", "type": "scale", "order": 0},
                {"text": "Do you take more than prescribed?", "type": "scale", "order": 1},
                {"text": "Do you experience withdrawal symptoms?", "type": "scale", "order": 2},
                {"text": "Has opioid use affected your health or relationships?", "type": "scale", "order": 3},
                {"text": "Do you continue using despite negative consequences?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Daniel R.",
                    "title": "From Prescription to Addiction",
                    "content": "I started with prescription painkillers after back surgery. What began as legitimate pain management became dependence. I needed more and more to feel normal. The withdrawal was hell - nausea, sweating, anxiety. With medical supervision and therapy, I got clean. Now I manage pain with physical therapy and mindfulness. My life is mine again."
                },
                {
                    "author_name": "Michelle K.",
                    "title": "The Family That Healed Together",
                    "content": "My opioid addiction destroyed my family. I was stealing pills, lying, and my kids were scared. The turning point was when my daughter found me unconscious. I entered rehab and my family joined family therapy. Now we're closer than ever. Recovery taught us all about communication, boundaries, and unconditional love."
                },
                {
                    "author_name": "Anonymous",
                    "title": "The Long Road to Recovery",
                    "content": "I was addicted to prescription opioids for 8 years. I tried quitting multiple times but always relapsed. The physical dependence was overwhelming. What finally worked was medication-assisted treatment combined with intensive therapy. It's been 5 years clean now. Recovery is possible, but it takes time and professional help."
                },
                {
                    "author_name": "Robert S.",
                    "title": "Finding Purpose Beyond the Pills",
                    "content": "Opioids took everything - my job, my home, my dignity. I lived for the next dose. Getting clean meant facing the pain I was avoiding. Through recovery, I found purpose in helping others. Now I volunteer at a recovery center and have a meaningful career. The pills were killing me slowly; recovery gave me life."
                },
                {
                    "author_name": "Jennifer M.",
                    "title": "Breaking the Stigma",
                    "content": "I was a nurse addicted to opioids I stole from work. The shame was overwhelming. I thought I'd lose my license and never work again. But I got help and now I'm back at work, clean and helping others. Recovery challenged my stigma about addiction. Anyone can become addicted, and anyone can recover with the right support."
                }
            ]
        },
        {
            "name": "Cocaine / Stimulants",
            "slug": "cocaine-stimulants",
            "category": "Substance",
            "description": "Stimulant use can create intense dependence and health risks. Recovery is possible with support.",
            "icon": "💎",
            "questions": [
                {"text": "How often do you use stimulants?", "type": "scale", "order": 0},
                {"text": "Do you use more than planned?", "type": "scale", "order": 1},
                {"text": "Do you experience crashes or withdrawal?", "type": "scale", "order": 2},
                {"text": "Has stimulant use affected your work or relationships?", "type": "scale", "order": 3},
                {"text": "Do you continue using despite health concerns?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Alex T.",
                    "title": "From Party Drug to Recovery",
                    "content": "Cocaine started as weekend fun but became daily use. The high was amazing but the crash was devastating. I'd be depressed, anxious, and exhausted. My relationships suffered, my work suffered. Getting clean was the hardest thing I've done. Now I have real energy, real happiness, and real relationships. The fake high wasn't worth losing everything."
                },
                {
                    "author_name": "Stephanie B.",
                    "title": "The Heart That Almost Gave Out",
                    "content": "I was using cocaine regularly when I had a heart attack at 32. The doctors said another one could kill me. That was my wake-up call. I entered rehab and learned that cocaine was just numbing my underlying depression. With therapy and antidepressants, I found real ways to cope. My heart is healing and so is my mind."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Losing Everything to Find Myself",
                    "content": "Cocaine took my job, my home, my family. I was living on the street, using whatever I could get. The paranoia and psychosis were terrifying. Hitting bottom led me to rehab. Now I have 7 years clean, a stable job, and reconciled with my family. Recovery showed me who I really am beneath the addiction."
                },
                {
                    "author_name": "Chris M.",
                    "title": "The Confidence That Wasn't Real",
                    "content": "I used stimulants to boost my confidence for work and social situations. It worked temporarily, but the anxiety and depression when it wore off were worse. I was always chasing the next high. Therapy helped me build real self-esteem. Now I feel confident without chemicals, and my relationships are authentic."
                },
                {
                    "author_name": "Nicole R.",
                    "title": "Breaking the Cycle for My Children",
                    "content": "My cocaine use started affecting my parenting. I'd be high when I should be present with my kids. The guilt was eating me alive. I got clean for them, but stayed clean for myself. Now I have a beautiful relationship with my children, and they've learned that asking for help is a sign of strength, not weakness."
                }
            ]
        },
        {
            "name": "Gambling",
            "slug": "gambling",
            "category": "Behavioral",
            "description": "Problem gambling can lead to financial ruin and emotional distress. Recognizing patterns is crucial.",
            "icon": "🎰",
            "questions": [
                {"text": "How often do you gamble?", "type": "scale", "order": 0},
                {"text": "Do you chase losses by gambling more?", "type": "scale", "order": 1},
                {"text": "Have you lied about gambling to others?", "type": "scale", "order": 2},
                {"text": "Does gambling affect your finances or work?", "type": "scale", "order": 3},
                {"text": "Do you feel restless when not gambling?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Mark H.",
                    "title": "From Winning Streaks to Rock Bottom",
                    "content": "I started gambling casually but got hooked on the thrill. I'd win big, then lose everything trying to get it back. I maxed out credit cards, borrowed from friends, and lost my house. The shame was overwhelming. GA meetings and therapy helped me face my addiction. Now I have 6 years clean and am rebuilding my financial life. Gambling promised excitement but delivered destruction."
                },
                {
                    "author_name": "Linda S.",
                    "title": "The Secret That Almost Destroyed My Marriage",
                    "content": "I hid my gambling from my husband for years. I'd take money from our savings, lie about where it went. The guilt and fear consumed me. When he found out, I thought our marriage was over. But we went to counseling together and I got help. Now our marriage is stronger, built on honesty and trust. I wish I'd asked for help sooner."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Sports Betting Addiction",
                    "content": "Sports betting seemed harmless at first. I was 'good at it' and made money initially. But soon I was betting more than I could afford, watching games I didn't care about just to bet. The losses piled up, and I became depressed. Quitting gambling freed up mental space for real interests. Now I enjoy sports for fun, not profit."
                },
                {
                    "author_name": "David P.",
                    "title": "Losing My Business to Poker",
                    "content": "I owned a successful business but lost it all to online poker. I'd stay up all night playing, make irrational decisions, and neglect my work. The highs of winning and lows of losing were addictive. Bankruptcy was my wake-up call. Now I have a new business and healthy hobbies. Poker taught me about risk, but real life offers better rewards."
                },
                {
                    "author_name": "Sarah L.",
                    "title": "Breaking the Family Gambling Pattern",
                    "content": "Gambling ran in my family. I swore I'd never be like my father, but I was gambling away my paycheck every week. The cycle of hope and despair was exhausting. Getting help broke the pattern. Now I teach my children about healthy risk-taking and financial responsibility. Recovery isn't just personal - it's generational."
                }
            ]
        },
        {
            "name": "Pornography / Sexual Content",
            "slug": "pornography-sexual",
            "category": "Behavioral",
            "description": "Excessive pornography use can impact relationships and mental health. Building healthy habits is key.",
            "icon": "🔞",
            "questions": [
                {"text": "How much time do you spend on pornography?", "type": "scale", "order": 0},
                {"text": "Do you feel compelled to view more extreme content?", "type": "scale", "order": 1},
                {"text": "Does it interfere with real relationships?", "type": "scale", "order": 2},
                {"text": "Have you tried to reduce but struggled?", "type": "scale", "order": 3},
                {"text": "Do you use it to cope with stress or emotions?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Jason M.",
                    "title": "From Isolation to Intimacy",
                    "content": "I spent hours every day watching porn. It started as curiosity but became compulsive. Real intimacy felt impossible - I was desensitized and had unrealistic expectations. Porn was my secret world. Breaking free through accountability and therapy opened me up to real relationships. Now I have a meaningful connection with my partner and feel truly alive."
                },
                {
                    "author_name": "Rebecca T.",
                    "title": "The Shame That Silenced Me",
                    "content": "My porn addiction made me feel dirty and ashamed. I'd watch in secret, then hate myself afterward. It affected my self-esteem and ability to be vulnerable. Talking about it in therapy was terrifying but liberating. Now I understand it was about unmet emotional needs. I'm learning to have healthy relationships with myself and others."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Reclaiming My Sexuality",
                    "content": "Porn became my primary sexual experience. Real sex felt inadequate in comparison. I was missing out on genuine intimacy and connection. Quitting porn helped me rediscover what real pleasure feels like. Now I enjoy sex with my partner more than ever. Porn was a poor substitute for the real thing."
                },
                {
                    "author_name": "Michael S.",
                    "title": "Breaking the Dopamine Cycle",
                    "content": "I was chasing increasingly extreme content, needing more to feel satisfied. The guilt and shame were constant. Understanding the neuroscience of addiction helped me break free. I replaced the habit with exercise and meditation. My focus improved, my relationships deepened, and I feel more in control of my life."
                },
                {
                    "author_name": "Amanda K.",
                    "title": "Finding Real Connection",
                    "content": "Porn was my escape from loneliness, but it made me more isolated. I'd rather watch screens than risk real rejection. The turning point was realizing I was missing out on genuine human connection. Therapy and support groups helped me build real relationships. Now I have friends, a partner, and feel truly connected to others."
                }
            ]
        },
        {
            "name": "Work / Career",
            "slug": "work-career",
            "category": "Behavioral",
            "description": "Workaholism can lead to burnout, health issues, and strained relationships. Balance is essential.",
            "icon": "💼",
            "questions": [
                {"text": "How many hours do you work per week?", "type": "scale", "order": 0},
                {"text": "Do you work when you're supposed to be relaxing?", "type": "scale", "order": 1},
                {"text": "Does work interfere with personal relationships?", "type": "scale", "order": 2},
                {"text": "Do you feel guilty when not working?", "type": "scale", "order": 3},
                {"text": "Has work affected your physical or mental health?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Karen W.",
                    "title": "From Burnout to Balance",
                    "content": "I worked 80+ hours a week for years. I thought it made me successful, but I was exhausted and depressed. My marriage suffered, my health declined. A panic attack at work was my wake-up call. I learned to set boundaries and delegate. Now I work normal hours, have energy for my family, and am actually more productive."
                },
                {
                    "author_name": "Thomas B.",
                    "title": "The Promotion That Cost Everything",
                    "content": "I sacrificed everything for career advancement. No time for friends, family, or hobbies. I got the big promotion but felt empty. My relationships suffered, my health suffered. I quit and started my own business with better work-life balance. Now I'm happier, healthier, and more successful in ways that matter."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Rediscovering Life Beyond Work",
                    "content": "Work was my identity. I'd check email during dinner, work weekends, cancel personal plans. The anxiety of not working was constant. Burnout led to depression. I started therapy and learned that my worth isn't defined by work. Now I have hobbies, friends, and a full life. Work is part of my life, not my whole life."
                },
                {
                    "author_name": "Lisa P.",
                    "title": "Setting Boundaries for My Family",
                    "content": "My workaholism was affecting my children. I'd miss school events, be irritable when home. They deserved a present parent. I started leaving work at work - no emails after hours, dedicated family time. The initial guilt faded. Now my children are thriving and I model healthy work habits for them."
                },
                {
                    "author_name": "Robert C.",
                    "title": "Quality Over Quantity",
                    "content": "I believed working more hours meant being more valuable. But I was tired, made mistakes, and missed creative solutions. Learning to work smarter, not harder, changed everything. I set boundaries, took real breaks, and focused on high-impact work. My productivity increased and I have energy for the important things in life."
                }
            ]
        },
        {
            "name": "Internet / Online Activities",
            "slug": "internet-online",
            "category": "Behavioral",
            "description": "Excessive internet use beyond social media can impact productivity and social connections.",
            "icon": "🌐",
            "questions": [
                {"text": "How many hours daily on non-work internet?", "type": "scale", "order": 0},
                {"text": "Do you lose track of time online?", "type": "scale", "order": 1},
                {"text": "Does internet use interfere with responsibilities?", "type": "scale", "order": 2},
                {"text": "Do you feel anxious when offline?", "type": "scale", "order": 3},
                {"text": "Have you tried to limit internet use?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Derek L.",
                    "title": "From Screen Zombie to Present",
                    "content": "I spent 6+ hours a day online - forums, news sites, random browsing. I'd lose entire evenings to clicking links. My real life suffered - neglected relationships, unfinished projects. Setting time limits and finding offline hobbies changed everything. Now I'm present with my family and actually accomplish things. Life is richer offline."
                },
                {
                    "author_name": "Nina S.",
                    "title": "Breaking the News Addiction",
                    "content": "I was constantly checking news sites, getting anxious about world events I couldn't control. The doom-scrolling affected my mental health. I limited news to specific times and focused on local actions. Now I'm more informed but less anxious. I volunteer locally instead of just reading about problems."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Reconnecting with the Real World",
                    "content": "Online communities became my social life. I'd rather chat with strangers than talk to people nearby. The isolation was depressing. I started with small changes - phone-free walks, joining local groups. Now I have real friendships and feel connected. Online connections are great, but they can't replace face-to-face relationships."
                },
                {
                    "author_name": "Paul M.",
                    "title": "Productivity Restored",
                    "content": "I thought I was being productive online - researching, learning. But I was procrastinating real work. Hours would pass in rabbit holes. Setting focused work sessions without internet access changed everything. I get more done in less time and have mental space for creative thinking."
                },
                {
                    "author_name": "Sophie R.",
                    "title": "Finding Peace in Disconnecting",
                    "content": "The constant connectivity made me anxious. I felt like I was missing something important online. Taking digital detox weekends helped me realize I wasn't missing anything - I was gaining peace. Now I check email twice a day and enjoy uninterrupted time. My mind is clearer and I'm more creative."
                }
            ]
        },
        {
            "name": "Sugar / Sweets",
            "slug": "sugar-sweets",
            "category": "Health",
            "description": "Sugar addiction can affect energy levels, weight, and overall health. Mindful eating helps.",
            "icon": "🍬",
            "questions": [
                {"text": "How often do you crave sugary foods?", "type": "scale", "order": 0},
                {"text": "Do you eat sweets when not hungry?", "type": "scale", "order": 1},
                {"text": "Do you experience sugar crashes?", "type": "scale", "order": 2},
                {"text": "Has sugar intake affected your health?", "type": "scale", "order": 3},
                {"text": "Do you hide your sugar consumption?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Melissa H.",
                    "title": "From Sugar Cravings to Stable Energy",
                    "content": "I was addicted to sugar - candy, soda, baked goods. The crashes were awful - shaky, irritable, exhausted. I'd eat sweets to feel better, then crash again. Breaking the cycle by cutting processed sugars and eating whole foods changed everything. Now I have stable energy, better mood, and lost 30 pounds naturally."
                },
                {
                    "author_name": "James T.",
                    "title": "The Hidden Sugar Habit",
                    "content": "I ate sweets in secret, feeling ashamed afterward. The sugar high was my escape from stress. But it was affecting my health - weight gain, blood sugar issues. Learning about sugar's effect on dopamine helped me understand the addiction. Now I eat mindfully and find other ways to cope with stress. My relationship with food is healthy."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Breaking Free from Dessert Dependency",
                    "content": "Every meal ended with dessert. I couldn't stop at one cookie - I'd eat the whole package. The guilt and physical discomfort were constant. I started with small changes - no sweets in the house, eating fruit instead. Now I enjoy sweets occasionally without compulsion. Food is fuel and pleasure, not an addiction."
                },
                {
                    "author_name": "Rachel G.",
                    "title": "Sugar and Mental Health",
                    "content": "Sugar made my anxiety worse. The crashes triggered panic attacks. I used sweets to self-medicate. Cutting sugar reduced my anxiety significantly. Combined with therapy, I have better emotional regulation. Now I understand that sugar was masking deeper issues. My mental health is much more stable."
                },
                {
                    "author_name": "David K.",
                    "title": "Family Health Transformation",
                    "content": "My whole family was addicted to sugar. We'd eat ice cream every night, drink soda daily. Our health suffered - weight issues, low energy. I led the change by removing sugary drinks and processed foods. Now we eat whole foods and occasional treats. Our family is healthier, more energetic, and we model good habits for our kids."
                }
            ]
        },
        {
            "name": "Exercise",
            "slug": "exercise",
            "category": "Health",
            "description": "While exercise is healthy, excessive exercise can become compulsive and harmful to health.",
            "icon": "🏃",
            "questions": [
                {"text": "How many hours do you exercise daily?", "type": "scale", "order": 0},
                {"text": "Do you exercise when injured or sick?", "type": "scale", "order": 1},
                {"text": "Does missing exercise cause anxiety?", "type": "scale", "order": 2},
                {"text": "Has exercise affected your social life?", "type": "scale", "order": 3},
                {"text": "Do you prioritize exercise over other activities?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Amanda R.",
                    "title": "From Exercise Obsession to Balance",
                    "content": "I exercised 3-4 hours a day, every day. If I missed a workout, I'd be anxious and irritable. It started as healthy but became compulsive. I injured myself multiple times pushing too hard. Learning to listen to my body and include rest days changed everything. Now I exercise for enjoyment and health, not punishment."
                },
                {
                    "author_name": "Chris B.",
                    "title": "The Injury That Saved Me",
                    "content": "I tore my Achilles tendon from overtraining. The injury forced me to rest and reflect. I realized exercise was my coping mechanism for body image issues and anxiety. Therapy helped me develop a healthy relationship with movement. Now I exercise moderately and focus on overall wellness. I'm stronger mentally and physically."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Breaking the Perfection Cycle",
                    "content": "I had to exercise perfectly or not at all. If I ate 'badly,' I'd punish myself with extra workouts. This created a toxic cycle of restriction and over-exercise. Intuitive movement and body acceptance changed everything. Now I move my body for joy, not punishment. My relationship with my body is healthy and compassionate."
                },
                {
                    "author_name": "Sarah L.",
                    "title": "Finding Joy in Movement Again",
                    "content": "Exercise became a chore I dreaded. I'd force myself through workouts, feeling guilty if I skipped. The obligation killed my love for movement. I started trying different activities - dance, yoga, hiking. Now I look forward to exercise and have more energy for life. Movement is a celebration, not a punishment."
                },
                {
                    "author_name": "Mike T.",
                    "title": "Exercise and Mental Health Balance",
                    "content": "I used exercise to manage depression and anxiety. If I didn't work out, my mental health suffered. But over-exercising made it worse - fatigue, irritability, injuries. Finding balance with moderate exercise plus therapy was key. Now I have sustainable habits that support my mental health rather than control it."
                }
            ]
        },
        {
            "name": "Love / Relationships",
            "slug": "love-relationships",
            "category": "Behavioral",
            "description": "Love addiction involves unhealthy attachment patterns that can prevent fulfilling relationships.",
            "icon": "💔",
            "questions": [
                {"text": "Do you stay in unhealthy relationships?", "type": "scale", "order": 0},
                {"text": "Do you fear being alone?", "type": "scale", "order": 1},
                {"text": "Do you idealize partners unrealistically?", "type": "scale", "order": 2},
                {"text": "Have relationships affected your independence?", "type": "scale", "order": 3},
                {"text": "Do you repeat unhealthy relationship patterns?", "type": "scale", "order": 4},
            ],
            "stories": [
                {
                    "author_name": "Jessica M.",
                    "title": "From Toxic Relationships to Healthy Love",
                    "content": "I stayed in abusive relationships because I feared being alone. The pattern repeated - intense love, then pain, but I couldn't leave. Therapy helped me understand my love addiction stemmed from childhood abandonment. Learning to love myself first changed everything. Now I have a healthy relationship built on mutual respect and genuine connection."
                },
                {
                    "author_name": "David R.",
                    "title": "Breaking the Love Addiction Cycle",
                    "content": "I fell in love instantly and intensely every time. The highs were amazing but the lows devastating. I'd lose myself in relationships, ignore red flags, stay when I should leave. Taking time alone between relationships helped me heal. Now I date consciously and maintain my independence. Love is wonderful, but not at the expense of self."
                },
                {
                    "author_name": "Anonymous",
                    "title": "Finding Self-Worth Beyond Relationships",
                    "content": "My identity was wrapped up in being someone's partner. When relationships ended, I felt worthless. I'd jump into new relationships to avoid the pain. Learning to be alone and build self-esteem was transformative. Now I enjoy relationships as an addition to my full life, not as my source of worth."
                },
                {
                    "author_name": "Maria S.",
                    "title": "The Fear of Being Alone",
                    "content": "I was terrified of being single. I'd stay in mediocre relationships just to avoid loneliness. The fear drove me to make poor choices. Embracing solitude and building a rich single life changed everything. Now I enter relationships from a place of strength, not desperation. Being alone is peaceful, not scary."
                },
                {
                    "author_name": "Alex P.",
                    "title": "Healing Attachment Wounds",
                    "content": "My love addiction came from insecure attachment. I'd cling to partners, become jealous, sabotage relationships to test love. Understanding my attachment style through therapy was eye-opening. I learned healthy communication and boundaries. Now I have secure, loving relationships that bring joy rather than drama."
                }
            ]
        },
    ]

    for data in addictions_data:
        stories_data = data.pop("stories", [])
        questions_data = data.pop("questions")
        addiction = Addiction(**data)
        db.session.add(addiction)
        db.session.flush()

        questionnaire = Questionnaire(addiction_id=addiction.id)
        db.session.add(questionnaire)
        db.session.flush()

        for q in questions_data:
            question = Question(
                questionnaire_id=questionnaire.id,
                text=q["text"],
                question_type=q.get("type", "scale"),
                order=q["order"],
            )
            db.session.add(question)

        # Add sample stories
        for story_data in stories_data:
            # Create stories with random dates in the past
            days_ago = random.randint(1, 365)
            created_date = datetime.utcnow() - timedelta(days=days_ago)

            story = AddictionStory(
                addiction_id=addiction.id,
                author_name=story_data["author_name"],
                title=story_data["title"],
                content=story_data["content"],
                is_anonymous=story_data["author_name"] == "Anonymous",
                is_sample=True,
                created_at=created_date
            )
            db.session.add(story)

    db.session.commit()
