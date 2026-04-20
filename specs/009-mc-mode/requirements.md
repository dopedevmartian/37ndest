# 009 Multiple Choice Mode — Requirements

## Purpose

This spec defines a second review interaction mode for 37NDEST where the system
evaluates correctness instead of the user. The existing reveal mode (self-assessed)
remains unchanged. MC mode is additive — it runs alongside reveal mode and uses the
same session, reinforcement, and pacing infrastructure without modification.

---

## Product Context

The current reveal mode asks the user to judge their own answer. MC mode removes that
judgment burden by presenting a set of choices and evaluating the selection
automatically. This lowers the barrier for early learners and provides a different
kind of practice — recognition under pressure rather than open recall.

MC mode is not a replacement for reveal mode. Both modes serve different learning
needs and will coexist. Mode selection is a profile preference (already defined in
the settings spec).

---

## Scope

### Included

- MC interaction mode for recognition direction
- Choice generation from the active deck (1 correct + 3 distractors)
- System-evaluated correct/incorrect outcome
- Visual feedback on selection (color, no navigation)
- Tap-to-continue after feedback
- Graceful fallback to reveal mode when a card has insufficient distractors

### Not included

- Changes to reinforcement logic (confidence scoring, reinsertion)
- Changes to session size or selection logic
- Changes to pacing or schedule guidance
- Changes to the production direction flow
- New outcome types beyond "correct" / "incorrect" / "skipped"
- Weighted distractor selection
- Audio or pronunciation features
- Animated card transitions beyond what already exists

---

## Requirements

### R1. MC mode must present one correct answer and three distractors

When a card is presented in MC mode, the user sees:
- The Japanese prompt (Zone 1, same as reveal mode)
- Four answer choices in place of Zone 2
- Each choice shows the English meaning

The correct answer is the card's own `english` field. The three distractors are
drawn from other cards in the active deck.

### R2. Distractor selection must be simple and duplicate-free

Distractors are selected from the deck's other cards using this priority:
1. Use the card's own `distractors` field if it contains exactly 2 entries — these
   are pre-authored quality distractors. A third distractor is drawn randomly from
   remaining deck cards.
2. If `distractors` is absent or has fewer than 2 entries, draw all 3 distractors
   randomly from other deck cards.

Rules:
- The correct answer must not appear in the distractor list.
- No duplicate English strings in the choice set.
- Choice order is randomized before display.
- Distractor selection uses a deterministic shuffle seeded by the card id and session
  index, so the same card always produces the same choices within a session (no
  flickering on re-render).

### R3. The system must evaluate the selection and map to existing outcome types

When the user taps a choice:
- If the choice matches the correct answer → outcome is `"correct"`
- If the choice does not match → outcome is `"incorrect"`

No new outcome types are introduced. The existing `RecognitionOutcome` type
(`"correct" | "incorrect" | "skipped"`) is reused without modification.

### R4. Visual feedback must appear immediately on selection

On tap:
- The selected choice receives a visual state (correct: matcha wash; incorrect: coral wash)
- The correct choice is always revealed when an incorrect choice is selected
- All choices are disabled after any tap (no re-selection)
- Feedback is shown inline — the card does not navigate away
- A "Continue" affordance appears after feedback to advance to the next card

The feedback must use the existing design system tokens (`--matcha-soft`,
`--matcha`, `--coral-soft`, `--coral`) consistent with the rest of the app.

### R5. MC mode must fall back to reveal mode for cards without sufficient distractors

If a card cannot produce 3 distinct distractors (e.g. the deck has fewer than 4
cards total, or all other cards share the same English meaning), the card is
presented in reveal mode instead. No error is shown to the user.

### R6. MC mode must not modify reinforcement, session, or pacing logic

The outcome produced by MC mode (`"correct"` or `"incorrect"`) is passed to the
same outcome handlers in ReviewView that reveal mode uses. Confidence tracking,
reinsertion, session completion, and daily progress all behave identically
regardless of which interaction mode produced the outcome.

### R7. Mode selection is a profile preference

MC mode is not a per-session decision. It is a stored profile preference. The
existing settings infrastructure (ProfileSettings, SettingsView) is the correct
place for this preference. The Today screen does not present a mode picker.

This spec does not implement the settings UI change — that is a separate task.
For now, the mode can be toggled via a constant or a simple prop for testing.

### R8. The card structure must remain recognizable

MC mode reuses the existing ReviewCard zone structure:
- Zone 1 (prompt) is unchanged
- Zone 2 (reveal area) is replaced by the choice list
- Zone 3 (support content) is not shown during MC interaction (shown after feedback
  if the card has enriched fields — this is optional and deferred)
- The category chip and Japanese hero text remain in place

The ReviewCard component may be extended or a parallel MCCard component may be
introduced — the design doc decides. Either way, the visual language must remain
consistent with the existing card shell.

---

## Acceptance Criteria

### AC1. Choice presentation
- Exactly 4 choices are shown per card in MC mode
- 1 choice is the correct answer
- 3 choices are distractors from other deck cards
- No duplicate English strings in the choice set
- Choices are displayed in randomized order

### AC2. Outcome evaluation
- Tapping the correct choice produces outcome `"correct"`
- Tapping an incorrect choice produces outcome `"incorrect"`
- No new outcome types are introduced

### AC3. Feedback
- Correct choice receives matcha visual treatment on tap
- Incorrect choice receives coral visual treatment on tap
- Correct choice is revealed when an incorrect choice is tapped
- All choices are disabled after any tap
- A "Continue" affordance appears after feedback
- The card does not navigate away during feedback

### AC4. Fallback
- Cards with insufficient distractors are presented in reveal mode
- No error or broken state is shown to the user

### AC5. Reinforcement unchanged
- Confidence scoring, reinsertion, session completion, and daily progress
  behave identically to reveal mode
- No new outcome types are passed to the reinforcement system

### AC6. Mode preference
- MC mode is controlled by a profile preference, not a per-session decision
- The Today screen does not present a mode picker

---

## Explicit Non-Requirements

- Weighted distractor selection
- Audio or pronunciation features
- New outcome types
- Changes to reinforcement, reinsertion, or session logic
- Changes to pacing or schedule guidance
- Settings UI for mode selection (separate task)
- Zone 3 support content during MC interaction (deferred)
- Animated transitions beyond existing card shell behavior
