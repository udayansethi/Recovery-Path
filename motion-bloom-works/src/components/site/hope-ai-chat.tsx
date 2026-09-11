import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Sparkles, X, Send, Bot, User, PhoneCall, RotateCcw, AlertTriangle, ShieldCheck, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spring, snappySpring } from "@/lib/motion";
import { sendChatMessage, CRISIS_HELPLINES, type ChatMessage } from "@/lib/ai-service";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello! I'm **Hope**, your 24/7 non-judgmental recovery companion. Whether you're navigating a strong urge, practicing boundaries, celebrating a milestone, or just need to reflect, I'm here. How can I support you right now?",
  },
];

const QUICK_PROMPTS = [
  { label: "\u{1F5E3}\u{FE0F} Practice Saying NO", prompt: "Help me practice saying NO to peer pressure at a social event." },
  { label: "\u{1F30A} Having an Urge", prompt: "I am feeling a strong urge right now. Guide me through urge surfing." },
  { label: "\u{1F319} Bedtime Calming", prompt: "Give me a 2-minute calming bedtime somatic relaxation script." },
  { label: "\u{1F499} Feeling Discouraged", prompt: "I feel discouraged and guilty about my progress. Help me reframe." },
];

const FAQ_CATEGORIES = [
  {
    category: "Coping & Urges",
    icon: "\u{1F525}",
    items: [
      { label: "Urge Surfing Guide", prompt: "I am feeling a strong urge right now. Guide me through urge surfing." },
      { label: "5-4-3-2-1 Grounding", prompt: "Walk me through the 5-4-3-2-1 sensory grounding technique to calm my anxiety right now." },
      { label: "Craving Distraction Ideas", prompt: "Give me 5 quick distraction activities I can do right now to ride out a craving." },
      { label: "Dealing with Triggers", prompt: "How do I identify and manage my personal triggers to prevent relapse?" },
    ],
  },
  {
    category: "Emotional Support",
    icon: "\u{1F49C}",
    items: [
      { label: "Feeling Discouraged", prompt: "I feel discouraged and guilty about my progress. Help me reframe." },
      { label: "Loneliness & Isolation", prompt: "I feel lonely and isolated in my recovery. How can I build meaningful connections?" },
      { label: "Managing Shame", prompt: "I feel deep shame about my past. Help me practice self-compassion and move forward." },
      { label: "After a Relapse", prompt: "I relapsed and feel terrible. Help me get back on track without spiraling into guilt." },
    ],
  },
  {
    category: "Skills & Practice",
    icon: "\u{1F3AF}",
    items: [
      { label: "Practice Saying NO", prompt: "Help me practice saying NO to peer pressure at a social event." },
      { label: "Building Healthy Routines", prompt: "Help me design a simple daily routine that supports my recovery and mental health." },
      { label: "Managing Withdrawal", prompt: "What are healthy ways to manage withdrawal symptoms and physical discomfort?" },
      { label: "Healthy Stress Relief", prompt: "Suggest 5 healthy stress-relief techniques I can use instead of my addiction." },
    ],
  },
  {
    category: "Mindfulness & Rest",
    icon: "\u{1F9D8}",
    items: [
      { label: "Bedtime Calming Script", prompt: "Give me a 2-minute calming bedtime somatic relaxation script." },
      { label: "Morning Motivation", prompt: "Give me a short morning affirmation and intention-setting exercise to start my day strong in recovery." },
      { label: "Breathing Exercise", prompt: "Guide me through a 4-7-8 breathing exercise to calm my nervous system right now." },
      { label: "Body Scan Meditation", prompt: "Guide me through a 3-minute body scan meditation to release tension and be present." },
    ],
  },
];

export function HopeAIChat() {
  const reduce = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, loading]);

  // Keyboard shortcut: ESC to close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setShowFAQ(false);
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await sendChatMessage(newMessages);
      if (response.is_crisis) {
        setShowCrisisBanner(true);
      }
      setMessages([...newMessages, { role: "assistant", content: response.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I am right here with you. Take a slow, steady breath. You are taking brave steps one day at a time.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages(INITIAL_MESSAGES);
    setShowCrisisBanner(false);
    setShowFAQ(false);
    setInput("");
  }

  return (
    <>
      {/* Floating Launcher / Close Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          {...(reduce ? {} : { whileHover: { scale: 1.05, y: -2 }, whileTap: { scale: 0.95 } })}
          transition={snappySpring}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close Hope AI Chat" : "Open Hope AI Recovery Companion"}
          className={cn(
            "group flex items-center gap-2.5 rounded-full px-5 py-3.5 shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-md border",
            isOpen
              ? "bg-secondary text-foreground border-border hover:bg-destructive/15 hover:text-destructive hover:border-destructive/40"
              : "bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground font-medium border-primary-foreground/20 hover:shadow-primary/25",
          )}
        >
          {isOpen ? (
            <>
              <X className="size-4 stroke-[2.5] text-destructive transition-transform group-hover:rotate-90 duration-300" />
              <span className="text-sm font-semibold tracking-wide">Close Chat</span>
            </>
          ) : (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary-foreground" />
              </span>
              <Sparkles className="size-4 text-primary-foreground group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-semibold tracking-wide">Talk with Hope</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={spring}
            className="fixed bottom-24 right-4 z-50 w-[min(430px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-primary/25 bg-background/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
                  <Bot className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight">Hope AI</span>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-primary border border-primary/25">
                      Companion
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Always ready, non-judgmental & confidential</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="flex items-center justify-center size-8 rounded-full border border-border/70 bg-background/80 text-muted-foreground hover:bg-destructive/15 hover:text-destructive hover:border-destructive/40 transition-all cursor-pointer shadow-xs"
                >
                  <X className="size-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Medical / Educational Disclaimer */}
            <div className="flex items-center gap-2 bg-secondary/70 px-4 py-2 text-[11px] text-muted-foreground border-b border-border/40">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>Educational peer support companion. In an emergency, call <strong>988</strong>.</span>
            </div>

            {/* Crisis Interceptor Banner */}
            {showCrisisBanner && (
              <div className="bg-destructive/15 border-b border-destructive/30 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
                  <AlertTriangle className="size-4" />
                  <span>Immediate Crisis Support Available 24/7</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  You are not alone. Free, confidential, compassionate help is here:
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <a
                    href="tel:988"
                    className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground hover:opacity-90 transition-opacity"
                  >
                    <PhoneCall className="size-3" /> Call / Text 988
                  </a>
                  <a
                    href="tel:18006624357"
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
                  >
                    1-800-662-4357 (SAMHSA)
                  </a>
                  <a
                    href="sms:741741?body=HOME"
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Text HOME to 741741
                  </a>
                </div>
              </div>
            )}

            {/* FAQ Panel (overlays message area) */}
            <AnimatePresence>
              {showFAQ && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={spring}
                  className="h-[340px] overflow-y-auto bg-background/98 backdrop-blur-xl"
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-4 py-3 border-b border-border/40 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="size-4 text-primary" />
                      <span className="text-xs font-bold tracking-tight">Frequently Asked Questions</span>
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                        {FAQ_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0)}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowFAQ(false)}
                      title="Close FAQ panel"
                      aria-label="Close FAQ panel"
                      className="flex items-center justify-center size-6 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="size-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="p-3 space-y-2">
                    {FAQ_CATEGORIES.map((cat, ci) => (
                      <motion.div
                        key={cat.category}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...snappySpring, delay: ci * 0.06 }}
                        className="rounded-2xl border border-border/50 bg-secondary/30 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                          className="flex w-full items-center justify-between px-3.5 py-2.5 text-left cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">{cat.icon}</span>
                            <span className="text-[12px] font-semibold text-foreground">{cat.category}</span>
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground font-medium">
                              {cat.items.length}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedCategory === cat.category ? 180 : 0 }}
                            transition={snappySpring}
                          >
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedCategory === cat.category && (
                            <motion.div
                              initial={reduce ? false : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={spring}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 space-y-1.5">
                                {cat.items.map((item, ii) => (
                                  <motion.button
                                    key={ii}
                                    type="button"
                                    onClick={() => handleSend(item.prompt)}
                                    disabled={loading}
                                    initial={reduce ? false : { opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ ...snappySpring, delay: ii * 0.04 }}
                                    className={cn(
                                      "w-full text-left rounded-xl px-3 py-2.5",
                                      "bg-background/80 border border-border/50",
                                      "text-[11px] font-medium text-foreground/90",
                                      "hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                                      "transition-all cursor-pointer disabled:opacity-50",
                                      "active:scale-[0.98]",
                                    )}
                                  >
                                    {item.label}
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Area (hidden when FAQ is open) */}
            {!showFAQ && (
              <div className="h-[340px] overflow-y-auto p-4 space-y-4 text-sm leading-relaxed scrollbar-thin">
                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={i}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={snappySpring}
                      className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
                    >
                      {!isUser && (
                        <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs">
                          <Bot className="size-3.5" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[84%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm",
                          isUser
                            ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                            : "bg-secondary/80 text-foreground border border-border/60 rounded-tl-sm prose-sm",
                        )}
                      >
                        {msg.content}
                      </div>
                      {isUser && (
                        <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground border border-border/50 text-xs">
                          <User className="size-3.5" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Typing Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-muted-foreground pl-9"
                  >
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                    <span className="text-[11px] text-muted-foreground ml-1">Hope is thinking...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Prompt Chips + FAQ Toggle */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-border/40 bg-secondary/30 scrollbar-none">
              <button
                type="button"
                onClick={() => { setShowFAQ((v) => !v); setExpandedCategory(null); }}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                  showFAQ
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary/60",
                )}
              >
                <HelpCircle className="size-3" />
                FAQs
              </button>
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary/60 transition-all cursor-pointer disabled:opacity-50"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-border/60 bg-background p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share how you're feeling..."
                maxLength={500}
                disabled={loading}
                className="flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
              />
              <Button
                type="submit"
                size="sm"
                variant="hero"
                disabled={!input.trim() || loading}
                className="size-9 rounded-full p-0 shrink-0"
              >
                <Send className="size-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
