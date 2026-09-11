import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Circle,
  Download,
  Flame,
  HeartPulse,
  Plus,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Wand2,
  Shield,
  BrainCircuit,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Page, SectionHeading } from "@/components/site/page";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { bandLabel } from "@/data/addictions";
import { AnimatedNumber, Reveal, TiltCard, snappySpring, spring } from "@/lib/motion";
import { useCheckIns, useGoals, useResults } from "@/lib/store";
import {
  getEntryTip,
  decomposeGoal,
  generateMilestoneShield,
  analyzeTriggerPatterns,
} from "@/lib/ai-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — track mood, urges, goals and checks" },
      {
        name: "description",
        content:
          "A private, on-device dashboard: log daily mood, urge level, triggers, micro-goals, and review every self-assessment you've completed.",
      },
      { property: "og:title", content: "Your dashboard — Recovery Path" },
      {
        property: "og:description",
        content: "Log daily mood, urges and goals, and review your self-assessment history, stored locally.",
      },
    ],
  }),
  component: Dashboard,
});

const bandTone = {
  low: "text-primary",
  medium: "text-accent",
  high: "text-destructive",
} as const;

const COMMON_TRIGGERS = [
  "Stress",
  "Boredom",
  "Fatigue",
  "Social setting",
  "Evening downtime",
  "Loneliness",
  "Screen time",
  "Work deadline",
];

export function Dashboard() {
  const reduce = useReducedMotion();
  const { results, clear: clearResults, hydrated: resultsHydrated } = useResults();
  const { checkIns, record, clear: clearCheckIns, hydrated: checkInsHydrated } = useCheckIns();
  const { goals, addGoal, toggleGoal, deleteGoal, hydrated: goalsHydrated } = useGoals();

  const [mood, setMood] = useState(6);
  const [urges, setUrges] = useState(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  // AI Feature States
  const [entryTip, setEntryTip] = useState<string | null>(null);
  const [entryTipLoading, setEntryTipLoading] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Mindset");
  const [goalDecomposeLoading, setGoalDecomposeLoading] = useState(false);
  const [decomposedHabits, setDecomposedHabits] = useState<string[] | null>(null);

  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneLetter, setMilestoneLetter] = useState<string | null>(null);
  const [milestoneLoading, setMilestoneLoading] = useState(false);

  const [patternAnalysis, setPatternAnalysis] = useState<string | null>(null);
  const [patternLoading, setPatternLoading] = useState(false);

  const streak = checkIns.length;
  const avgMood = checkIns.length
    ? checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length
    : 0;
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger],
    );
  };

  const handleSaveCheckIn = () => {
    record(mood, urges, selectedTriggers, notes);
    setJustSaved(true);
    toast.success("Today's check-in saved to your local device");
    window.setTimeout(() => setJustSaved(false), 2200);
  };

  const handleFetchEntryTip = async () => {
    setEntryTipLoading(true);
    try {
      const res = await getEntryTip({
        entry_type: urges > 5 ? "craving" : "daily_checkin",
        severity: urges,
        notes: notes || (selectedTriggers.length ? `Triggers: ${selectedTriggers.join(", ")}` : "Regular check-in"),
        addiction_name: results[0]?.name || "Recovery Path",
      });
      setEntryTip(res.tip);
      toast.success("AI reflection ready");
    } catch {
      toast.error("Could not fetch tip right now");
    } finally {
      setEntryTipLoading(false);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addGoal(newGoalTitle, newGoalCategory);
    setNewGoalTitle("");
    setDecomposedHabits(null);
    toast.success("Recovery micro-goal added");
  };

  const handleDecomposeGoal = async () => {
    if (!newGoalTitle.trim()) {
      toast.error("Please enter a goal title first");
      return;
    }
    setGoalDecomposeLoading(true);
    try {
      const res = await decomposeGoal({
        goal_title: newGoalTitle,
        goal_type: newGoalCategory,
        addiction_name: results[0]?.name || "Recovery",
      });
      if (res.habits && res.habits.length > 0) {
        setDecomposedHabits(res.habits);
      } else {
        setDecomposedHabits([
          `Environment Reset: Remove triggers for ${newGoalTitle}`,
          `Routine Anchor: Practice 2-minute breathing during peak urge time`,
          `Daily Reflection: Log 1 sentence every evening`,
        ]);
      }
      toast.success("Generated 3 actionable micro-habits");
    } catch {
      toast.error("Could not decompose goal right now");
    } finally {
      setGoalDecomposeLoading(false);
    }
  };

  const handleAddSubHabit = (habitText: string) => {
    addGoal(habitText, newGoalCategory);
    toast.success(`Added habit: ${habitText.slice(0, 30)}...`);
  };

  const handleOpenMilestoneModal = async () => {
    setMilestoneModalOpen(true);
    setMilestoneLoading(true);
    try {
      const res = await generateMilestoneShield({
        milestone_title: `${completedGoalsCount} Micro-Goals & ${streak} Days Tracked`,
        days_clean: Math.max(streak, 1),
        addiction_name: results[0]?.name || "General Recovery",
      });
      setMilestoneLetter(res.letter);
    } catch {
      toast.error("Could not generate shield letter");
    } finally {
      setMilestoneLoading(false);
    }
  };

  const handleAnalyzePatterns = async () => {
    if (checkIns.length === 0) {
      toast.error("Please log at least 1 check-in first");
      return;
    }
    setPatternLoading(true);
    try {
      const summary = checkIns
        .slice(0, 14)
        .map((c) => `Date: ${c.date}, Mood: ${c.mood}/10, Urges: ${c.urges}/10, Triggers: [${c.triggers.join(",")}]`)
        .join("; ");
      const res = await analyzeTriggerPatterns({
        entries_summary: summary,
        addiction_name: results[0]?.name || "Recovery Journey",
      });
      setPatternAnalysis(res.analysis);
      toast.success("Pattern insights analyzed");
    } catch {
      toast.error("Could not analyze patterns right now");
    } finally {
      setPatternLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      results,
      checkIns,
      goals,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recovery-path-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data export downloaded");
  };

  return (
    <Page>
      <SectionHeading
        eyebrow="Dashboard"
        title="Small daily signals, honestly recorded"
        subtitle="Everything here lives on your device only. Zero account required, zero tracking cookies."
      />

      {/* Overview Stat Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Activity, label: "Days logged", value: streak, decimals: 0, tone: "text-primary" },
          { icon: HeartPulse, label: "Average mood", value: avgMood, decimals: 1, tone: "text-primary" },
          { icon: Target, label: "Goals completed", value: completedGoalsCount, decimals: 0, tone: "text-accent" },
          { icon: TrendingUp, label: "Checks taken", value: results.length, decimals: 0, tone: "text-primary" },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <TiltCard className="glass-panel" intensity={6}>
              <div className="p-6">
                <s.icon className={cn("size-5", s.tone)} />
                <div className="mt-4 font-display text-4xl font-semibold">
                  <AnimatedNumber value={s.value} decimals={s.decimals} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* Main Grid: Check-in & Micro-Goals */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Daily Check-in Form */}
        <Reveal className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Today's Check-in</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Record how you feel today and any urge intensity you noticed.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Daily Log
              </span>
            </div>

            {/* Sliders */}
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">Mood level</span>
                  <motion.span
                    key={mood}
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={spring}
                    className="font-display text-2xl font-bold text-primary"
                  >
                    {mood}
                    <span className="text-xs font-normal text-muted-foreground">/10</span>
                  </motion.span>
                </div>
                <Slider
                  value={[mood]}
                  onValueChange={(v) => setMood(v[0] ?? 0)}
                  min={0}
                  max={10}
                  step={1}
                  aria-label="Mood"
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>Low / Heavy</span>
                  <span>Balanced</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-foreground">Urge intensity</span>
                  <motion.span
                    key={urges}
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={spring}
                    className="font-display text-2xl font-bold text-accent"
                  >
                    {urges}
                    <span className="text-xs font-normal text-muted-foreground">/10</span>
                  </motion.span>
                </div>
                <Slider
                  value={[urges]}
                  onValueChange={(v) => setUrges(v[0] ?? 0)}
                  min={0}
                  max={10}
                  step={1}
                  aria-label="Urge intensity"
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>None</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>

            {/* Triggers Section */}
            <div className="mt-8 border-t border-border/60 pt-6">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Tag className="size-3.5 text-primary" /> Active Triggers (optional)
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {COMMON_TRIGGERS.map((t) => {
                  const active = selectedTriggers.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTrigger(t)}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-surface/70 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection Note */}
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Reflection / What helped today?
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Went for a walk when the urge peaked, called a friend..."
                className="mt-2 w-full rounded-2xl border border-border bg-surface/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Actions & AI Coping Tip */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="lg" onClick={handleSaveCheckIn}>
                Save Daily Check-in
              </Button>
              <Button
                variant="glass"
                size="lg"
                onClick={handleFetchEntryTip}
                disabled={entryTipLoading}
                className="gap-2 text-xs"
              >
                {entryTipLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5 text-primary" />
                )}
                {entryTip ? "Refresh AI Tip" : "Get AI Coping Tip"}
              </Button>

              <AnimatePresence>
                {justSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={spring}
                    className="text-sm font-medium text-primary"
                  >
                    Logged for today ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* AI Reflection Box */}
            {entryTip && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={snappySpring}
                className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground/90 whitespace-pre-line"
              >
                <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                  <Sparkles className="size-3.5" />
                  <span>Hope AI Daily Reflection</span>
                </div>
                {entryTip}
              </motion.div>
            )}

            {/* 14-Day Visual Trend Chart */}
            {checkIns.length > 0 && (
              <div className="mt-10 border-t border-border/60 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Last {Math.min(checkIns.length, 14)} Days Trend
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary" /> Mood
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-accent" /> Urges
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex h-36 items-end gap-2 sm:gap-3">
                  {[...checkIns]
                    .slice(0, 14)
                    .reverse()
                    .map((c) => (
                      <div
                        key={c.date}
                        className="group relative flex flex-1 flex-col justify-end gap-1"
                      >
                        <motion.div
                          initial={reduce ? false : { height: 0 }}
                          animate={{ height: `${Math.max(8, (c.mood / 10) * 80)}%` }}
                          transition={spring}
                          className="rounded-t-md bg-[image:var(--gradient-primary)] transition-all group-hover:brightness-125"
                        />
                        <motion.div
                          initial={reduce ? false : { height: 0 }}
                          animate={{ height: `${Math.max(8, (c.urges / 10) * 45)}%` }}
                          transition={{ ...spring, delay: 0.05 }}
                          className="rounded-b-md bg-accent/80 transition-all group-hover:brightness-125"
                        />
                        <span className="mt-1 truncate text-center text-[10px] text-muted-foreground">
                          {c.date.slice(5)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Right Column: Recovery Micro-Goals & AI Decomposer */}
        <Reveal className="lg:col-span-5" delay={0.08}>
          <div className="glass-panel flex h-full flex-col rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recovery Micro-Goals</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Small, achievable steps that build momentum.
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                <Flame className="size-3.5" />
                {completedGoalsCount}/{goals.length} done
              </span>
            </div>

            {/* Add Goal Form & AI Coach Button */}
            <form onSubmit={handleAddGoal} className="mt-6 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. 5-min morning breathing..."
                  className="flex-1 rounded-xl border border-border bg-surface/80 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Mindset">Mindset</option>
                  <option value="Habit">Habit</option>
                  <option value="Awareness">Awareness</option>
                  <option value="Social">Social</option>
                  <option value="Health">Health</option>
                </select>
                <Button type="submit" size="sm" variant="hero" className="gap-1 px-3">
                  <Plus className="size-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleDecomposeGoal}
                  disabled={goalDecomposeLoading || !newGoalTitle.trim()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {goalDecomposeLoading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Wand2 className="size-3" />
                  )}
                  Decompose into 3 Daily Micro-Habits with AI
                </button>
              </div>
            </form>

            {/* Decomposed Habits Suggestion Drawer */}
            {decomposedHabits && (
              <motion.div
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">Suggested Micro-Habits:</span>
                  <button
                    onClick={() => setDecomposedHabits(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {decomposedHabits.map((habit, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 bg-background/80 rounded-xl p-2 border border-border/50">
                      <span className="truncate text-[11px]">{habit}</span>
                      <button
                        type="button"
                        onClick={() => handleAddSubHabit(habit)}
                        className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Goals List */}
            <div className="mt-6 flex-1 space-y-2.5 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={snappySpring}
                    className={cn(
                      "group flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition-all",
                      goal.completed
                        ? "border-primary/20 bg-primary/5 text-muted-foreground"
                        : "border-border bg-surface/60 hover:border-primary/30",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className="mt-0.5 grid cursor-pointer place-items-center text-primary"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="size-4.5 text-primary" />
                      ) : (
                        <Circle className="size-4.5 text-muted-foreground group-hover:text-primary" />
                      )}
                    </button>

                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-xs leading-relaxed font-medium transition-colors",
                          goal.completed ? "line-through text-muted-foreground" : "text-foreground",
                        )}
                      >
                        {goal.title}
                      </p>
                      <span className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {goal.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      aria-label="Delete goal"
                      className="cursor-pointer text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {goals.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No micro-goals yet. Add one above or use the AI decomposer.
                </div>
              )}
            </div>

            {/* Milestone Shield Button */}
            {completedGoalsCount > 0 && (
              <div className="mt-4 border-t border-border/60 pt-4">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleOpenMilestoneModal}
                  className="w-full gap-2 text-xs border-primary/30 text-primary"
                >
                  <Shield className="size-3.5" />
                  Generate Milestone Shield (Letter to Future Self)
                </Button>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* AI Trigger Pattern Detective Card */}
      <Reveal className="mt-12">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/25">
                <BrainCircuit className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI Trigger Pattern Detective</h2>
                <p className="text-xs text-muted-foreground">
                  Analyze your logged mood, triggers, and urge cycles to discover peak vulnerability windows and weekend guardrails.
                </p>
              </div>
            </div>

            <Button
              variant="hero"
              size="sm"
              onClick={handleAnalyzePatterns}
              disabled={patternLoading || checkIns.length === 0}
              className="gap-2 text-xs"
            >
              {patternLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing Cycles...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Analyze My Patterns
                </>
              )}
            </Button>
          </div>

          {patternAnalysis && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-secondary/60 p-5 border border-border/70 text-xs leading-relaxed text-foreground whitespace-pre-line"
            >
              {patternAnalysis}
            </motion.div>
          )}
        </div>
      </Reveal>

      {/* Assessment History Section */}
      <Reveal className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Self-Assessment History</h2>
            <p className="text-xs text-muted-foreground">
              Review your past clinical self-evaluations and track your score progression.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={handleExportData} className="gap-1.5">
              <Download className="size-3.5" /> Export Data
            </Button>
            {results.length > 0 && (
              <Button
                variant="glass"
                size="sm"
                onClick={() => {
                  clearResults();
                  toast.success("Assessment history cleared");
                }}
                className="gap-1.5 text-destructive hover:border-destructive/40"
              >
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <AnimatePresence initial={false}>
            {results.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
                className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-4"
              >
                <div>
                  <Link
                    to="/addictions/$slug"
                    params={{ slug: r.slug }}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {r.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", bandTone[r.band])}>
                    {bandLabel[r.band]}
                  </span>
                  <span className="font-display text-xl font-bold tabular-nums text-foreground">
                    {r.total}
                    <span className="text-sm font-normal text-muted-foreground">/40</span>
                  </span>
                  <Link
                    to="/addictions/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Retake Check
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {resultsHydrated && results.length === 0 && (
          <div className="glass-panel mt-4 rounded-3xl p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No assessments recorded yet — take your first 2-minute check to establish your baseline.
            </p>
            <Link
              to="/addictions"
              className="mt-5 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore Self-Checks
            </Link>
          </div>
        )}
      </Reveal>

      {/* Milestone Shield Modal */}
      <AnimatePresence>
        {milestoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-primary/30 shadow-2xl relative"
            >
              <button
                onClick={() => setMilestoneModalOpen(false)}
                className="absolute top-5 right-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-primary/20 text-primary">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Milestone Shield</h3>
                  <p className="text-xs text-muted-foreground">Letter to Your Future Self in moments of craving</p>
                </div>
              </div>

              <div className="mt-6">
                {milestoneLoading ? (
                  <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span>Hope AI is crafting your personal milestone shield...</span>
                  </div>
                ) : (
                  <div className="prose-sm max-h-[350px] overflow-y-auto rounded-2xl bg-secondary/60 p-5 text-xs leading-relaxed text-foreground whitespace-pre-line border border-border/60">
                    {milestoneLetter}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="hero" size="sm" onClick={() => setMilestoneModalOpen(false)}>
                  Keep in My Shield Pocket ✓
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Page>
  );
}
