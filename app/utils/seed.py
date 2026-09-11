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
                {"text": "Do you experience withdrawal symptoms when not drinking?", "type": "scale", "order": 5},
                {"text": "Have you given up activities because of drinking?", "type": "scale", "order": 6},
                {"text": "Do you drink alone or in secret?", "type": "scale", "order": 7},
                {"text": "Has anyone expressed concern about your drinking?", "type": "scale", "order": 8},
                {"text": "Do you experience blackouts or memory loss from drinking?", "type": "scale", "order": 9},
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
                {"text": "Do you check your phone first thing in the morning?", "type": "scale", "order": 5},
                {"text": "Does social media affect your self-esteem or mood?", "type": "scale", "order": 6},
                {"text": "Do you feel FOMO (fear of missing out) when offline?", "type": "scale", "order": 7},
                {"text": "Have you lied about your screen time to others?", "type": "scale", "order": 8},
                {"text": "Do you use screens during meals or social gatherings?", "type": "scale", "order": 9},
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
                {"text": "Do you lose track of time while gaming?", "type": "scale", "order": 5},
                {"text": "Have you sacrificed sleep to continue gaming?", "type": "scale", "order": 6},
                {"text": "Do you think about gaming when doing other activities?", "type": "scale", "order": 7},
                {"text": "Have you spent excessive money on games or in-game purchases?", "type": "scale", "order": 8},
                {"text": "Do you game alone more than with friends or family?", "type": "scale", "order": 9},
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
                {"text": "Do you smoke or vape in places where it's prohibited?", "type": "scale", "order": 5},
                {"text": "Have you continued despite health problems?", "type": "scale", "order": 6},
                {"text": "Do you experience withdrawal symptoms without nicotine?", "type": "scale", "order": 7},
                {"text": "Has nicotine use affected your relationships?", "type": "scale", "order": 8},
                {"text": "Do you smoke or vape more when stressed?", "type": "scale", "order": 9},
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
                {"text": "Do you buy things you don't need or use?", "type": "scale", "order": 5},
                {"text": "Do you experience a 'high' when shopping?", "type": "scale", "order": 6},
                {"text": "Have you maxed out credit cards from shopping?", "type": "scale", "order": 7},
                {"text": "Do you shop even when in debt?", "type": "scale", "order": 8},
                {"text": "Have you tried to stop but couldn't?", "type": "scale", "order": 9},
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
                {"text": "Do you eat in secret or hide food?", "type": "scale", "order": 5},
                {"text": "Do you feel guilty or ashamed after eating?", "type": "scale", "order": 6},
                {"text": "Do you binge eat regularly?", "type": "scale", "order": 7},
                {"text": "Has eating affected your health or weight?", "type": "scale", "order": 8},
                {"text": "Do you use food as a reward or comfort?", "type": "scale", "order": 9},
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
                {"text": "Do you experience jitters or anxiety from caffeine?", "type": "scale", "order": 5},
                {"text": "Do you consume caffeine even in the evening?", "type": "scale", "order": 6},
                {"text": "Has caffeine affected your heart rate or blood pressure?", "type": "scale", "order": 7},
                {"text": "Do you feel irritable without caffeine?", "type": "scale", "order": 8},
                {"text": "Have you increased your caffeine intake over time?", "type": "scale", "order": 9},
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
                {"text": "Do you use cannabis daily or multiple times per day?", "type": "scale", "order": 5},
                {"text": "Has your memory or concentration been affected?", "type": "scale", "order": 6},
                {"text": "Do you use cannabis to cope with emotions?", "type": "scale", "order": 7},
                {"text": "Have you driven under the influence?", "type": "scale", "order": 8},
                {"text": "Has cannabis use affected your motivation or goals?", "type": "scale", "order": 9},
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
                {"text": "Have you sought multiple prescriptions or doctors?", "type": "scale", "order": 5},
                {"text": "Do you take opioids to feel 'normal' rather than for pain?", "type": "scale", "order": 6},
                {"text": "Have you used opioids not prescribed to you?", "type": "scale", "order": 7},
                {"text": "Do you think about opioids constantly?", "type": "scale", "order": 8},
                {"text": "Have you neglected responsibilities due to opioid use?", "type": "scale", "order": 9},
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
                {"text": "Do you use stimulants alone or in secret?", "type": "scale", "order": 5},
                {"text": "Have you experienced paranoia or anxiety from use?", "type": "scale", "order": 6},
                {"text": "Do you need stimulants to feel confident or energized?", "type": "scale", "order": 7},
                {"text": "Have you spent significant money on stimulants?", "type": "scale", "order": 8},
                {"text": "Has stimulant use affected your physical health?", "type": "scale", "order": 9},
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
                {"text": "Do you gamble with money meant for bills or necessities?", "type": "scale", "order": 5},
                {"text": "Have you borrowed money to gamble?", "type": "scale", "order": 6},
                {"text": "Do you gamble to escape problems or negative feelings?", "type": "scale", "order": 7},
                {"text": "Have you committed illegal acts to finance gambling?", "type": "scale", "order": 8},
                {"text": "Has gambling jeopardized relationships or opportunities?", "type": "scale", "order": 9},
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
                {"text": "Do you view pornography at work or in public?", "type": "scale", "order": 5},
                {"text": "Has it affected your sexual function or satisfaction?", "type": "scale", "order": 6},
                {"text": "Do you feel shame or guilt after viewing?", "type": "scale", "order": 7},
                {"text": "Have you neglected responsibilities to view content?", "type": "scale", "order": 8},
                {"text": "Has your partner expressed concern about your use?", "type": "scale", "order": 9},
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
                {"text": "Do you check work emails/messages during personal time?", "type": "scale", "order": 5},
                {"text": "Have you cancelled personal plans for work?", "type": "scale", "order": 6},
                {"text": "Is your self-worth tied to your work performance?", "type": "scale", "order": 7},
                {"text": "Do you have hobbies or interests outside of work?", "type": "scale", "order": 8},
                {"text": "Have loved ones expressed concern about your work hours?", "type": "scale", "order": 9},
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
                {"text": "Do you use the internet to avoid real-life problems?", "type": "scale", "order": 5},
                {"text": "Has online time affected your sleep schedule?", "type": "scale", "order": 6},
                {"text": "Do you prefer online interactions to face-to-face?", "type": "scale", "order": 7},
                {"text": "Have you lied about your internet use?", "type": "scale", "order": 8},
                {"text": "Does internet use cause conflicts with others?", "type": "scale", "order": 9},
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
                {"text": "Do you feel you need sugar for energy?", "type": "scale", "order": 5},
                {"text": "Can you stop at one serving of sweets?", "type": "scale", "order": 6},
                {"text": "Do you eat sugar to cope with emotions?", "type": "scale", "order": 7},
                {"text": "Have you tried to cut back on sugar but failed?", "type": "scale", "order": 8},
                {"text": "Does sugar affect your mood or concentration?", "type": "scale", "order": 9},
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
                {"text": "Do you exercise to compensate for eating?", "type": "scale", "order": 5},
                {"text": "Have you experienced recurring injuries from exercise?", "type": "scale", "order": 6},
                {"text": "Do you feel guilty if you miss a workout?", "type": "scale", "order": 7},
                {"text": "Has anyone expressed concern about your exercise habits?", "type": "scale", "order": 8},
                {"text": "Do you exercise even when exhausted?", "type": "scale", "order": 9},
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
                {"text": "Do you move quickly from one relationship to another?", "type": "scale", "order": 5},
                {"text": "Do you lose yourself in relationships?", "type": "scale", "order": 6},
                {"text": "Is your self-worth dependent on having a partner?", "type": "scale", "order": 7},
                {"text": "Do you ignore red flags in relationships?", "type": "scale", "order": 8},
                {"text": "Have you sacrificed your values for a relationship?", "type": "scale", "order": 9},
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
