import { useCallback, useEffect, useState } from "react";

export type Result = {
  id: string;
  slug: string;
  name: string;
  total: number;
  band: "low" | "medium" | "high";
  answers: number[];
  date: string;
};

export type CheckIn = {
  date: string;
  mood: number;
  urges: number;
  triggers?: string[];
  notes?: string;
};

export type Goal = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
};

const RESULTS_KEY = "rp.results.v1";
const CHECKINS_KEY = "rp.checkins.v1";
const GOALS_KEY = "rp.goals.v1";
const BOOKMARKS_KEY = "rp.bookmarks.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("rp:storage"));
  } catch {
    /* ignore */
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setHydrated(true);
    const sync = () => setValue(read<T>(key, fallback));
    window.addEventListener("rp:storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("rp:storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((current) => {
        const computed = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
        write(key, computed);
        return computed;
      });
    },
    [key],
  );

  return { value, update, hydrated };
}

export function useResults() {
  const { value, update, hydrated } = useStored<Result[]>(RESULTS_KEY, []);
  const add = useCallback(
    (result: Omit<Result, "id" | "date">) => {
      update((prev) => [
        { ...result, id: crypto.randomUUID(), date: new Date().toISOString() },
        ...prev,
      ]);
    },
    [update],
  );
  const clear = useCallback(() => update([]), [update]);
  return { results: value, add, clear, hydrated };
}

export function useCheckIns() {
  const { value, update, hydrated } = useStored<CheckIn[]>(CHECKINS_KEY, []);
  const record = useCallback(
    (mood: number, urges: number, triggers?: string[], notes?: string) => {
      const today = new Date().toISOString().slice(0, 10);
      update((prev) => {
        const rest = prev.filter((c) => c.date !== today);
        return [{ date: today, mood, urges, triggers, notes }, ...rest].slice(0, 30);
      });
    },
    [update],
  );
  const clear = useCallback(() => update([]), [update]);
  return { checkIns: value, record, clear, hydrated };
}

const DEFAULT_GOALS: Goal[] = [
  {
    id: "default-1",
    title: "Practice 3-minute 4-7-8 breathing when a craving hits",
    category: "Mindset",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "Log daily mood and urge levels before bedtime",
    category: "Habit",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-3",
    title: "Identify my top 2 emotional craving triggers this week",
    category: "Awareness",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export function useGoals() {
  const { value, update, hydrated } = useStored<Goal[]>(GOALS_KEY, DEFAULT_GOALS);

  const addGoal = useCallback(
    (title: string, category: string = "Personal") => {
      if (!title.trim()) return;
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      update((prev) => [newGoal, ...prev]);
    },
    [update],
  );

  const toggleGoal = useCallback(
    (id: string) => {
      update((prev) =>
        prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
      );
    },
    [update],
  );

  const deleteGoal = useCallback(
    (id: string) => {
      update((prev) => prev.filter((g) => g.id !== id));
    },
    [update],
  );

  return { goals: value, addGoal, toggleGoal, deleteGoal, hydrated };
}

export function useBookmarks() {
  const { value, update, hydrated } = useStored<string[]>(BOOKMARKS_KEY, []);

  const toggleBookmark = useCallback(
    (storyKey: string) => {
      update((prev) =>
        prev.includes(storyKey) ? prev.filter((k) => k !== storyKey) : [...prev, storyKey],
      );
    },
    [update],
  );

  const isBookmarked = useCallback(
    (storyKey: string) => value.includes(storyKey),
    [value],
  );

  return { bookmarks: value, toggleBookmark, isBookmarked, hydrated };
}
