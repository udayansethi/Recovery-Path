import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionTemplate,
  type Transition,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

/** Shared motion language ------------------------------------------------ */

export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 20,
};

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
};

export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

/** Staggered group that animates on mount. */
export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      animate="show"
      transition={{ delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

/** Item inside a Stagger group. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as: _as,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: never;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered stagger container. */
export function RevealStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/** Cursor-reactive tilt + spotlight card. */
export function TiltCard({
  children,
  className,
  intensity = 6,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), softSpring);
  const ry = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), softSpring);
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(240px circle at ${glowX} ${glowY}, color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      {...(onClick ? { onClick } : {})}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      {...(reduce
        ? {}
        : {
            style: { rotateX: rx, rotateY: ry, transformPerspective: 900 },
            whileHover: { y: -6, scale: 1.012 },
          })}
      transition={spring}
      className={cn("group relative overflow-hidden rounded-2xl", className)}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}
      <div className="relative" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

/** Number that springs to its value. */
export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useSpring(reduce ? value : 0, { stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => mv.on("change", (v) => setDisplay(v)), [mv]);

  return <span className={className}>{display.toFixed(decimals)}</span>;
}

export { motion, useReducedMotion };
