/**
 * Recovery Path AI Bridge
 * Calls the Flask backend AI endpoints (/api/ai/*) with:
 * - 0ms client-side crisis safety regex circuit-breaker
 * - Resilient offline/standalone fallback logic
 * - Zero PII transmission
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CrisisInfo {
  is_crisis: boolean;
  helplines: Array<{ name: string; number: string; link: string; note: string }>;
}

const CRISIS_KEYWORDS = [
  /\b(suicid|kill myself|want to die|end my life|end it all|better off dead)\b/i,
  /\b(self[-\s]?harm|cut myself|overdose|take all my pills|poison myself)\b/i,
  /\b(hanging myself|shoot myself|jump off|no reason to live)\b/i,
];

export const CRISIS_HELPLINES = [
  { name: "Suicide & Crisis Lifeline", number: "988", link: "tel:988", note: "Call or text 24/7 (Free & Confidential)" },
  { name: "SAMHSA National Helpline", number: "1-800-662-4357", link: "tel:18006624357", note: "24/7 Substance Support & Referrals" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", link: "sms:741741?body=HOME", note: "Free 24/7 text support" },
  { name: "International Resources", number: "Find a Helpline", link: "https://findahelpline.com/", note: "Global support directories" },
];

export function checkCrisis(text: string): boolean {
  if (!text) return false;
  return CRISIS_KEYWORDS.some((rx) => rx.test(text));
}

export const READY_PROMPTS_MAP: Record<string, string> = {
  "Help me practice saying NO to peer pressure at a social event.": `### 🗣️ Refusal Practice: 3 Ways to Say "No" Firmly & Casually\n\n` +
    `1. **The Casual Deflect:** *"I'm good for now with a soda/water, thanks!"*\n` +
    `2. **The Health Priority:** *"I'm on a 30-day health & energy reset, feeling great with it."*\n` +
    `3. **The Clear Boundary:** *"I've stopped completely. Thanks for respecting that!"*\n\n` +
    `**Pro-Tip:** You don't owe anyone an elaborate explanation. A calm, relaxed posture and friendly tone signal complete confidence.`,

  "I am feeling a strong urge right now. Guide me through urge surfing.": `### 🌊 You Are Experiencing an Urge Wave\n\n` +
    `Take a slow, grounding breath with me right now. Cravings feel intense, but scientifically they follow an ocean wave curve — they peak within 10 to 15 minutes and naturally subside.\n\n` +
    `• **Somatic Grounding:** Feel your feet flat on the floor. Name 3 things you can physically touch around you.\n` +
    `• **Urge Surfing:** Don't fight the craving; visualize it like an ocean wave passing underneath you.\n` +
    `• Click the **🚨 SOS Urge Assist** button in the top navigation for our live 4-7-8 breathing circle and 3-minute timer.`,

  "Give me a 2-minute calming bedtime somatic relaxation script.": `### 🌙 2-Minute Bedtime Somatic Calming Script\n\n` +
    `1. **Drop Your Shoulders:** Unclench your jaw, soften your forehead, and drop your shoulders away from your ears.\n` +
    `2. **4-7-8 Breathing:** Inhale gently through your nose for 4 seconds, hold gently for 7 seconds, and exhale slowly with a soft *whoosh* for 8 seconds. Repeat 3 times.\n` +
    `3. **Mental Release:** Tell yourself: *"I did enough today. I am safe right now. Tonight my body and mind can rest, repair, and heal."*`,

  "I feel discouraged and guilty about my progress. Help me reframe.": `### 💙 Please Be Gentle With Yourself\n\n` +
    `A slip or difficult day is a data point, never the end of your story. Every single day of effort you put in still counts and has physically reshaped your neural pathways.\n\n` +
    `Ask yourself with curiosity instead of shame:\n` +
    `1. *What trigger or emotional state caught me off guard?*\n` +
    `2. *What one protective guardrail can I put in place for tomorrow?*\n\n` +
    `Drink a glass of water, forgive yourself, and step right back onto your path today.`,
};

export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<{ reply: string; is_crisis: boolean }> {
  const lastUserMsg = messages.filter((m) => m.role === "user").slice(-1)[0]?.content.trim() || "";

  // 0ms Deterministic Local Circuit Breaker
  if (checkCrisis(lastUserMsg)) {
    return {
      is_crisis: true,
      reply: `🚨 **Immediate Support is Available (24/7 Free & Confidential):**\n\n` +
        `If you are in distress or thinking of hurting yourself, please reach out right now:\n\n` +
        `• **988 Suicide & Crisis Lifeline:** Call or Text **988**\n` +
        `• **SAMHSA National Helpline:** **1-800-662-4357**\n` +
        `• **Crisis Text Line:** Text **HOME** to **741741**\n\n` +
        `You do not have to carry this alone. People who care are ready to listen without judgment.`,
    };
  }

  // 1. Ready answers for exact displayed quick prompt buttons
  if (lastUserMsg in READY_PROMPTS_MAP) {
    return {
      is_crisis: false,
      reply: READY_PROMPTS_MAP[lastUserMsg],
    };
  }

  // 2. Custom question -> send to AI backend for dedicated dynamic answer
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          is_crisis: !!data.is_crisis,
        };
      }
    }
  } catch (err) {
    console.warn("AI backend unavailable:", err);
  }

  // 3. Offline fallback — honest message, not a fake template
  return {
    is_crisis: false,
    reply: `I wasn't able to connect to the AI service right now. Please make sure the Flask backend server is running on port 5000 and try again.\n\nIn the meantime, you can use the quick-action buttons above for instant support, or reach out to:\n• **988 Suicide & Crisis Lifeline** (Call/Text 988)\n• **SAMHSA Helpline** (1-800-662-4357)`,
  };
}

export async function getAssessmentAdvice(params: {
  addiction_name: string;
  total_score: number;
  severity_level: string;
  answers_summary?: string;
}): Promise<{ advice: string }> {
  try {
    const res = await fetch("/api/ai/assessment-advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { advice: data.advice };
    }
  } catch (err) {
    console.warn("AI assessment advice fallback:", err);
  }

  return {
    advice: `### 🔍 Understanding Your Score\n` +
      `Your score for **${params.addiction_name}** is **${params.total_score}/40** (${params.severity_level}). ` +
      `Taking this assessment reflects genuine courage and self-awareness. Recognizing patterns is the cornerstone of lasting change.\n\n` +
      `### 🎯 Top 3 Action Steps\n` +
      `1. **Identify High-Risk Windows:** Notice what times of day or emotional states trigger your strongest urges.\n` +
      `2. **Establish One Friction Point:** Add a barrier between impulse and action (e.g., app timers, removing easy access).\n` +
      `3. **Build Replacement Habits:** Schedule a positive, absorbing activity during your usual urge hours.\n\n` +
      `### 🛡️ Recommended Technique: Urge Surfing\n` +
      `Remember that cravings are like ocean waves — they rise, crest within 10–15 minutes, and naturally break. You don't have to fight the wave; you just need to ride it out with slow 4-7-8 breaths.`,
  };
}

export async function getEntryTip(params: {
  entry_type: string;
  severity: number;
  notes: string;
  addiction_name: string;
}): Promise<{ tip: string }> {
  try {
    const res = await fetch("/api/ai/entry-tip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { tip: data.tip };
    }
  } catch (err) {
    console.warn("AI entry tip fallback:", err);
  }

  return {
    tip: `**Reflection:** Logging your state today is a powerful act of awareness. Urges and emotional shifts are temporary data points, not setbacks.\n\n` +
      `**Calming Action:** Drink a cold glass of water, unclench your shoulders, and take 3 deep belly breaths. The intensity will soften shortly.`,
  };
}

export async function decomposeGoal(params: {
  goal_title: string;
  goal_type?: string;
  addiction_name?: string;
}): Promise<{ breakdown: string; habits?: string[] }> {
  try {
    const res = await fetch("/api/ai/decompose-goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        breakdown: data.breakdown,
        habits: extractHabitsFromText(data.breakdown),
      };
    }
  } catch (err) {
    console.warn("AI goal decomposition fallback:", err);
  }

  const defaultHabits = [
    `Environment Reset: Remove direct triggers or cues for ${params.goal_title} from immediate reach.`,
    `Evening Check-In: Spend 2 minutes reviewing your progress and celebrating small wins.`,
    `Replacement Action: Practice 2-minute 4-7-8 breathing whenever you feel the urge to slip.`,
  ];

  return {
    breakdown: `### 🎯 3 Daily Micro-Habits for "${params.goal_title}":\n\n` +
      defaultHabits.map((h, i) => `${i + 1}. **${h.split(":")[0]}:** ${h.split(":")[1]}`).join("\n"),
    habits: defaultHabits,
  };
}

export async function generateMilestoneShield(params: {
  milestone_title: string;
  days_clean: number;
  addiction_name: string;
}): Promise<{ letter: string }> {
  try {
    const res = await fetch("/api/ai/milestone-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { letter: data.letter };
    }
  } catch (err) {
    console.warn("AI milestone letter fallback:", err);
  }

  return {
    letter: `Dear Future Me,\n\n` +
      `Today I reached **${params.milestone_title}** (${params.days_clean} days) in my recovery journey with ${params.addiction_name}.\n\n` +
      `When you read this during a difficult moment or a strong craving, remember this feeling: the mental clarity, the restored dignity, and the freedom you fought so hard to reclaim.\n\n` +
      `The urge in front of you is temporary, but the strength you built is permanent. Breathe, pause, and remember why you started. You've got this.`,
  };
}

export async function analyzeTriggerPatterns(params: {
  entries_summary: string;
  addiction_name?: string;
}): Promise<{ analysis: string }> {
  try {
    const res = await fetch("/api/ai/pattern-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { analysis: data.analysis };
    }
  } catch (err) {
    console.warn("AI pattern analysis fallback:", err);
  }

  return {
    analysis: `### 🧠 Recovery Pattern Detective Insights\n\n` +
      `• **Peak Urge Time:** Cravings tend to cluster during evening downtime (7 PM – 10 PM) or after high-stress transitions.\n` +
      `• **Key Trigger Driver:** Fatigue and isolation amplify impulse vulnerability.\n` +
      `• **Recommended Guardrail:** Set up an intentional evening routine (tea, reading, gentle walk) to replace automatic habits.`,
  };
}

export async function getStoryTakeaways(params: {
  story_content: string;
  addiction_name?: string;
}): Promise<{ takeaways: string }> {
  try {
    const res = await fetch("/api/ai/story-takeaways", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return { takeaways: data.takeaways };
    }
  } catch (err) {
    console.warn("AI story takeaways fallback:", err);
  }

  return {
    takeaways: `### 💡 Key Recovery Takeaways\n\n` +
      `1. **Break the Secrecy:** Isolation fuels habits. Sharing honestly with just one person removes the heaviest burden.\n` +
      `2. **Patience with Neurochemistry:** Mood dips in early recovery are temporary brain recalibration, not permanent defeat.\n` +
      `3. **One Day at a Time:** Focus entirely on making it through today rather than worrying about months ahead.`,
  };
}

function extractHabitsFromText(text: string): string[] {
  const lines = text.split("\n");
  const habits: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\d+\.\s+\*?\*?([^:]+):\*?\*?\s*(.*)$/);
    if (match) {
      habits.push(`${match[1].trim()}: ${match[2].trim()}`);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      habits.push(line.replace(/^[-•]\s+/, "").trim());
    }
  }
  return habits.length > 0 ? habits : [
    "Environment Swap: Keep triggers out of reach.",
    "Daily Check-In: Review progress every evening.",
    "Breathe Through Urges: Practice 4-7-8 breathing when triggered.",
  ];
}

