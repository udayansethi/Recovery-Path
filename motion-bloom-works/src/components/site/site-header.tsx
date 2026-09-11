import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { Menu, X, Compass, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { SOSModal } from "./sos-modal";

const links = [
  { to: "/", label: "Home" },
  { to: "/addictions", label: "Explore" },
  { to: "/stories", label: "Stories" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  return (
    <>
      <header className="sticky top-0 z-50">
        <motion.div
          className="fixed inset-x-0 top-0 h-0.5 origin-left bg-[image:var(--gradient-primary)]"
          style={{ scaleX: reduce ? 1 : progress }}
        />
        <div className="glass-panel mx-auto mt-3 flex w-[min(1120px,94vw)] items-center justify-between rounded-full px-4 py-2.5">
          <Link to="/" className="group flex items-center gap-2.5">
            <motion.span
              {...(reduce ? {} : { whileHover: { rotate: 90, scale: 1.08 } })}
              transition={spring}
              className="grid size-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground"
            >
              <Compass className="size-4.5" />
            </motion.span>
            <span className="font-display text-base font-semibold tracking-tight">
              Recovery&nbsp;Path
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-secondary/80"
                      transition={spring}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <button
              type="button"
              onClick={() => setSosOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-3.5 py-1.5 text-xs font-semibold text-destructive shadow-sm transition-all duration-300 hover:scale-105 hover:bg-destructive/25"
            >
              <ShieldAlert className="size-3.5" />
              <span>SOS Assist</span>
            </button>

            <Link
              to="/addictions"
              className="rounded-full bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start a check
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setSosOpen(true)}
              className="flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-1.5 text-xs font-semibold text-destructive"
            >
              <ShieldAlert className="size-3.5" />
              <span>SOS</span>
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={spring}
                >
                  {open ? <X className="size-4" /> : <Menu className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={spring}
              className="glass-panel mx-auto mt-2 w-[min(1120px,94vw)] overflow-hidden rounded-3xl md:hidden"
            >
              <div className="flex flex-col p-2">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
