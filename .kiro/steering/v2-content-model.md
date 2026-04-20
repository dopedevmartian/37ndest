# 37NDEST V2 Content Model

## Purpose

This file is the authoritative source for the V2 card schema, authoring
workflow, and validation rules. Any agent working on content migration,
schema validation, or review card rendering must reference this file.

---

## Core Principle

Canonical deck JSON is the trusted source of application content.
It is immutable at runtime. It is never modified by user actions.
It is authored outside the app and versioned in the repository.

There is no in-app card editor. There is no backend. Git is the pipeline.

---

## Card ID Rules

- Existing cards retain their MJD-NNN format IDs unchanged.
- New cards authored under V2 use human-readable slugs.
  Format: {category}-{short-description}
  Example: church-otsukaresama, greetings-ohayou
- IDs are stable. Never reuse or change an ID.
- User progress state keys against card ID. A typo fix to the Japanese
  field must not change the ID.

---

## Category: Internal Storage vs. Display Labels

These are two separate concerns. Do not conflate them.

### Internal category storage (canonical JSON)

The canonical deck uses V1 internal taxonomy values. These are the
values stored in the JSON and validated by the schema:

  foundation, relationship, navigation_survival, ministry

All existing cards retain their V1 internal category values.
New cards authored under V2 also use V1 internal taxonomy values
for canonical storage.

A category migration to new internal values is not approved for V2.
If a migration is approved later, it will be a separate spec with an
explicit decision-log entry.

### Display category labels (UI only)

The app maps internal category values to V2 display vocabulary at
render time. These are the labels shown to the user (e.g., the
category chip on the review card):

  greetings, church, travel, daily

The mapping is applied in the UI layer. It is not stored in the
canonical JSON.

Example mapping (starting point — refine as needed):
  relationship        → greetings
  foundation          → (support content, may not display a chip)
  navigation_survival → travel
  ministry            → church

This mapping is an implementation concern, not a schema concern.
It belongs in the rendering layer, not in the canonical deck.

---

## V2 Card Schema

### Required fields

| Field       | Type          | Notes                                              |
|-------------|---------------|----------------------------------------------------|
| id          | string        | Stable. MJD-NNN for existing, slug for new.        |
| japanese    | string        | The card's Japanese form. Display hero.            |
| romaji      | string        | Required for beginner support.                     |
| english     | string        | Concise meaning, 8 words or fewer.                 |
| category    | string (enum) | Internal taxonomy value. See category section      |
|             |               | above. Stored as V1 values. Displayed via mapping. |
| trip_phase  | enum          | pre-trip / arrival / ministry / daily-life         |

### Strongly recommended fields

| Field               | Type        | Notes                                            |
|---------------------|-------------|--------------------------------------------------|
| simple_explanation  | string      | One sentence, beginner tone, warm. Not           |
|                     |             | dictionary-style. This is where warmth lives.    |
| example_japanese    | string      | Ships as a triple with romaji + english.         |
| example_romaji      | string      | All three or none.                               |
| example_english     | string      | All three or none.                               |
| distractors         | array of 2  | Exactly 2. The correct answer is the third MC    |
|                     |             | option. Never 1, never 3.                        |

### Optional fields

| Field             | Type    | Notes                                              |
|-------------------|---------|----------------------------------------------------|
| usage_note        | string  | Polite vs casual context. Huge for mission use.    |
| literal_breakdown | string  | Word-by-word gloss for curious learners.           |
| audio_url         | string  | Reserved for V3. Do not implement in V2.           |

---

## Field Rules

### simple_explanation
- One sentence only.
- Beginner tone — like a patient friend explaining, not a dictionary.
- Warm and contextual, not clinical.
- Do not add a separate "beginner_hint" field. Fold everything into
  simple_explanation. One field, one voice.

### distractors
- Exactly 2 distractors per card. Never 1, never 3.
- Distractors must be plausible: same grammatical category, similar
  length. Not absurd.
- The correct answer is the third option at runtime — not stored.
- Cards without distractors are excluded from MC modes gracefully.

### example triple
- example_japanese, example_romaji, and example_english must all be
  present or all absent. Partial triples are invalid.
- Examples must use honorific levels appropriate for church and mission
  contexts (polite forms, です/ます).

### trip_phase
- pre-trip: phrases useful before arriving (introductions, basics)
- arrival: phrases useful immediately on arrival (navigation, station)
- ministry: phrases useful in church and ministry contexts
- daily-life: phrases useful in everyday Sapporo interactions

---

## Distractor Quality Rules

Distractors must be plausible to a beginner — they should require
actual knowledge to distinguish from the correct answer.

Good distractor: same grammatical category, similar register, similar
length. A beginner who doesn't know the answer might reasonably pick it.

Bad distractor: obviously wrong, different register, absurd pairing.

Human review of AI-generated distractors is required before committing.

---

## Per-Card-Per-User Progress State

This is separate from canonical content. Stored in IndexedDB per profile.

Shape: { cardId, profileId, seen_count, correct_count,
         incorrect_count, last_seen, bucket }

bucket values:
  0 = Learning
  1 = Familiar
  2 = Strong

This drives:
- Mastery display on the Progress screen
- Recently-missed shelf on Today and Progress screens
- Trip-phase weighting in session selection

This is not SRS. Real SRS is overkill for a 200-card, two-user,
six-month deck. Do not implement SRS without explicit approval.

---

## Trip-Phase Weighting

Session item selection uses a weighted draw:

  weight = base_weight
    * bucketMultiplier(bucket)
    * phaseProximityMultiplier(trip_phase, daysUntilTrip)

bucketMultiplier:
  bucket 0 (Learning)  → 2.0
  bucket 1 (Familiar)  → 1.3
  bucket 2 (Strong)    → 1.0

phaseProximityMultiplier:
  Returns 1.0 when far from the trip.
  Scales up to ~2.5 for arrival and daily-life phases as trip nears.

This is deterministic logic. No ML. No AI at runtime.
The function must accept a today date override for testing.

---

## Authoring Workflow

Cards are authored outside the app using an AI-assisted workflow.

1. Keep a running list of phrases to teach (notes, doc, notebook).
2. Paste 5–10 phrases into Claude or ChatGPT with the authoring prompt.
3. AI returns fully-populated card objects.
4. Review each card by hand:
   - Verify simple_explanation is warm, not dictionary-style.
   - Verify distractors are plausible.
   - Verify examples use appropriate honorific levels.
   - Verify trip_phase assignment makes sense.
   - Assign the correct internal category value (V1 taxonomy).
5. Paste approved cards into the canonical deck JSON.
6. Run validation script. Fix any failures.
7. Commit and push. GitHub Pages redeploys. Both phones get new cards.

Target: ~30 seconds per card with this workflow.

---

## Card Authoring Prompt (Reference)

A starting point. Refine as you use it.

---
You are authoring flashcards for 37NDEST, a Japanese learning PWA for
two Christian missionaries preparing for a July 2026 trip to Sapporo,
Japan. For each phrase I give you in English, produce a card as a JSON
object matching this schema:

id, japanese, romaji, english, category, trip_phase,
simple_explanation, example_japanese, example_romaji,
example_english, distractors (array of 2), usage_note

Constraints:
- category: one of relationship, navigation_survival, ministry,
  foundation (internal taxonomy values).
- trip_phase: one of pre-trip, arrival, ministry, daily-life.
- simple_explanation: one sentence, beginner tone, warm.
  NOT dictionary-style. Like a patient friend explaining.
- Examples must use honorific levels appropriate for church and mission
  contexts (polite forms, です/ます).
- Distractors must be plausible — same grammatical category, similar
  length. Not absurd.
- id: human-readable slug, category prefix (e.g. church-...).

Return valid JSON only. No commentary before or after.
---

Pair this prompt with 2–3 hand-authored example cards so the AI can
calibrate the voice you want.

---

## Validation Rules

The pre-commit validation script must reject:
- Cards missing any required field
- Cards with distractors count other than exactly 2
- Cards with duplicate IDs
- Cards with invalid internal category values
- Cards with invalid trip_phase values
- Cards with incomplete example triples (partial is invalid)

Validation failure output must identify the card ID and the field
that failed. Vague failures are not acceptable.

---

## V2 Definition of Done for Content

At least 40 cards have all strongly recommended fields populated before
V2 ships. This is the minimum for a useful first week of study.
