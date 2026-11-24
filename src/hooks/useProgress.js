import { useState, useCallback } from 'react';

const STORAGE_KEY = 'tcm_progress';
const XP_PER_LEVEL = 100;

// ── Badge definitions ────────────────────────────────────────────────────────
const BADGE_RULES = [
  { id: 'first_lesson',  labelHe: 'הצעד הראשון',   labelEn: 'First Step',    icon: 'star',   check: ({ completedLessons }) => completedLessons.length >= 1 },
  { id: 'wood_master',   labelHe: 'מאסטר עץ',      labelEn: 'Wood Master',   icon: 'award',  check: ({ completedLessons }) => ['liver_intro','liver_points','gb_intro'].every(id => completedLessons.includes(id)) },
  { id: 'fire_master',   labelHe: 'מאסטר אש',      labelEn: 'Fire Master',   icon: 'award',  check: ({ completedLessons }) => ['heart_intro','heart_shen','si_intro'].every(id => completedLessons.includes(id)) },
  { id: 'week_streak',   labelHe: 'שבוע רצף',      labelEn: 'Week Streak',   icon: 'fire',   check: ({ streak })           => streak.count >= 7 },
  { id: 'xp_100',        labelHe: 'מאה נקודות',    labelEn: '100 XP',        icon: 'bolt',   check: ({ xp })               => xp >= 100 },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function localDateISO(d = new Date()) {
  // Use local date parts — toISOString() returns UTC which breaks streak near midnight
  const y  = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${dy}`;
}

function todayISO()     { return localDateISO(); }
function yesterdayISO() { const d = new Date(); d.setDate(d.getDate() - 1); return localDateISO(d); }

// ── Normalize raw storage to the canonical shape ──────────────────────────────
function normalize(raw) {
  return {
    xp:               raw.xp               ?? raw.totalXP ?? 0,
    level:            raw.level            ?? Math.floor((raw.totalXP ?? 0) / XP_PER_LEVEL) + 1,
    streak:           raw.streak           ?? { count: raw.streak ?? 0, lastDate: raw.lastDay ?? null },
    completedLessons: raw.completedLessons ?? Object.keys(raw.completed ?? {}),
    badges:           raw.badges           ?? [],
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useProgress() {
  const [progress, setProgress] = useState(() => normalize(load()));

  // Update state + localStorage atomically
  const commit = useCallback((updater) => {
    setProgress((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  // ── addXP ────────────────────────────────────────────────────────────────
  const addXP = useCallback((amount = 10) => {
    commit((prev) => {
      const xp    = prev.xp + amount;
      const level = Math.floor(xp / XP_PER_LEVEL) + 1;
      return { ...prev, xp, level };
    });
  }, [commit]);

  // ── completeLesson ────────────────────────────────────────────────────────
  const completeLesson = useCallback((id) => {
    commit((prev) => {
      if (prev.completedLessons.includes(id)) return prev;

      const today   = todayISO();
      const { count, lastDate } = prev.streak;
      const newCount =
        lastDate === today      ? count :
        lastDate === yesterdayISO() ? count + 1 : 1;

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, id],
        streak: { count: newCount, lastDate: today },
      };
    });
  }, [commit]);

  // ── checkAndAwardBadge ────────────────────────────────────────────────────
  const checkAndAwardBadge = useCallback((trigger) => {
    commit((prev) => {
      const now      = todayISO();
      const existing = new Set(prev.badges.map((b) => b.id));
      const earned   = BADGE_RULES
        .filter((r) => !existing.has(r.id) && r.check(prev))
        .map((r) => ({ id: r.id, earnedAt: now }));

      if (!earned.length) return prev;
      return { ...prev, badges: [...prev.badges, ...earned] };
    });
  }, [commit]);

  // Derived convenience values
  const xpInLevel   = progress.xp % XP_PER_LEVEL;
  const isCompleted = (id) => progress.completedLessons.includes(id);

  return {
    xp:               progress.xp,
    level:            progress.level,
    xpInLevel,
    XP_PER_LEVEL,
    streak:           progress.streak,
    completedLessons: progress.completedLessons,
    badges:           progress.badges,
    addXP,
    completeLesson,
    checkAndAwardBadge,
    isCompleted,
    BADGE_RULES,
  };
}
