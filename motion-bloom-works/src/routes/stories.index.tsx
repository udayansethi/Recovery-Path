import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Quote, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Page, SectionHeading } from "@/components/site/page";
import { categories, type Category, getAllStories } from "@/data/addictions";
import { Reveal, TiltCard, spring } from "@/lib/motion";
import { useBookmarks } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title: "Recovery stories — real days, real change" },
      {
        name: "description",
        content:
          "Short first-person notes from people rebuilding habits — across alcohol, nicotine, screens, gambling, sugar and more.",
      },
      { property: "og:title", content: "Recovery stories — real days, real change" },
      {
        property: "og:description",
        content: "First-person notes from people rebuilding their habits, one day at a time.",
      },
    ],
  }),
  component: StoriesPage,
});

type FilterType = Category | "All" | "Bookmarked";

function StoriesPage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<FilterType>("All");
  const [query, setQuery] = useState("");
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const allStories = useMemo(() => getAllStories(), []);

  const stories = useMemo(() => {
    return allStories.filter((s) => {
      if (active === "Bookmarked" && !isBookmarked(s.key)) return false;
      if (active !== "All" && active !== "Bookmarked" && s.category !== active) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          s.text.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allStories, active, query, isBookmarked]);

  const filters: FilterType[] = ["All", ...categories, "Bookmarked"];

  return (
    <Page>
      <SectionHeading
        eyebrow="Stories"
        title="Days counted by people, not by charts"
        subtitle="No hero arcs — just honest notes from the middle of the work."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    layoutId="story-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)]"
                  />
                )}
                <span className="relative">
                  {f === "Bookmarked" ? "Saved stories" : f}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories or authors..."
            className="w-full rounded-full border border-border bg-surface/60 py-2 pr-4 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <motion.div layout className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {stories.map((s, i) => {
          const bookmarked = isBookmarked(s.key);
          return (
            <motion.div
              key={s.key}
              layout
              initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...spring, delay: Math.min(i * 0.03, 0.4) }}
              className="mb-4 break-inside-avoid"
            >
              <TiltCard className="glass-panel" intensity={5}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <Quote className="size-5 text-primary/70" />
                    <button
                      type="button"
                      onClick={() => {
                        toggleBookmark(s.key);
                        toast(bookmarked ? "Removed from saved" : "Saved story to library");
                      }}
                      aria-label={bookmarked ? "Unsave story" : "Save story"}
                      className={cn(
                        "grid size-8 cursor-pointer place-items-center rounded-full transition-colors",
                        bookmarked
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="size-4" />
                      ) : (
                        <Bookmark className="size-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{s.author}</span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 tabular-nums text-muted-foreground">
                      day {s.days}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <Link
                      to="/addictions/$slug"
                      params={{ slug: s.slug }}
                      className="text-xs font-medium text-primary transition-colors hover:text-primary-glow"
                    >
                      {s.topic} →
                    </Link>

                    <Link
                      to="/stories/$key"
                      params={{ key: s.key }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 hover:text-primary-glow transition-all"
                    >
                      <Sparkles className="size-3 text-primary" />
                      <span>AI Takeaways →</span>
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>

      {stories.length === 0 && (
        <div className="glass-panel mt-6 rounded-3xl p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {active === "Bookmarked"
              ? "No saved stories yet. Bookmark stories you'd like to revisit during difficult moments."
              : "No stories matching your search filter."}
          </p>
        </div>
      )}

      <Reveal className="mt-12">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Your day one can be today. Start with a two-minute self-check.
          </p>
          <Link
            to="/addictions"
            className="mt-5 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Explore areas
          </Link>
        </div>
      </Reveal>
    </Page>
  );
}
