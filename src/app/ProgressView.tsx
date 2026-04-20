// src/app/ProgressView.tsx
//
// Progress dashboard surface for 37NDEST spec 010.
// Reads from existing cardConfidence table and canonical deck.
// No writes. No new data structures. No analytics.

import { useState, useEffect } from "react";
import { db } from "../db/db";
import { tryGetCanonicalDeck } from "../features/deck-import/deckContent";
import type { ConfidenceRecord } from "../types/db";

type ProgressViewProps = {
  activeProfileId: string | null;
};

type Status = "loading" | "ready" | "error" | "no-profile";

type ProgressData = {
  totalCards: number;
  reviewedCount: number;
  strongCount: number;
  learningCount: number;
  needsReviewCount: number;
  categories: CategoryRow[];
};

type CategoryRow = {
  label: string;
  reviewed: number;
  total: number;
};

const CATEGORY_DISPLAY: Record<string, string> = {
  relationship:        "greetings",
  foundation:          "foundation",
  navigation_survival: "travel",
  ministry:            "church",
};

const CATEGORY_ORDER = ["relationship", "foundation", "navigation_survival", "ministry"];

function deriveProgress(
  records: ConfidenceRecord[],
  notes: { id: string; category?: string }[]
): ProgressData {
  const totalCards = notes.length;

  // Cards with a ConfidenceRecord (lastReviewedAt > 0 means actually reviewed)
  const reviewedCardIds = new Set(
    records.filter((r) => r.lastReviewedAt > 0).map((r) => r.cardId)
  );
  const reviewedCount = reviewedCardIds.size;

  // Confidence buckets — only reviewed cards
  let strongCount = 0;
  let learningCount = 0;
  let needsReviewCount = 0;
  for (const r of records) {
    if (!reviewedCardIds.has(r.cardId)) continue;
    if (r.confidenceScore >= 8) strongCount++;
    else if (r.confidenceScore >= 4) learningCount++;
    else needsReviewCount++;
  }

  // Category glimpse — top 5 by reviewed count, omit zero-reviewed
  const catMap: Record<string, { reviewed: number; total: number }> = {};
  for (const cat of CATEGORY_ORDER) {
    catMap[cat] = { reviewed: 0, total: 0 };
  }
  for (const note of notes) {
    const cat = note.category;
    if (!cat || !catMap[cat]) continue;
    catMap[cat].total++;
    if (reviewedCardIds.has(note.id)) catMap[cat].reviewed++;
  }

  const categories: CategoryRow[] = CATEGORY_ORDER
    .filter((cat) => catMap[cat].total > 0)
    .map((cat) => ({
      label: CATEGORY_DISPLAY[cat] ?? cat,
      reviewed: catMap[cat].reviewed,
      total: catMap[cat].total,
    }))
    .sort((a, b) => b.reviewed - a.reviewed)
    .slice(0, 5);

  return { totalCards, reviewedCount, strongCount, learningCount, needsReviewCount, categories };
}

function Bar({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div
      style={{
        height: "6px",
        backgroundColor: "var(--paper-deep)",
        borderRadius: "3px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${clamped}%`,
          backgroundColor: color,
          borderRadius: "3px",
          transition: "width 300ms ease-in-out",
        }}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-inter uppercase mb-3"
      style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--ink-faint)" }}
    >
      {children}
    </p>
  );
}

export function ProgressView({ activeProfileId }: ProgressViewProps) {
  const [status, setStatus] = useState<Status>(activeProfileId ? "loading" : "no-profile");
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (!activeProfileId) {
      setStatus("no-profile");
      setData(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");

    async function load() {
      try {
        const contentResult = tryGetCanonicalDeck();
        if (!contentResult.ok) {
          if (!cancelled) setStatus("error");
          return;
        }
        const records = await db.cardConfidence
          .where("profileId")
          .equals(activeProfileId!)
          .toArray();
        if (cancelled) return;
        const derived = deriveProgress(records, contentResult.deck.notes);
        setData(derived);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeProfileId]);

  // ── No profile ───────────────────────────────────────────────────────────
  if (status === "no-profile") {
    return (
      <section
        className="flex flex-1 flex-col items-center justify-center px-8 pb-24"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <p className="font-source-serif text-base text-center" style={{ color: "var(--ink-muted)" }}>
          Select a profile on the home screen to see your progress.
        </p>
      </section>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === "loading" || !data) {
    return (
      <section
        className="flex flex-1 flex-col pb-24"
        style={{ backgroundColor: "var(--paper)" }}
      />
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <section
        className="flex flex-1 flex-col items-center justify-center px-8 pb-24"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <p className="font-source-serif text-base text-center" style={{ color: "var(--ink-muted)" }}>
          Could not load progress data.
        </p>
      </section>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────────────────
  const overallPct = data.totalCards > 0 ? (data.reviewedCount / data.totalCards) * 100 : 0;

  return (
    <section
      className="flex flex-1 flex-col px-6 pt-6 pb-24 overflow-y-auto"
      style={{ backgroundColor: "var(--paper)" }}
    >
      {/* Callsign */}
      <p
        className="mb-6 font-inter text-xs uppercase tracking-widest"
        style={{ color: "var(--bengara)" }}
      >
        37NDEST · 進捗
      </p>

      {/* ── Overall progress ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel>Your journey</SectionLabel>
        <Bar pct={overallPct} color="var(--bengara)" />
        <p
          className="mt-2 font-source-serif text-sm"
          style={{ color: "var(--ink-muted)" }}
        >
          {data.reviewedCount} of {data.totalCards} cards reviewed
        </p>
        {data.reviewedCount > 0 && data.totalCards > 0 && (() => {
          const frac = data.reviewedCount / data.totalCards;
          const sentence =
            frac < 0.25 ? "You're getting started. Every card counts." :
            frac < 0.5  ? "Good momentum. Keep going." :
            frac < 0.75 ? "More than halfway. Sapporo is getting closer." :
                          "Almost there. You've put in real work.";
          return (
            <p
              className="mt-1 font-source-serif italic text-sm"
              style={{ color: "var(--ink-faint)" }}
            >
              {sentence}
            </p>
          );
        })()}
      </div>

      {/* ── Confidence buckets ───────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel>How it's going</SectionLabel>
        <div className="space-y-3">
          {[
            { label: "Strong", count: data.strongCount },
            { label: "Learning", count: data.learningCount },
            { label: "Needs review", count: data.needsReviewCount },
          ].map(({ label, count }) => (
            <div key={label} className="flex items-baseline justify-between">
              <span
                className="font-source-serif text-base"
                style={{ color: "var(--ink-muted)" }}
              >
                {label}
              </span>
              <span
                className="font-source-serif text-base tabular-nums"
                style={{ color: "var(--ink)" }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category glimpse ─────────────────────────────────────────────── */}
      {data.categories.length > 0 && (
        <div className="mb-8">
          <SectionLabel>Where you're working</SectionLabel>
          <div className="space-y-4">
            {data.categories.map((cat, index) => {
              const pct = cat.total > 0 ? (cat.reviewed / cat.total) * 100 : 0;
              const isActive = index === 0 && data.reviewedCount > 0 && cat.reviewed > 0;
              return (
                <div key={cat.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span
                      className="font-source-serif text-sm capitalize"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {cat.label}
                      {isActive && (
                        <span
                          className="ml-2 font-inter uppercase"
                          style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--bengara)" }}
                        >
                          active
                        </span>
                      )}
                    </span>
                    <span
                      className="font-inter text-xs tabular-nums"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {cat.reviewed}/{cat.total}
                    </span>
                  </div>
                  <Bar pct={pct} color="var(--ink)" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state prompt ───────────────────────────────────────────── */}
      {data.reviewedCount === 0 && (
        <p
          className="font-source-serif italic text-sm text-center mt-2"
          style={{ color: "var(--ink-faint)" }}
        >
          Start a session to begin tracking your progress.
        </p>
      )}
    </section>
  );
}
