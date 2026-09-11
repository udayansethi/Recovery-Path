import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, RotateCcw, Sparkles, Wand2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/site/page";
import { Button } from "@/components/ui/button";
import {
  addictions,
  bandLabel,
  getAddiction,
  scoreBand,
} from "@/data/addictions";
import { AnimatedNumber, Reveal, spring, snappySpring } from "@/lib/motion";
import { useResults } from "@/lib/store";
import { getAssessmentAdvice } from "@/lib/ai-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/addictions/$slug")({
  loader: ({ params }) => {
    const topic = getAddiction(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Topic not found — Recovery Path" }, { name: "robots", content: "noindex" }],
      };
    }
    const { topic } = loaderData;
    const title = `${topic.name} self-check — Recovery Path`;
    return {
      meta: [
        { title },
        { name: "description", content: topic.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: topic.description.slice(0, 155) },
      ],
    };
  },
  component: AddictionDetail,
});

const SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Almost always" },
];

function AddictionDetail() {
  const { topic } = Route.useLoaderData();
  const reduce = useReducedMotion();
  const { add } = useResults();
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => topic.questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [openDetail, setOpenDetail] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const answered = answers.filter((a) => a !== null).length;
  const pct = (answered / topic.questions.length) * 100;
  const total = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  const band = useMemo(() => scoreBand(total), [total]);
  const complete = answered === topic.questions.length;

  const related = addictions
    .filter((a) => a.category === topic.category && a.slug !== topic.slug)
    .slice(0, 3);

  function choose(qi: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = value;
      return next;
    });
  }

  function submit() {
    if (!complete) return;
    setSubmitted(true);
    add({
      slug: topic.slug,
      name: topic.name,
      total,
      band: scoreBand(total),
      answers: answers.map((a) => a ?? 0),
    });
    toast.success("Check saved to your dashboard");
  }

  async function handleGenerateAdvice() {
    setAiLoading(true);
    try {
      const res = await getAssessmentAdvice({
        addiction_name: topic.name,
        total_score: total,
        severity_level: bandLabel[band],
      });
      setAiAdvice(res.advice);
      toast.success("Personalized AI action plan generated");
    } catch {
      toast.error("Could not generate advice right now");
    } finally {
      setAiLoading(false);
    }
  }

  function reset() {
    setAnswers(topic.questions.map(() => null));
    setSubmitted(false);
    setAiAdvice(null);
  }

  return (
    <Page>
      <Link
        to="/addictions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All areas
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary">
          {topic.category}
        </span>
      </div>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
        <span className="text-gradient">{topic.name}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{topic.tagline}</p>

      {/* Expand / collapse detail */}
      <div className="glass-panel mt-8 overflow-hidden rounded-3xl">
        <button
          onClick={() => setOpenDetail((v) => !v)}
          aria-expanded={openDetail}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span className="text-sm font-medium">What this usually looks like</span>
          <motion.span animate={{ rotate: openDetail ? 180 : 0 }} transition={spring}>
            <ChevronDown className="size-4 text-muted-foreground" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {openDetail && (
            <motion.div
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              {...(reduce ? {} : { exit: { height: 0, opacity: 0 } })}
              transition={spring}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                {topic.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Questionnaire */}
      <div className="mt-10">
        <div className="sticky top-20 z-10 mb-6">
          <div className="glass-panel flex items-center gap-4 rounded-full px-5 py-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                animate={{ width: `${pct}%` }}
                transition={spring}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {answered}/{topic.questions.length}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {topic.questions.map((question, qi) => (
            <Reveal key={qi} delay={qi * 0.04}>
              <div
                className={cn(
                  "glass-panel rounded-3xl p-6 transition-colors duration-500",
                  answers[qi] !== null && "border-primary/30",
                )}
              >
                <div className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs text-muted-foreground">
                    {qi + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{question}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {SCALE.map((opt) => {
                    const on = answers[qi] === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        onClick={() => choose(qi, opt.value)}
                        {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.96 } })}
                        transition={snappySpring}
                        aria-pressed={on}
                        className={cn(
                          "relative cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-300",
                          on
                            ? "border-transparent text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId={`opt-${qi}`}
                            transition={spring}
                            className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)]"
                          />
                        )}
                        <span className="relative flex items-center gap-1.5">
                          {on && <Check className="size-3" />}
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" variant="hero" disabled={!complete} onClick={submit}>
            {submitted ? "Saved" : "See my result"}
          </Button>
          {(answered > 0 || submitted) && (
            <Button size="lg" variant="glass" onClick={reset}>
              <RotateCcw className="size-4" /> Start over
            </Button>
          )}
          {!complete && (
            <span className="text-xs text-muted-foreground">
              Answer all {topic.questions.length} questions to continue.
            </span>
          )}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {submitted && (
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12 }}
            transition={spring}
            className="glass-panel mt-10 rounded-3xl p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="size-3" /> {bandLabel[band]}
                </span>
                <h2 className="mt-4 text-2xl font-semibold">Your {topic.name} snapshot</h2>
              </div>
              <div className="text-right">
                <div className="font-display text-5xl font-semibold text-gradient">
                  <AnimatedNumber value={total} />
                  <span className="text-2xl text-muted-foreground">/40</span>
                </div>
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                initial={{ width: 0 }}
                animate={{ width: `${(total / 40) * 100}%` }}
                transition={{ ...spring, delay: 0.15 }}
              />
            </div>

            <ul className="mt-6 space-y-3">
              {topic.tips[band].map((tip, i) => (
                <motion.li
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.2 + i * 0.07 }}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {tip}
                </motion.li>
              ))}
            </ul>

            {/* AI Personalized Advice Section */}
            <div className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-secondary/40 to-accent/5 p-6 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-xl bg-primary/20 text-primary">
                    <Wand2 className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">AI Personalized Recovery Plan</h3>
                    <p className="text-xs text-muted-foreground">Tailored analysis, 3-part action steps & urge surfing guide</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="hero"
                  onClick={handleGenerateAdvice}
                  disabled={aiLoading}
                  className="gap-2 text-xs"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" />
                      {aiAdvice ? "Regenerate AI Plan" : "Generate AI Plan"}
                    </>
                  )}
                </Button>
              </div>

              {aiAdvice && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="mt-5 border-t border-border/60 pt-4"
                >
                  <div className="prose-sm text-xs leading-relaxed text-foreground/90 space-y-2 whitespace-pre-line bg-secondary/50 rounded-xl p-4 border border-border/50">
                    {aiAdvice}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span>Generated by Hope AI Engine · Confidential educational guidance</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
              <Button asChild variant="glass">
                <Link to="/stories">Read recovery stories</Link>
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stories */}
      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold">Voices on {topic.name.toLowerCase()}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {topic.stories.map((s) => (
            <div key={s.author} className="glass-panel rounded-3xl p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">“{s.text}”</p>
              <p className="mt-4 text-xs font-medium text-primary">
                {s.author} · day {s.days}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal className="mt-14">
          <h2 className="text-2xl font-semibold">Related areas</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/addictions/$slug"
                params={{ slug: r.slug }}
                className="glass-panel rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="font-semibold">{r.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.tagline}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      )}
    </Page>
  );
}
