#!/usr/bin/env node
// scripts/validation/validate-deck.js
//
// Manual validation script for the V2 canonical deck.
// Run via: npm run validate-deck
//
// Validates: data/decks/canonical/japanese_mission_deck_canonical_v2.json
//
// What this script checks:
//   - Required fields present on every card (id, japanese, romaji, english,
//     category, trip_phase)
//   - Valid category enum values (V1 internal taxonomy)
//   - Valid trip_phase enum values
//   - No duplicate IDs
//   - distractors count exactly 2 when present
//   - Example triple rule for newly authored V2 cards:
//       if example_romaji is present, example_japanese and example_english
//       must also be present.
//       Legacy migrated cards (example_japanese/english without example_romaji)
//       are accepted.
//   - ID format: MJD-NNN pattern or lowercase kebab slug
//
// Reports ALL failures before exiting. Does not stop at first error.
// Exit code 0 = clean. Exit code 1 = one or more violations found.

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const DECK_PATH = resolve(repoRoot, "data/decks/canonical/japanese_mission_deck_canonical_v2.json");

const VALID_CATEGORIES = new Set([
  "foundation",
  "relationship",
  "navigation_survival",
  "ministry",
]);

const VALID_TRIP_PHASES = new Set([
  "pre-trip",
  "arrival",
  "ministry",
  "daily-life",
]);

// Accepts MJD-NNN, MJD-NNN-N (split cards), or lowercase kebab slug (3+ chars)
const ID_PATTERN = /^(MJD-[0-9]{3,}(-[0-9]+)?|[a-z][a-z0-9-]{2,})$/;

function validateDeck(deck) {
  const errors = [];
  const seenIds = new Map(); // id → first index

  if (!Array.isArray(deck.notes)) {
    errors.push("[DECK] notes field is missing or not an array.");
    return errors;
  }

  for (let i = 0; i < deck.notes.length; i++) {
    const note = deck.notes[i];
    const label = note.id ? `[CARD ${note.id}]` : `[CARD at index ${i}]`;

    // Required fields
    const requiredFields = ["id", "japanese", "romaji", "english", "category", "trip_phase"];
    for (const field of requiredFields) {
      if (note[field] === undefined || note[field] === null || note[field] === "") {
        errors.push(`${label} Missing required field: ${field}`);
      }
    }

    // ID format
    if (typeof note.id === "string" && note.id.length > 0) {
      if (!ID_PATTERN.test(note.id)) {
        errors.push(
          `${label} Invalid id format: "${note.id}". ` +
          `Must match MJD-NNN pattern or lowercase kebab slug (3+ chars).`
        );
      }
      // Duplicate ID check
      if (seenIds.has(note.id)) {
        errors.push(
          `${label} Duplicate id: "${note.id}" also appears at index ${seenIds.get(note.id)}.`
        );
      } else {
        seenIds.set(note.id, i);
      }
    }

    // Category enum
    if (typeof note.category === "string" && !VALID_CATEGORIES.has(note.category)) {
      errors.push(
        `${label} Invalid category: "${note.category}". ` +
        `Must be one of: ${[...VALID_CATEGORIES].join(", ")}`
      );
    }

    // trip_phase enum
    if (typeof note.trip_phase === "string" && !VALID_TRIP_PHASES.has(note.trip_phase)) {
      errors.push(
        `${label} Invalid trip_phase: "${note.trip_phase}". ` +
        `Must be one of: ${[...VALID_TRIP_PHASES].join(", ")}`
      );
    }

    // distractors: if present, must be exactly 2
    if (note.distractors !== undefined && note.distractors !== null) {
      if (!Array.isArray(note.distractors) || note.distractors.length !== 2) {
        const count = Array.isArray(note.distractors) ? note.distractors.length : "non-array";
        errors.push(
          `${label} distractors must be an array of exactly 2 strings, got ${count}.`
        );
      }
    }

    // Example triple rule (applies to newly authored V2 cards only):
    // If example_romaji is present, example_japanese and example_english must also be present.
    // Legacy migrated cards (example_japanese/english without example_romaji) are accepted.
    if (note.example_romaji !== undefined && note.example_romaji !== null) {
      const hasJp = note.example_japanese !== undefined && note.example_japanese !== null;
      const hasEn = note.example_english !== undefined && note.example_english !== null;
      if (!hasJp || !hasEn) {
        errors.push(
          `${label} Incomplete example triple: example_romaji is present but ` +
          `${!hasJp ? "example_japanese" : "example_english"} is missing.`
        );
      }
    }
  }

  return errors;
}

function main() {
  console.log("37NDEST — V2 canonical deck validation");
  console.log(`Validating: ${DECK_PATH}`);
  console.log("");

  let raw;
  try {
    raw = readFileSync(DECK_PATH, "utf-8");
  } catch (err) {
    console.error(`ERROR: Could not read deck file: ${err.message}`);
    console.error("Has the migration script been run? Try: node scripts/import/migrate-v1-to-v2.js");
    process.exit(1);
  }

  let deck;
  try {
    deck = JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR: Deck file is not valid JSON: ${err.message}`);
    process.exit(1);
  }

  const errors = validateDeck(deck);

  if (errors.length === 0) {
    const noteCount = Array.isArray(deck.notes) ? deck.notes.length : 0;
    console.log(`✓ Validation passed. ${noteCount} cards checked. No violations found.`);
    process.exit(0);
  } else {
    console.error(`✗ Validation failed. ${errors.length} violation(s) found:\n`);
    for (const err of errors) {
      console.error(`  ${err}`);
    }
    console.error("");
    process.exit(1);
  }
}

main();
