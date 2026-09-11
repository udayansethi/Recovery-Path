import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Copy,
  HeartHandshake,
  Loader2,
  Quote,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Page, SectionHeading } from "@/components/site/page";
import { Button } from "@/components/ui/button";
import {
  getStoryByKey,
  getAllStories,
  type EnrichedStory,
  addictions,
} from "@/data/addictions";
import { Reveal, TiltCard, spring } from "@/lib/motion";
import { useBookmarks } from "@/lib/store";
import { getStoryTakeaways } from "@/lib/ai-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stories/$key")({
  loader: ({ params }) => {
    const story = getStoryByKey(params.key);
    if (!story) {
      throw notFound();
    }
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.story) {
      return {
        meta: [
          { title: "Story Not Found — Recovery Path" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { story } = loaderData;
    const title = `${story.author}'s Story & AI Takeaways (${story.topic}) — Recovery Path`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Lived recovery experience from ${story.author} (Day ${story.days}) for ${story.topic}, plus AI-distilled recovery takeaways and coping strategies.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: story.text },
      ],
    };
  },
  component: StoryTakeawaysPage,
  notFoundComponent: StoryNotFoundComponent,
});

function StoryNotFoundComponent() {
  return (
    <Page>
      <div className="mx-auto max-w-lg text-center py-16">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
          <Compass className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">Story not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The story you are looking for may have been moved or updated.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="hero">
            <Link to="/stories">Browse all stories</Link>
          </Button>
          <Button asChild variant="glass">
            <Link to="/addictions">Explore areas</Link>
          </Button>
        </div>
      </div>
    </Page>
  );
}

function StoryTakeawaysPage() {
  const { story } = Route.useLoaderData();
  const reduce = useReducedMotion();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const [takeaways, setTakeaways] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const bookmarked = isBookmarked(story.key);

  // Fetch AI takeaways on mount or story change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setTakeaways(null);

    async function fetchTakeaways() {
      try {
        const result = await getStoryTakeaways({
          story_content: story.text,
          addiction_name: story.topic,
        });
        if (isMounted) {
          setTakeaways(result.takeaways);
        }
      } catch (err) {
        if (isMounted) {
          toast.error("Could not fetch AI takeaways right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTakeaways();

    return () => {
      isMounted = false;
    };
  }, [story.key, story.text, story.topic]);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const result = await getStoryTakeaways({
        story_content: story.text,
        addiction_name: story.topic,
      });
      setTakeaways(result.takeaways);
      toast.success("Regenerated recovery insights!");
    } catch {
      toast.error("Failed to regenerate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTakeaways = async () => {
    if (!takeaways) return;
    try {
      await navigator.clipboard.writeText(takeaways);
      setCopied(true);
      toast.success("AI Takeaways copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  const handleCopyStoryLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Story link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  // Find related stories from same or similar categories
  const relatedStories = useMemo(() => {
    const all = getAllStories();
    return all
      .filter((s) => s.key !== story.key && (s.slug === story.slug || s.category === story.category))
      .slice(0, 3);
  }, [story.key, story.slug, story.category]);

  return (
    <Page>
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to all stories</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            {story.category}
          </span>
          <Link
            to="/addictions/$slug"
            params={{ slug: story.slug }}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <span>{story.topic} Hub</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="mt-8">
        <SectionHeading
          eyebrow="Story & AI Key Takeaways"
          title={`${story.author}'s Journey`}
          subtitle={`Day ${story.days} · Lived experience with ${story.topic} and AI-extracted recovery lessons.`}
        />
      </div>

      {/* Grid Layout: Left = Story, Right = AI Takeaways */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: The Community Story */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="lg:col-span-5"
        >
          <div className="glass-panel sticky top-24 rounded-3xl p-6 sm:p-8 border border-border/80 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Quote className="size-5" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyStoryLink}
                  aria-label="Copy story link"
                  title="Copy link to this story"
                  className="grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {copiedLink ? <Check className="size-4 text-primary" /> : <Share2 className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleBookmark(story.key);
                    toast(bookmarked ? "Removed from saved stories" : "Saved story to library");
                  }}
                  aria-label={bookmarked ? "Unsave story" : "Save story"}
                  title={bookmarked ? "Unsave story" : "Save story"}
                  className={cn(
                    "grid size-9 cursor-pointer place-items-center rounded-full transition-colors",
                    bookmarked
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {bookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                </button>
              </div>
            </div>

            <blockquote className="mt-6 text-base leading-relaxed text-foreground/90 font-normal italic">
              “{story.text}”
            </blockquote>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
              <div>
                <p className="font-semibold text-foreground text-sm">{story.author}</p>
                <p className="text-muted-foreground text-[11px]">{story.topic} Recovery</p>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1.5 font-mono text-xs font-medium text-primary">
                Day {story.days} clean
              </span>
            </div>

            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Explore related tools:</p>
              <div className="flex flex-col gap-2">
                <Button asChild variant="glass" size="sm" className="w-full justify-start text-xs">
                  <Link to="/addictions/$slug" params={{ slug: story.slug }}>
                    <Compass className="mr-2 size-3.5 text-primary" />
                    Take 2-min {story.topic} Self-Assessment
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/dashboard">
                    <HeartHandshake className="mr-2 size-3.5 text-primary" />
                    Log Daily Mood & Check-In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: AI Key Takeaways */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-primary/30 bg-surface/80 shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-sm">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    AI Distilled Recovery Wisdom
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Actionable strategies & trigger defusal extracted from {story.author}'s experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  title="Regenerate takeaways with Hope AI"
                >
                  <RotateCcw className={cn("size-3.5 mr-1.5", loading && "animate-spin")} />
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyTakeaways}
                  disabled={loading || !takeaways}
                  className="h-8 px-3 text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 mr-1.5 text-primary" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 mr-1.5" />
                      Copy Takeaways
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Takeaways Content Area */}
            <div className="mt-6">
              {loading ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="size-12 rounded-full bg-primary/20 animate-ping absolute inset-0" />
                    <div className="size-12 rounded-full bg-primary/15 grid place-items-center text-primary relative">
                      <Loader2 className="size-6 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Distilling recovery wisdom with Hope AI...
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                      Analyzing trigger patterns, cognitive shifts, and daily micro-habits from this story.
                    </p>
                  </div>
                </div>
              ) : takeaways ? (
                <div className="space-y-4">
                  <div className="prose-sm rounded-2xl bg-secondary/50 p-5 sm:p-6 text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-line border border-border/70 shadow-inner">
                    {takeaways}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 border border-primary/15 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-4 shrink-0 text-primary" />
                    <span>
                      Generated by Hope AI Engine · Evidence-informed recovery principles · Confidential educational guidance
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Unable to load AI takeaways. Click refresh above to try again.
                  </p>
                  <Button variant="hero" size="sm" onClick={handleRegenerate} className="mt-4">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Stories Carousel/Grid */}
      {relatedStories.length > 0 && (
        <Reveal className="mt-16 border-t border-border/60 pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">More recovery voices</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Explore additional lived experiences in {story.topic} and {story.category} habits.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/stories">View all stories →</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedStories.map((s) => (
              <TiltCard key={s.key} className="glass-panel" intensity={4}>
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{s.author}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 tabular-nums">
                        day {s.days}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      “{s.text}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.topic}</span>
                    <Link
                      to="/stories/$key"
                      params={{ key: s.key }}
                      className="font-medium text-primary hover:text-primary-glow inline-flex items-center gap-1"
                    >
                      <Sparkles className="size-3" />
                      Takeaways →
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      )}
    </Page>
  );
}
