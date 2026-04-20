#!/usr/bin/env node
// scripts/import/migrate-v1-to-v2.js
//
// One-time migration script: V1 canonical deck → V2 canonical deck.
//
// Reads:  data/decks/canonical/japanese_mission_deck_canonical_v1_fresh.json
// Writes: data/decks/canonical/japanese_mission_deck_canonical_v2.json
//
// What this script does:
//   - Preserves all existing V1 fields exactly (IDs, categories, content)
//   - Adds trip_phase to every card using the default category mapping
//   - Does NOT add simple_explanation, example_romaji, or distractors
//     (those fields remain absent until authored via the V2 authoring workflow)
//   - Updates canonical_format_version to "2.0"
//   - Recalculates notes_total
//
// Default trip_phase mapping (per approved Phase 3 spec):
//   foundation          → pre-trip
//   relationship        → daily-life
//   navigation_survival → arrival
//   ministry            → ministry
//
// This mapping is a starting point. Cards can be corrected during authoring.
// The script is deterministic — running it twice produces identical output.
//
// Usage:
//   node scripts/import/migrate-v1-to-v2.js

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

const V1_PATH = resolve(repoRoot, "data/decks/canonical/japanese_mission_deck_canonical_v1_fresh.json");
const V2_PATH = resolve(repoRoot, "data/decks/canonical/japanese_mission_deck_canonical_v2.json");

// Default trip_phase mapping from V1 category
const CATEGORY_TO_TRIP_PHASE = {
  foundation:          "pre-trip",
  relationship:        "daily-life",
  navigation_survival: "arrival",
  ministry:            "ministry",
};

function migrateNote(note) {
  // Preserve all existing V1 fields exactly.
  // Add trip_phase using the default mapping.
  // Do NOT add simple_explanation, example_romaji, or distractors —
  // those remain absent until authored.
  const tripPhase = CATEGORY_TO_TRIP_PHASE[note.category];
  if (!tripPhase) {
    throw new Error(
      `Unknown category "${note.category}" on card ${note.id}. ` +
      `Cannot assign default trip_phase. Update CATEGORY_TO_TRIP_PHASE mapping.`
    );
  }
  return {
    ...note,
    trip_phase: tripPhase,
  };
}

function migrate() {
  console.log("37NDEST — V1 → V2 canonical deck migration");
  console.log(`Reading: ${V1_PATH}`);

  const raw = readFileSync(V1_PATH, "utf-8");
  const v1 = JSON.parse(raw);

  if (!Array.isArray(v1.notes)) {
    throw new Error("V1 deck has no notes array. Aborting.");
  }

  console.log(`Found ${v1.notes.length} notes in V1 deck.`);

  const migratedNotes = v1.notes.map((note, i) => {
    try {
      return migrateNote(note);
    } catch (err) {
      throw new Error(`Error migrating note at index ${i}: ${err.message}`);
    }
  });

  const v2 = {
    ...v1,
    canonical_format_version: "2.0",
    notes_total: migratedNotes.length,
    notes: migratedNotes,
  };

  const output = JSON.stringify(v2, null, 2);
  writeFileSync(V2_PATH, output, "utf-8");

  console.log(`Migration complete. ${migratedNotes.length} notes written.`);
  console.log(`Output: ${V2_PATH}`);
  console.log("");
  console.log("Next step: run 'npm run validate-deck' to verify the V2 deck.");
}

migrate();
