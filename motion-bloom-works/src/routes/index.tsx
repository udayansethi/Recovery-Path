import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, HeartPulse, LineChart, Sparkles, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/site/page";
import { Reveal, RevealStagger, Stagger, StaggerItem, TiltCard, AnimatedNumber, itemVariants } from "@/lib/motion";
import { addictions, categories } from "@/data/addictions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recovery Path — Understand the habit, then change it" },
      {
        name: "description",
        content:
          "Explore 17 addiction types, take a 10-question self-check, and get personalised next steps with a calm, guided interface.",
      },
      { property: "og:title", content: "Recovery Path — Understand the habit, then change it" },
      {
        property: "og:description",
        content: "Self-assessments, tailored guidance and real recovery stories.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Sparkles,
    title: "Guided self-checks",
    body: "Ten calibrated clinical questions per topic. Three minutes, no account, no judgement.",
  },
  {
    icon: LineChart,
    title: "Progress you can see",
    body: "Daily check-ins and score history turn vague effort into visible movement.",
  },
  {
    icon: Users,
    title: "Stories that ring true",
    body: "Short, honest accounts from people further along the same path.",
  },
  {
    icon: HeartPulse,
    title: "Practical next steps",
    body: "Every result maps to concrete actions scaled to where you actually are.",
  },
];

function Index() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "38%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.25]);

  return (
    <Page className="pt-6">
      <section ref={heroRef} className="relative overflow-hidden rounded-[2.5rem] px-6 py-20 sm:px-14 sm:py-28">
        <motion.div
          aria-hidden
          style={{ y: y1 }}
          className="pointer-events-none absolute -left-24 -top-32 size-[420px] rounded-full bg-primary/20 blur-[110px]"
        />
        <motion.div
          aria-hidden
          style={{ y: y2 }}
          className="pointer-events-none absolute -right-20 top-24 size-[360px] rounded-full bg-accent/15 blur-[120px]"
        />

        <motion.div style={{ opacity: fade }}>
          <Stagger className="relative max-w-3xl">
            <StaggerItem>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
                17 topics · 85 stories
              </span>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] sm:text-7xl">
                Understand the habit.
                <br />
                <span className="text-gradient">Then change it.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Recovery Path turns a vague sense that something is off into a clear,
                measured picture — and a next step you can actually take today.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/addictions">
                    Take a self-check <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="xl">
                  <Link to="/stories">Read recovery stories</Link>
                </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6">
                {[
                  { label: "Topics", value: 17 },
                  { label: "Questions each", value: 10 },
                  { label: "Stories", value: 51 },
                ].map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-3xl font-semibold text-foreground">
                      <AnimatedNumber value={s.value} />
                    </dd>
                    <dt className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </StaggerItem>
          </Stagger>
        </motion.div>
      </section>

      <section className="mt-24">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="A quiet interface for a loud problem"
            subtitle="No streak-shaming, no dark patterns. Just structure, feedback and honest information."
          />
        </Reveal>
        <RevealStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants}>
              <TiltCard className="glass-panel h-full p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary transition-transform duration-500 group-hover:scale-110">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </TiltCard>
            </motion.div>
          ))}
        </RevealStagger>
      </section>

      <section className="mt-24">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Three families of habit"
            subtitle="Every topic includes a self-check, tailored guidance and stories from people living it."
          />
        </Reveal>
        <RevealStagger className="mt-10 grid gap-5 lg:grid-cols-3">
          {categories.map((c) => {
            const items = addictions.filter((a) => a.category === c);
            return (
              <motion.div key={c} variants={itemVariants}>
                <TiltCard className="glass-panel h-full p-7" intensity={5}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">{c}</h3>
                    <span className="text-sm text-primary">{items.length}</span>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {items.slice(0, 6).map((a) => (
                      <li key={a.slug}>
                        <Link
                          to="/addictions/$slug"
                          params={{ slug: a.slug }}
                          className="group/link flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:bg-secondary/60 hover:text-foreground"
                        >
                          {a.name}
                          <ArrowRight className="size-3.5 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            );
          })}
        </RevealStagger>
      </section>

      <Reveal className="mt-24">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-32 mx-auto h-64 w-2/3 rounded-full bg-primary/20 blur-[100px]"
          />
          <h2 className="relative text-3xl font-semibold sm:text-4xl">
            Two minutes now beats another six months of wondering.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Nothing is stored on a server. Your answers stay on this device.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/addictions">
                Choose a topic <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Page>
  );
}
