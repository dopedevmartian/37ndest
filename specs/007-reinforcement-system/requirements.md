# 007 Reinforcement System — Requirements

## Purpose

This spec defines how user self-assessment outcome signals translate into
within-session card repetition, end-of-session review recommendations, and long-term
confidence tracking for 37NDEST.

The current Phase 5 interaction model uses "Got it" and "Again" as the visible button
labels. The reinforcement logic is defined in terms of the underlying stored outcome
signals — `correct` and `incorrect` — not the button labels themselves. If the
visible labels change in a future phase, the reinforcement logic does not change.

This is a specification-only document. No implementation is authorized until this spec
is approved and a task list is created.

---

## Product Context

37NDEST is a patient teacher, not a quiz. The reinforcement system must reflect that
philosophy. A `incorrect` outcome is not a punishment — it is a signal that the card
needs more attention. The system responds by giving that card more attention, warmly
and without ceremony.

The current Phase 5 interaction model captures the raw outcome signal via "Got it"
(stored as `correct`) and "Again" (stored as `incorrect`). This spec defines what the
system does with those signals. The reinforcement logic is coupled to the stored
outcome values, not to the current button labels.

---

## Scope

### Included

- within-session card reinsertion logic when "Again" is tapped
- threshold rules for how many misses trigger reinforcement
- confidence score calculation per card per profile
- end-of-session "practice again" recommendation presentation
- long-term confidence tracking shape (stored in IndexedDB per profile)

### Not included

- multiple choice mode logic
- feedback overlay system (color wash, encouragement text, haptics, auto-advance)
- spaced repetition scheduling with intervals and ease factors
- changes to Phase 5 card layout or interaction model
- changes to the review engine's core session progression functions
- bucket-writing logic (bucket 0/1/2 transitions are a separate concern)
- trip-phase weighting
- session summary redesign

---

## Mental Model

### The core idea

Every card has a **confidence score** per profile. The score is a simple integer
derived from recent review history. It goes up on a `correct` outcome and down on an
`incorrect` outcome. The score drives two behaviors:

1. **Within-session reinsertion** — cards with an `incorrect` outcome come back later
   in the same session so the user gets a second attempt before the session ends.

2. **End-of-session recommendation** — after a session, cards that produced
   `incorrect` outcomes are surfaced as a "practice again" suggestion.

The score is not shown to the user directly. It is an internal signal that shapes
what the app offers next.

### What the user experiences

- They tap "Again" on a card (producing an `incorrect` outcome).
- The card reappears later in the same session (not immediately — a few cards later),
  unless fewer than 2 cards remain in the queue (see R1).
- At the end of the session, if enough cards were missed, the app offers a focused
  "practice again" option covering only those cards.
- Over time, cards they consistently get right feel less urgent; cards they
  consistently miss feel more present.

No numbers. No scores. No shame. Just the right cards showing up at the right time.

---

## Requirements

### R1. Cards with an `incorrect` outcome must be reinserted within the current session

When a `incorrect` outcome is recorded for a card, that card must be reinserted into
the remaining session queue, subject to the following rules:

- It must not appear immediately as the next card — it must be placed at least 2
  cards ahead of the current position.
- **Tail-end rule:** if fewer than 2 cards remain in the session queue at the time of
  the `incorrect` outcome, the card is not reinserted into the active session. It is
  added only to the missed set for the end-of-session offer.
- A card may be reinserted at most once per session. If an `incorrect` outcome is
  recorded for a card that has already been reinserted, the outcome is recorded and
  the confidence score may decrease again, but the card is not reinserted a second
  time. It remains eligible for the end-of-session practice-again set.

### R2. Reinsertion must not disrupt session completion

The session must still complete cleanly. Reinserted cards count toward the session
total. The progress bar must reflect the updated total when a card is reinserted.

### R3. A confidence score must be maintained per card per profile

Each card has a confidence score stored in IndexedDB under the active profile. The
score is an integer in the range 0–10.

Score update rules:
- `correct` outcome → score increases by 1, capped at 10
- `incorrect` outcome → score decreases by 2, floored at 0

Initial score for a card never reviewed: 5 (neutral starting point).

The score is recalculated after each review outcome and persisted immediately.

**Why this model is intentionally simple:** 37NDEST has a small, bounded deck
(~200 cards) used by two people over a ~3.5 month mission preparation period. The
goal is practical conversational readiness, not long-term academic retention. A
lightweight rolling-window score is sufficient and appropriate for this scope. This
is not trying to be a full spaced repetition system. Full SRS — with intervals, ease
factors, and scheduling algorithms — is explicitly out of scope for this product.

### R4. The confidence score must reflect recent history, not all-time history

The score must weight recent outcomes more heavily than old ones. The simplest
acceptable implementation is a rolling window: only the last 10 review outcomes
for a card contribute to the score. Outcomes older than the window are discarded
from the calculation.

This keeps the score responsive to current learning state without requiring complex
decay functions. It is optimized for a small mission-focused deck used over a bounded
time period — not for long-term academic spaced repetition.

### R5. End-of-session "practice again" must be offered when enough cards were missed

After a session completes, if any cards produced at least one `incorrect` outcome
during that session, the app must offer a focused "practice again" option.

The offer must:
- identify the specific cards that produced `incorrect` outcomes
- present a clear, low-friction action to start a focused drill on those cards
- not be mandatory — the user can dismiss it and return to the home screen

The offer must not appear if no cards were missed in the session.

### R6. The "practice again" session must be a focused drill, not a full session

When the user accepts the "practice again" offer, the session must contain only the
cards that were missed in the preceding session. It must not pull in additional cards.

The focused drill follows the same card interaction model as a normal session (reveal
mode, "Got it" / "Again"). No special UI is required beyond the existing card shell.

### R7. Long-term confidence tracking must be queryable for future use

The confidence score and review history stored per card per profile must be structured
so that future specs (bucket transitions, trip-phase weighting, session selection
weighting) can query them without requiring a data model redesign.

The minimum required queryable shape per card per profile:
- `cardId`
- `profileId`
- `confidenceScore` (0–10 integer)
- `recentOutcomes` (array of last 10 outcomes, newest first)
- `lastReviewedAt` (timestamp)

**Relationship to the CardBucket model:** `ConfidenceRecord` and the existing
`CardBucket` (0/1/2) model are related but distinct and must not be merged in this
phase.

- `ConfidenceRecord` is immediate reinforcement memory — it tracks recent outcome
  signals and drives within-session and short-term behavior.
- `CardBucket` is the broader mastery classification layer — it reflects a card's
  overall learning stage (Learning / Familiar / Strong) and drives session selection
  weighting and progress display.

A future spec may use `confidenceScore` as one input to bucket transition logic, but
that connection is not implemented here. The two systems remain independent.

### R8. The reinforcement system must not change the Phase 5 interaction model

The visible button labels, their visual treatment, the underlying outcome mapping
(`correct` / `incorrect`), and the session progression behavior defined in Phase 5
must remain unchanged. The reinforcement system consumes the existing stored outcome
signals — it does not replace or augment the interaction model. If the visible labels
change in a future phase, the reinforcement logic does not change.

### R9. The reinforcement system must remain local-first and profile-isolated

All confidence scores and review history must be stored in IndexedDB under the active
profile. No cross-profile access. No backend dependency.

### R10. The system must degrade gracefully when history is absent

For cards with no review history, the system must behave sensibly:
- confidence score defaults to 5
- no reinsertion occurs (no history means no "Again" signal)
- no "practice again" offer appears for cards never reviewed

---

## Acceptance Criteria

### AC1. Within-session reinsertion
- A card with an `incorrect` outcome reappears in the same session, unless fewer than
  2 cards remain in the queue at the time of the outcome
- It does not appear as the immediately next card
- It is reinserted at least 2 positions ahead in the remaining queue
- A card is reinserted at most once per session
- A second `incorrect` outcome on a reinserted card decreases the confidence score
  again but does not trigger a second reinsertion
- A card not reinserted due to the tail-end rule is added to the missed set
- The session still completes cleanly after reinsertion

### AC2. Confidence score
- Each card has a score in range 0–10 per profile
- `correct` outcome increments by 1 (max 10)
- `incorrect` outcome decrements by 2 (min 0)
- Score is persisted to IndexedDB after each outcome
- Score is based on the last 10 outcomes only

### AC3. End-of-session offer
- "Practice again" offer appears after a session where at least one card produced an
  `incorrect` outcome
- Offer does not appear when no cards were missed
- Offer is dismissible
- Accepting the offer starts a focused drill containing only the missed cards

### AC4. Focused drill
- Focused drill contains only the cards missed in the preceding session
- No additional cards are added
- The same card interaction model applies (reveal, Got it / Again)

### AC5. Data shape
- Confidence data is stored per card per profile in IndexedDB
- Required fields are present: `cardId`, `profileId`, `confidenceScore`,
  `recentOutcomes`, `lastReviewedAt`
- No cross-profile leakage

### AC6. Phase 5 interaction model unchanged
- Visible button labels, visual treatment, and outcome mapping are unchanged
- Session progression behavior is unchanged
- No new UI elements are introduced during the active card interaction
- Reinforcement logic is coupled to stored outcome values, not button labels

### AC7. Graceful degradation
- Cards with no history default to confidence score 5
- No errors or broken states when history is absent

---

## Explicit Non-Requirements

- spaced repetition intervals or ease factors
- visible confidence score display to the user
- punishment mechanics, lives, or streak pressure
- multiple choice mode
- feedback overlay or encouragement text changes
- bucket transition logic
- trip-phase weighting
- session summary redesign
- backend or sync dependency

---

## Risks

1. **Reinsertion inflating session length unexpectedly** — if many cards are missed,
   reinsertion could significantly extend the session. A cap on total reinsertions
   per session may be needed (e.g. max 5 reinsertions regardless of miss count).

2. **Score volatility on short history** — with only 10 outcomes in the window, a
   single bad session can drop a score significantly. The floor of 0 and the +1/-2
   asymmetry are intentional to make recovery feel achievable.

3. **"Practice again" fatigue** — if the offer appears after every session, users
   may start ignoring it. The offer should only appear when the miss count is
   meaningful (consider a minimum threshold of 2+ missed cards before offering).

4. **Data model collision with future bucket logic** — the confidence score and the
   bucket (0/1/2) system are related but distinct. This spec must not silently
   implement bucket transitions. The two systems must remain separable.
