import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Pause,
  PhoneCall,
  Play,
  RotateCcw,
  Sparkles,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { spring, snappySpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "breathing" | "timer" | "grounding" | "helplines";

export function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabType>("breathing");

  // --- 4-7-8 Breathing State ---
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"ready" | "inhale" | "hold" | "exhale">("ready");
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    if (!isBreathing || !isOpen) {
      setBreathPhase("ready");
      setBreathCount(4);
      return;
    }

    let timer: NodeJS.Timeout;
    let count = 4;
    setBreathPhase("inhale");
    setBreathCount(4);

    const runCycle = () => {
      // Inhale 4s
      setBreathPhase("inhale");
      count = 4;
      setBreathCount(4);

      const inhaleInterval = setInterval(() => {
        count -= 1;
        setBreathCount(count);
        if (count <= 0) {
          clearInterval(inhaleInterval);
          // Hold 7s
          setBreathPhase("hold");
          count = 7;
          setBreathCount(7);

          const holdInterval = setInterval(() => {
            count -= 1;
            setBreathCount(count);
            if (count <= 0) {
              clearInterval(holdInterval);
              // Exhale 8s
              setBreathPhase("exhale");
              count = 8;
              setBreathCount(8);

              const exhaleInterval = setInterval(() => {
                count -= 1;
                setBreathCount(count);
                if (count <= 0) {
                  clearInterval(exhaleInterval);
                  runCycle();
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 1000);
    };

    runCycle();

    return () => {
      setIsBreathing(false);
      setBreathPhase("ready");
    };
  }, [isBreathing, isOpen]);

  // --- 3-Minute Urge Surfer Timer State ---
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(180);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- 5-4-3-2-1 Sensory Grounding State ---
  const [groundingChecks, setGroundingChecks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleGrounding = (index: number) => {
    setGroundingChecks((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const groundingSteps = [
    { count: 5, label: "Look around you", prompt: "Acknowledge 5 things you can see right now (a shadow, a texture, an object)." },
    { count: 4, label: "Feel your body", prompt: "Acknowledge 4 things you can touch (your clothes, the chair, the cool desk)." },
    { count: 3, label: "Listen closely", prompt: "Acknowledge 3 distinct sounds you can hear (traffic, breathing, ambient hum)." },
    { count: 2, label: "Notice scents", prompt: "Acknowledge 2 things you can smell (fresh air, coffee, fabric)." },
    { count: 1, label: "Center yourself", prompt: "Acknowledge 1 taste or take 1 conscious, grounding deep breath." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={spring}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-modal-title"
            className="glass-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-border p-6 shadow-2xl sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-destructive/20 text-destructive">
                  <AlertCircle className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-destructive">
                      SOS Support
                    </span>
                    <span className="text-xs text-muted-foreground">Urge De-escalator</span>
                  </div>
                  <h2 id="sos-modal-title" className="text-xl font-semibold text-foreground">
                    You are safe. Take this one minute at a time.
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { id: "breathing", label: "4-7-8 Breathing", icon: Wind },
                { id: "timer", label: "3-Min Urge Surfer", icon: Waves },
                { id: "grounding", label: "5-4-3-2-1 Reset", icon: Sparkles },
                { id: "helplines", label: "24/7 Lifelines", icon: PhoneCall },
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors",
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="sos-tab-pill"
                        transition={spring}
                        className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)]"
                      />
                    )}
                    <Icon className="relative size-3.5" />
                    <span className="relative">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="mt-6 flex-1 overflow-y-auto pr-1">
              {activeTab === "breathing" && (
                <div className="flex flex-col items-center py-4 text-center">
                  <p className="max-w-md text-sm text-muted-foreground">
                    The 4-7-8 method directly activates your parasympathetic nervous system, slowing your heart rate and reducing cortisol.
                  </p>

                  <div className="my-8 flex size-52 items-center justify-center">
                    <motion.div
                      animate={
                        breathPhase === "inhale"
                          ? { scale: [1, 1.45], borderColor: "oklch(0.78 0.132 178)" }
                          : breathPhase === "hold"
                            ? { scale: 1.45, borderColor: "oklch(0.82 0.13 74)" }
                            : breathPhase === "exhale"
                              ? { scale: [1.45, 1], borderColor: "oklch(0.68 0.13 250)" }
                              : { scale: 1, borderColor: "oklch(0.98 0.01 190 / 20%)" }
                      }
                      transition={{
                        duration:
                          breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 7 : breathPhase === "exhale" ? 8 : 0.4,
                        ease: "easeInOut",
                      }}
                      className="relative grid size-40 place-items-center rounded-full border-4 bg-surface/80 shadow-[var(--shadow-glow)] backdrop-blur-md"
                    >
                      <div className="text-center">
                        <div className="font-display text-2xl font-bold uppercase tracking-wider text-foreground">
                          {breathPhase === "ready"
                            ? "Ready"
                            : breathPhase === "inhale"
                              ? "Inhale"
                              : breathPhase === "hold"
                                ? "Hold"
                                : "Exhale"}
                        </div>
                        {isBreathing && (
                          <div className="mt-1 font-display text-3xl font-semibold text-primary">
                            {breathCount}s
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => setIsBreathing((v) => !v)}
                      className="gap-2"
                    >
                      {isBreathing ? (
                        <>
                          <Pause className="size-4" /> Pause Breathing
                        </>
                      ) : (
                        <>
                          <Play className="size-4" /> Start 4-7-8 Breathing
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "timer" && (
                <div className="flex flex-col items-center py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    <Waves className="size-3.5" /> Alan Marlatt Urge Surfing Technique
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    Cravings are waves: they peak in 3–5 minutes, then break
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Do not fight the urge. Instead, sit with the physical sensation, observe your breathing, and let the wave peak and wash away.
                  </p>

                  <div className="my-8 rounded-3xl border border-border bg-surface/80 px-10 py-6 text-center shadow-lg">
                    <div className="font-display text-6xl font-bold tracking-tight text-gradient">
                      {formatTimer(secondsLeft)}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {timerRunning ? "Surfing the wave..." : secondsLeft === 0 ? "Wave has passed!" : "3-Minute Challenge"}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => setTimerRunning((v) => !v)}
                      className="gap-2"
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="size-4" /> Pause Timer
                        </>
                      ) : (
                        <>
                          <Play className="size-4" /> {secondsLeft < 180 ? "Resume Timer" : "Start 3-Min Timer"}
                        </>
                      )}
                    </Button>
                    <Button variant="glass" size="lg" onClick={resetTimer} className="gap-2">
                      <RotateCcw className="size-4" /> Reset
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "grounding" && (
                <div className="py-2">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Bring your nervous system back into the physical present moment with this cognitive grounding sequence:
                  </p>

                  <div className="space-y-3">
                    {groundingSteps.map((step, idx) => {
                      const checked = groundingChecks[idx];
                      return (
                        <motion.button
                          key={step.count}
                          type="button"
                          onClick={() => toggleGrounding(idx)}
                          whileTap={reduce ? {} : { scale: 0.98 }}
                          transition={snappySpring}
                          className={cn(
                            "flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition-all",
                            checked
                              ? "border-primary/40 bg-primary/10"
                              : "border-border bg-surface/60 hover:border-primary/30",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-semibold transition-colors",
                              checked ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                            )}
                          >
                            {checked ? <CheckCircle2 className="size-4" /> : step.count}
                          </span>
                          <div>
                            <h4
                              className={cn(
                                "text-sm font-semibold transition-colors",
                                checked ? "text-primary" : "text-foreground",
                              )}
                            >
                              {step.label}
                            </h4>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {step.prompt}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {groundingChecks.every(Boolean) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 rounded-2xl border border-primary/30 bg-primary/15 p-4 text-center text-sm font-medium text-primary"
                    >
                      🌟 Well done. Take a deep, gentle breath. You are grounded in this exact moment.
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === "helplines" && (
                <div className="py-2">
                  <p className="mb-4 text-sm text-muted-foreground">
                    If you are in severe distress or worried about your physical safety, free confidential human support is available 24/7:
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href="tel:988"
                      className="group flex items-start gap-3.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 transition-all hover:bg-destructive/20"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-destructive text-destructive-foreground">
                        <PhoneCall className="size-4" />
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">988 Suicide &amp; Crisis Lifeline</div>
                        <div className="text-xs text-muted-foreground">Call or text 988 (US &amp; Canada) · 24/7 Free</div>
                      </div>
                    </a>

                    <a
                      href="tel:18006624357"
                      className="group flex items-start gap-3.5 rounded-2xl border border-primary/30 bg-primary/10 p-4 transition-all hover:bg-primary/20"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                        <HeartHandshake className="size-4" />
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">SAMHSA National Helpline</div>
                        <div className="text-xs text-muted-foreground">1-800-662-4357 · Treatment &amp; Recovery</div>
                      </div>
                    </a>

                    <a
                      href="sms:741741?body=HOME"
                      className="group flex items-start gap-3.5 rounded-2xl border border-border bg-surface/80 p-4 transition-all hover:border-primary/40"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                        💬
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">Crisis Text Line</div>
                        <div className="text-xs text-muted-foreground">Text HOME to 741741 · Free confidential texting</div>
                      </div>
                    </a>

                    <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface/80 p-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                        🌍
                      </span>
                      <div>
                        <div className="font-semibold text-foreground">International Helplines</div>
                        <div className="text-xs text-muted-foreground">UK: 111 (NHS) / 116 123 (Samaritans) · EU: 112</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-border/60 pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Recovery Path is an educational companion. For medical emergencies or acute withdrawal, please call emergency services immediately.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
