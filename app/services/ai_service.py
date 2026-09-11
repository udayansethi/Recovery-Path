import os
import re
import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

# Deterministic Crisis & Emergency Regex Patterns
CRISIS_PATTERNS = [
    r"\b(suicide|kill myself|want to die|end my life|take my own life|end it all)\b",
    r"\b(overdose|hang myself|slit my wrist|self[- ]harm|cutting myself|took all my pills|lethal dose)\b",
    r"\b(can'?t go on anymore|no reason to live|better off dead|want to disappear|give up on life)\b",
    r"\b(swallow(ed)? bleach|drank poison|shoot myself|jump off|hang myself)\b",
]


CRISIS_MESSAGE = (
    "It sounds like you are carrying an overwhelming amount of pain. Please know that you are not alone, "
    "and compassionate, confidential support is available right now:\n\n"
    "• **US Suicide & Crisis Lifeline:** Call or Text **988** (Free, confidential, 24/7)\n"
    "• **SAMHSA National Helpline:** Call **1-800-662-4357** (Free 24/7 treatment referral)\n"
    "• **Crisis Text Line:** Text **HOME to 741741**\n"
    "• **International / UK:** Call **111** (NHS) or **116 123** (Samaritans)\n"
    "• **Emergency:** Call **911** / **112** or go to your nearest emergency room."
)


READY_PROMPTS_MAP = {
    "Help me practice saying NO to peer pressure at a social event.": (
        "### 🗣️ Refusal Practice: 3 Ways to Say \"No\" Firmly & Casually\n\n"
        "1. **The Casual Deflect:** *\"I'm good for now with a soda/water, thanks!\"*\n"
        "2. **The Health Priority:** *\"I'm on a 30-day health & energy reset, feeling great with it.\"*\n"
        "3. **The Clear Boundary:** *\"I've stopped completely. Thanks for respecting that!\"*\n\n"
        "**Pro-Tip:** You don't owe anyone an elaborate explanation. A calm, relaxed posture and friendly smile communicate confidence without inviting debate."
    ),
    "I am feeling a strong urge right now. Guide me through urge surfing.": (
        "### 🌊 You Are Experiencing an Urge Wave\n\n"
        "Take a slow, grounding breath with me right now. Cravings feel intense, but scientifically they follow an ocean wave curve — they crest within 10 to 15 minutes and naturally subside.\n\n"
        "• **Somatic Grounding:** Feel your feet flat on the floor. Name 3 things you can touch around you.\n"
        "• **Urge Surfing:** Don't fight the craving; visualize it like an ocean wave passing underneath you.\n"
        "• Click the **🚨 SOS Urge Assist** button in the top navigation for our live 4-7-8 breathing circle and 3-minute timer."
    ),
    "Give me a 2-minute calming bedtime somatic relaxation script.": (
        "### 🌙 2-Minute Bedtime Somatic Calming Script\n\n"
        "1. **Drop Your Shoulders:** Unclench your jaw, soften your forehead, and drop your shoulders away from your ears.\n"
        "2. **4-7-8 Breathing:** Inhale gently through your nose for 4 seconds, hold gently for 7 seconds, and exhale slowly with a soft *whoosh* for 8 seconds. Repeat 3 times.\n"
        "3. **Mental Release:** Tell yourself: *\"I did enough today. I am safe right now. Tonight my body and mind can rest, repair, and heal.\"*"
    ),
    "I feel discouraged and guilty about my progress. Help me reframe.": (
        "### 💙 Please Be Gentle With Yourself\n\n"
        "A slip or difficult day is a data point, never the end of your story. Every single day of effort you put in still counts and has physically reshaped your neural pathways.\n\n"
        "Ask yourself with curiosity instead of shame:\n"
        "1. *What trigger or emotional state caught me off guard?*\n"
        "2. *What one protective guardrail can I put in place for tomorrow?*\n\n"
        "Drink a glass of water, forgive yourself, and step right back onto your path today."
    ),
}


class AIService:
    """
    Clean, robust AI Service supporting 100% Free AI API Keys:
    1. Google Gemini API (gemini-3.1-flash-lite / gemini-3.5-flash-lite / gemini-flash-latest) - Primary
    2. Groq Cloud API (llama-3.3-70b-versatile) - Secondary / Fallback
    3. Compassionate Recovery Intelligence - If APIs are unconfigured or offline
    """

    def __init__(self):
        self.gemini_api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        self.groq_api_key = os.environ.get("GROQ_API_KEY", "").strip()

    def check_crisis(self, text: str) -> bool:
        """Deterministic 0ms check for self-harm or crisis keywords."""
        if not text:
            return False
        for pattern in CRISIS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    def _call_gemini(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        """Call Google Gemini Flash REST endpoint using free API key."""
        if not self.gemini_api_key:
            return None

        candidate_models = [
            "models/gemini-3.1-flash-lite",
            "models/gemini-flash-lite-latest",
        ]

        payload: Dict[str, Any] = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 800,
            }
        }

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        req_data = json.dumps(payload).encode("utf-8")

        for model_name in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={self.gemini_api_key}"
            try:
                req = urllib.request.Request(
                    url,
                    data=req_data,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=12) as response:
                    if response.status == 200:
                        data = json.loads(response.read().decode("utf-8"))
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                text = parts[0].get("text", "").strip()
                                if text:
                                    logger.info(f"Gemini {model_name} returned successfully")
                                    return text
            except Exception as e:
                logger.warning(f"Gemini model {model_name} failed: {e}")
                continue

        return None


    def _call_groq(self, messages: List[Dict[str, str]]) -> Optional[str]:
        """Call Groq Cloud API using free API key."""
        if not self.groq_api_key:
            return None

        url = "https://api.groq.com/openai/v1/chat/completions"
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 800
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={
                    "Authorization": f"Bearer {self.groq_api_key}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            logger.warning(f"Groq API request failed: {e}")

        return None


    def generate_text(self, prompt: str, system_instruction: str = "") -> str:
        """Try Gemini first, then Groq, then fallback."""
        # 1. Try Gemini
        res = self._call_gemini(prompt, system_instruction)
        if res:
            return res

        # 2. Try Groq
        groq_messages = []
        if system_instruction:
            groq_messages.append({"role": "system", "content": system_instruction})
        groq_messages.append({"role": "user", "content": prompt})

        res = self._call_groq(groq_messages)
        if res:
            return res

        return ""

    # -------------------------------------------------------------
    # Feature 1: Hope AI - 24/7 Recovery Companion Chatbot
    # -------------------------------------------------------------
    def chat_companion(self, messages: List[Dict[str, str]], user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Handles interactive conversational companion chat.
        - Returns ready answers for the specific displayed quick action prompts.
        - Generates custom, tailored, intelligent AI answers for any custom user question.
        - Includes 0ms crisis screening and safety guardrails.
        """
        latest_message = messages[-1]["content"].strip() if messages else ""

        # 1. Check for emergency crisis
        if self.check_crisis(latest_message):
            return {
                "is_crisis": True,
                "reply": CRISIS_MESSAGE
            }

        # 2. Check for exact match with displayed quick prompts (ready answers)
        if latest_message in READY_PROMPTS_MAP:
            return {
                "is_crisis": False,
                "reply": READY_PROMPTS_MAP[latest_message]
            }

        # 3. For any custom user question: generate a dynamic, tailored response directly answering their specific query
        context_hint = ""
        if user_context and user_context.get("addiction"):
            context_hint = f" The user is working on recovery/management for: {user_context.get('addiction')}."

        system_instruction = (
            "You are Hope, an empathetic, highly knowledgeable, and non-judgmental AI recovery companion on the 'Recovery Path' platform.\n"
            f"{context_hint}\n"
            "CRITICAL RESPONSE INSTRUCTIONS:\n"
            "1. DIRECTLY AND SPECIFICALLY ANSWER THE USER'S EXACT QUESTION, situation, or topic. Address whatever specific topic, question, concern, or scenario they ask about (e.g. food replacements, sleep tips, neuroscience, communication, boundaries, habit loops).\n"
            "2. DO NOT give generic or repetitive filler speeches unless specifically asked. Provide concrete, actionable, and tailored insights.\n"
            "3. If the user is expressing an acute urge or craving, offer relevant grounding techniques (like 4-7-8 breathing or urge surfing).\n"
            "4. Maintain a warm, encouraging, and respectful tone without being patronizing or repetitive.\n"
            "5. Never prescribe medications or diagnose medical/psychiatric conditions. Remain an empowering peer recovery companion.\n"
            "6. Format with clean Markdown, using concise bullet points or bold highlights when helpful."
        )

        # Build prompt from recent conversation
        recent_turns = messages[-6:]  # Keep last 6 messages for context
        conversation_text = ""
        for m in recent_turns:
            speaker = "User" if m.get("role") == "user" else "Hope"
            conversation_text += f"{speaker}: {m.get('content', '')}\n"
        conversation_text += "Hope:"

        reply = self.generate_text(conversation_text, system_instruction)

        if not reply:
            reply = (
                f"I hear your question regarding '{latest_message[:60]}...'. Every habit pattern has specific triggers and solutions. "
                "To tackle this directly: start by noticing the cue that precedes it, introduce one physical friction point or healthy substitute, "
                "and give yourself 10 minutes for the initial impulse to calm. What specific aspect of this would you like to explore deeper together?"
            )

        return {
            "is_crisis": False,
            "reply": reply
        }

    # -------------------------------------------------------------
    # Feature 2: Personalized AI Assessment Insights
    # -------------------------------------------------------------
    def get_assessment_advice(self, addiction_name: str, total_score: int, severity_level: str, answers_summary: str) -> Dict[str, Any]:
        """
        Generates clean, personalized recovery insights for a completed questionnaire.
        """
        system_instruction = (
            "You are an empathetic addiction recovery specialist providing supportive post-assessment advice. "
            "Write in a warm, stigma-free, and practical tone. Avoid clinical jargon."
        )

        prompt = f"""
The user completed a 10-question self-assessment for '{addiction_name}'.
- Total Score: {total_score} (Severity Tier: {severity_level.title()})
- Summary of Responses: {answers_summary}

Please provide a concise, structured guidance report with exactly 3 sections:
1. **Understanding Your Score**: 2 gentle sentences explaining what this score indicates without any shame or judgment.
2. **Top 3 Action Steps**: 3 realistic, high-impact micro-steps they can take this week.
3. **Coping & Recovery Tip**: 1 specific psychological tool (e.g. Urge Surfing, Habit Replacement, or Support Network) tailored to '{addiction_name}'.

Keep your total response under 250 words, formatted in clean Markdown.
"""
        advice = self.generate_text(prompt, system_instruction)

        if not advice:
            advice = (
                f"### Understanding Your Score\n"
                f"Your assessment score for **{addiction_name}** indicates a **{severity_level.title()}** pattern. "
                f"Recognizing where you are today is a courageous and essential first step toward positive change.\n\n"
                f"### Top 3 Action Steps\n"
                f"1. **Identify Your Peak Triggers:** Note the times of day, emotions, or environments where urges feel highest.\n"
                f"2. **Set a Manageable Daily Target:** Focus on achieving small, winnable reductions rather than overwhelming overnight changes.\n"
                f"3. **Build a Support Shield:** Share your intention with a trusted friend or explore peer support groups.\n\n"
                f"### Coping Tip: The 15-Minute Urge Surf\n"
                f"When a craving hits, set a 15-minute timer. Drink a glass of cold water, step outside, or change rooms. "
                f"Neurochemical cravings naturally subside as the clock runs down."
            )

        return {
            "advice": advice,
            "addiction": addiction_name,
            "severity": severity_level
        }

    # -------------------------------------------------------------
    # Feature 3: AI Daily Coping Tip & Reflection (Tracking)
    # -------------------------------------------------------------
    def get_entry_coping_tip(self, entry_type: str, severity: int, notes: str, addiction_name: str) -> Dict[str, Any]:
        """
        Generates a 2-sentence encouraging reflection and 1 actionable coping tip for a daily tracking log.
        """
        combined_text = f"{entry_type} severity {severity} {notes}"
        if self.check_crisis(combined_text):
            return {
                "is_crisis": True,
                "tip": CRISIS_MESSAGE
            }

        system_instruction = (
            "You are a supportive recovery coach. Give a brief, warm, 2-sentence empathetic reflection "
            "followed by 1 concrete 2-minute calming or distraction action."
        )

        prompt = f"""
User just logged a recovery entry for {addiction_name or 'their recovery journey'}:
- Entry Type: {entry_type.title()}
- Severity/Urge Level: {severity} out of 5
- User Notes: "{notes or 'No additional notes provided'}"

Provide:
1. **Reflection**: 1-2 sentences validating their effort and normalizing their experience.
2. **Quick Coping Action**: 1 specific 2-minute actionable physical/mental tip to stay grounded right now.

Keep it very brief (under 90 words).
"""
        tip = self.generate_text(prompt, system_instruction)

        if not tip:
            if entry_type in ["relapse", "trigger"]:
                tip = (
                    "**Reflection:** Tracking an urge or slip takes real self-awareness and honesty. Every moment is a fresh chance to reset.\n\n"
                    "**Quick Coping Action:** Splash cold water on your face or take 5 slow breaths (inhale for 4 seconds, exhale for 6). This activates your body's natural calming reflex."
                )
            else:
                tip = (
                    "**Reflection:** Celebrating your progress and milestones reinforces healthy neural pathways. Great job prioritizing your well-being!\n\n"
                    "**Quick Action:** Take 60 seconds to write down one positive thing you did today that made you proud."
                )

        return {
            "is_crisis": False,
            "tip": tip
        }

    # -------------------------------------------------------------
    # Feature 4: SOS Craving De-escalator & Sensory Grounding
    # -------------------------------------------------------------
    def get_sos_grounding(self, addiction_name: str = "", urge_level: int = 5) -> Dict[str, Any]:
        """
        Generates immediate physiological grounding steps and urge-surfing guidance for acute cravings.
        """
        system_instruction = (
            "You are an emergency craving de-escalation coach on Recovery Path. "
            "Your tone is steady, calming, and deeply reassuring. Speak in short, grounding sentences."
        )

        prompt = f"""
The user is experiencing an acute craving emergency for '{addiction_name or 'their addiction'}' with urge intensity {urge_level}/5.
Generate a concise, 3-step immediate de-escalation protocol:
1. **Urge Surfing Fact**: 1 sentence reminding them that neurochemical cravings peak and naturally fade in 15 minutes.
2. **5-4-3-2-1 Sensory Grounding Action**: Specific sensory instructions tailored to their immediate environment.
3. **2-Minute Physical Reset**: 1 simple physical action (e.g. ice water splash, stretching, stepping outside).

Keep response under 160 words in clean Markdown.
"""
        grounding = self.generate_text(prompt, system_instruction)

        if not grounding:
            grounding = (
                "### 🌊 Ride the Wave (Urge Surfing)\n"
                "Remember: This craving is a temporary neurochemical wave. It peaks within 10–15 minutes and will naturally fade if you don't act on it.\n\n"
                "### 👁️ 5-4-3-2-1 Sensory Reset\n"
                "Look around your room right now:\n"
                "- Name **5** things you can see.\n"
                "- Touch **4** different textures around you.\n"
                "- Listen for **3** distinct sounds in the room.\n"
                "- Notice **2** physical sensations in your body.\n"
                "- Take **1** slow, full breath and say: *'I am in control of this moment.'*\n\n"
                "### 🧊 Physical Reset\n"
                "Splash cold water on your face or hold an ice cube for 30 seconds. This activates your mammalian dive reflex and slows down your heart rate."
            )

        return {
            "grounding": grounding,
            "addiction": addiction_name,
            "urge_level": urge_level
        }

    # -------------------------------------------------------------
    # Feature 5: Refusal Practice Simulator (Saying "No")
    # -------------------------------------------------------------
    def get_refusal_script(self, addiction_name: str, scenario: str = "social party") -> Dict[str, Any]:
        """
        Generates 3 confident, low-awkwardness refusal scripts for social peer pressure situations.
        """
        system_instruction = (
            "You are a social confidence and recovery coach. Provide realistic, comfortable phrases "
            "to decline offers of substances or addictive habits without feeling awkward."
        )

        prompt = f"""
Create 3 realistic, confident refusal scripts for someone declining '{addiction_name}' in this scenario: '{scenario}'.
Provide:
1. **The Casual/Lightweight Decline**: (Simple, friendly, no explanation needed)
2. **The Health/Fitness Angle**: (Easy to say, leaves no room for debate)
3. **The Clear & Firm Boundary**: (For persistent people who don't take no for an answer)

Keep total response under 150 words in clean Markdown.
"""
        scripts = self.generate_text(prompt, system_instruction)

        if not scripts:
            scripts = (
                "### 1. Casual & Friendly (Zero Drama)\n"
                "*\"I'm good for now with water/soda, thanks though!\"*\n\n"
                "### 2. The Health/Fitness Pivot\n"
                "*\"I'm taking a 30-day health reset for my sleep and energy—feeling way better so sticking to it!\"*\n\n"
                "### 3. Clear & Firm Boundary\n"
                "*\"I've actually decided to stop completely. I appreciate you respecting that!\"*"
            )

        return {
            "scripts": scripts,
            "addiction": addiction_name,
            "scenario": scenario
        }

    # -------------------------------------------------------------
    # Feature 6: SMART Goal Coach & Micro-Habit Decomposer
    # -------------------------------------------------------------
    def decompose_goal(self, goal_title: str, goal_type: str, addiction_name: str) -> Dict[str, Any]:
        """
        Breaks down a broad recovery goal into 3 daily winnable micro-habits.
        """
        system_instruction = (
            "You are a behavioral change expert specializing in addiction recovery. "
            "Break down ambitious recovery goals into small, low-friction micro-habits that are impossible to fail."
        )

        prompt = f"""
The user wants to achieve this recovery goal for '{addiction_name}':
- Goal: "{goal_title}"
- Goal Category: {goal_type}

Break this goal down into:
1. **3 Daily Micro-Habits**: Ultra-specific replacement actions (e.g. time of day, environment swap).
2. **1 Immediate First Step**: Something they can do in the next 10 minutes.
3. **Suggested Target Timeframe**: Realistic timeline (e.g. 7-14 days).

Keep it concise and structured (under 180 words) in clean Markdown.
"""
        breakdown = self.generate_text(prompt, system_instruction)

        if not breakdown:
            breakdown = (
                f"### 🎯 3 Actionable Micro-Habits for '{addiction_name}'\n"
                f"1. **Trigger Replacement:** Replace your peak craving time (e.g. evening) with a positive sensory alternative (sparkling water, herbal tea, or chewing gum).\n"
                f"2. **Environment Shift:** Remove visual cues or apps associated with {addiction_name} from your immediate space.\n"
                f"3. **Daily 60-Second Check-in:** Log your day in Recovery Path every night at 9 PM to build momentum.\n\n"
                f"### ⚡ Immediate 10-Minute Step\n"
                f"Write down the #1 situation where this urge strikes and decide on your replacement action right now."
            )

        return {
            "breakdown": breakdown,
            "goal_title": goal_title
        }

    # -------------------------------------------------------------
    # Feature 7: Milestone Shield (Letter to Future Self)
    # -------------------------------------------------------------
    def generate_milestone_shield(self, milestone_title: str, days_clean: int, addiction_name: str) -> Dict[str, Any]:
        """
        Generates a heartfelt, empowering letter commemorating a milestone to read during future cravings.
        """
        system_instruction = (
            "You are a compassionate recovery coach writing a powerful 'Milestone Shield Letter' to celebrate a user's victory. "
            "Write with warmth, dignity, and deep encouragement."
        )

        prompt = f"""
Write a 150-word 'Milestone Shield Letter' celebrating this achievement:
- Milestone: {milestone_title}
- Clean Time / Streak: {days_clean} days
- Topic: {addiction_name}

Make the letter a permanent reminder of their strength, the clarity they have gained, and a shield to protect them when future temptations arise.
"""
        letter = self.generate_text(prompt, system_instruction)

        if not letter:
            letter = (
                f"Dear Future Me,\n\n"
                f"Look at how far we have come. Achieving **{milestone_title}** in our journey with {addiction_name} took genuine bravery, patience, and resilience. "
                f"There were days when cravings felt heavy, but we chose our future over temporary relief every single time.\n\n"
                f"If you are reading this during a tough moment or temptation, remember why we started. The clarity, self-respect, and freedom we've built are worth fighting for. "
                f"Take a deep breath. You survived 100% of your hardest days before, and you have all the strength you need right now."
            )

        return {
            "letter": letter,
            "milestone_title": milestone_title
        }

    # -------------------------------------------------------------
    # Feature 8: Trigger Pattern Detective (Weekly Digest)
    # -------------------------------------------------------------
    def analyze_trigger_patterns(self, entries_summary: str, addiction_name: str) -> Dict[str, Any]:
        """
        Analyzes logged entries and returns 3 key patterns with custom weekend shield tips.
        """
        system_instruction = (
            "You are an analytical and compassionate recovery data specialist. "
            "Identify behavioral patterns without judgment and suggest proactive shields."
        )

        prompt = f"""
Analyze these recent recovery tracking entries for '{addiction_name}':
{entries_summary}

Provide:
1. **Observed Pattern**: Common times, days, or emotional states triggering urges.
2. **What's Working**: Positive actions or lower severity moments observed.
3. **Proactive Weekend Shield**: 2 specific strategies to protect against upcoming peak trigger moments.

Keep it concise (under 180 words) in clean Markdown.
"""
        analysis = self.generate_text(prompt, system_instruction)

        if not analysis:
            analysis = (
                "### 🔍 Observed Patterns\n"
                "• Urges appear more frequent during late afternoons and high-stress transitions after work.\n"
                "• Logging your entries promptly correlated with faster emotional reset.\n\n"
                "### 🛡️ Proactive Weekend Shield\n"
                "1. **Pre-plan Your Transitions:** Schedule a physical walk or call a friend at 5:30 PM before evening downtime.\n"
                "2. **Stock Healthy Substitutes:** Have sparkling water, snacks, or hobby materials ready at home."
            )

        return {
            "analysis": analysis,
            "addiction": addiction_name
        }

    # -------------------------------------------------------------
    # Feature 9: Evening Wind-Down & Sleep Grounding
    # -------------------------------------------------------------
    def get_evening_wind_down(self, addiction_name: str = "") -> Dict[str, Any]:
        """
        Generates a 2-minute Progressive Muscle Relaxation & sleep calming script.
        """
        system_instruction = (
            "You are a calming mindfulness and sleep coach. Provide a relaxing, soothing 2-minute guided wind-down script."
        )

        prompt = f"""
Create a 2-minute bedtime somatic grounding script for someone winding down who is recovering from '{addiction_name or 'stress & habits'}'.
Include:
1. **Gentle Shoulder & Body Release** (step-by-step physical relaxation).
2. **Thought Dismissal Technique** (putting racing thoughts on an imaginary cloud).
3. **Bedtime Affirmation**: 1 sentence to close the day in peace.

Keep tone soothing, slow, and formatted in clean Markdown (under 150 words).
"""
        script = self.generate_text(prompt, system_instruction)

        if not script:
            script = (
                "### 🌙 2-Minute Evening Somatic Reset\n"
                "1. **Drop Your Shoulders:** Unclench your jaw, soften your forehead, and let your shoulders drop away from your ears. Take a deep, slow exhale.\n"
                "2. **Release Muscle Tension:** Squeeze your hands into gentle fists for 3 seconds, then release them completely onto the bed. Feel the heaviness in your arms.\n"
                "3. **The Leaf on the Stream:** If thoughts about cravings or tomorrow's stress arise, imagine placing each thought onto a leaf and watching it float down a quiet stream.\n\n"
                "*\"You fought hard today. You are safe, you are healing, and tonight you rest.\"*"
            )

        return {
            "script": script
        }

    # -------------------------------------------------------------
    # Feature 10: Community Story Key Lessons & Trigger Tagging
    # -------------------------------------------------------------
    def summarize_story_lessons(self, story_content: str, addiction_name: str = "") -> Dict[str, Any]:
        """
        Extracts 3 key actionable recovery takeaways and safe trigger tags from a community story.
        """
        system_instruction = (
            "You are a recovery story curator. Extract practical recovery wisdom and helpful tags from personal stories."
        )

        prompt = f"""
Analyze this recovery story for '{addiction_name}':
"{story_content[:1500]}"

Provide:
1. **Trigger Warning Tags**: 1-3 short tags like #RelapseLessons, #SocialPressure, #EarlySobriety.
2. **3 Key Strategies That Worked**: Bullet points of concrete actions the author used to succeed.

Keep total output under 120 words in clean Markdown.
"""
        summary = self.generate_text(prompt, system_instruction)

        if not summary:
            summary = (
                "**Tags:** `#RecoveryLessons` `#Resilience` `#OneDayAtATime`\n\n"
                "### Key Strategies That Worked:\n"
                "• Taking cravings one hour at a time rather than worrying about forever.\n"
                "• Reaching out to a trusted friend whenever an urge hit.\n"
                "• Replacing old habits with regular exercise and mindfulness."
            )

        return {
            "summary": summary
        }

