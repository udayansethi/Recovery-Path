import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Page, SectionHeading } from "@/components/site/page";
import { Input } from "@/components/ui/input";
import { addictions, categories, type Category } from "@/data/addictions";
import { TiltCard, spring, itemVariants, containerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/addictions/")({
  head: () => ({
    meta: [
      { title: "Explore habits & dependencies — Recovery Path" },
      {
        name: "description",
        content:
          "Browse 17 substance, behavioural and health-related habit areas, then take a short two-minute self-assessment for any of them.",
      },
      { property: "og:title", content: "Explore habits & dependencies — Recovery Path" },
      {
        property: "og:description",
        content:
          "Browse substance, behavioural and health habit areas and take a short self-assessment.",
      },
    ],
  }),
  component: AddictionsIndex,
});

function AddictionsIndex() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return addictions.filter((a) => {
      const inCat = active === "All" || a.category === active;
      const inQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, active]);

  const filters: (Category | "All")[] = ["All", ...categories];

  return (
    <Page>
      <SectionHeading
        eyebrow="Explore"
        title={<>Find the pattern you want to understand</>}
        subtitle="Seventeen areas, each with a short, honest self-check. Nothing is stored anywhere but this device."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alcohol, screens, sugar…"
            aria-label="Search topics"
            className="h-12 rounded-full border-input bg-surface/60 pl-11 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const on = active === f;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={cn(
                  "relative cursor-pointer rounded-full px-4 py-2 text-sm transition-colors duration-300",
                  on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="cat-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)]"
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.p
        key={filtered.length}
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-sm text-muted-foreground"
      >
        {filtered.length} {filtered.length === 1 ? "area" : "areas"}
      </motion.p>

      <motion.div
        layout
        variants={containerVariants}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((a) => (
            <motion.div
              key={a.slug}
              layout
              variants={itemVariants}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              {...(reduce ? {} : { exit: { opacity: 0, scale: 0.96 } })}
              transition={spring}
            >
              <TiltCard className="glass-panel h-full">
                <Link
                  to="/addictions/$slug"
                  params={{ slug: a.slug }}
                  className="flex h-full flex-col p-6"
                >
                  <span className="inline-flex w-fit rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {a.category}
                  </span>
                  <h3 className="mt-4 flex items-start justify-between gap-3 text-lg font-semibold">
                    {a.name}
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.tagline}</p>
                  <span className="mt-auto pt-5 text-xs font-medium text-primary">
                    {a.questions.length} questions · ~3 min
                  </span>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="glass-panel mt-6 rounded-3xl p-10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Nothing matches “{query}”. Try a broader word.
          </p>
        </motion.div>
      )}
    </Page>
  );
}
