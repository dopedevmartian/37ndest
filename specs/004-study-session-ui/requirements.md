# 004 Study Session UI Requirements

## Purpose

This spec defines the study-session user interface for 37NDEST. It turns the review engine into a practical, low-friction study experience for the two intended users.

This spec is about the user-facing session flow. It is not about dashboards, analytics-heavy reporting, or broad visual experimentation.

---

## Product Context

37NDEST is a tightly scoped Japanese conversation trainer for me and my wife only.

Primary learning priority:
1. everyday relationship building
2. navigation and survival
3. ministry

The app is:
- local-first
- offline-capable
- profile-aware
- driven by canonical deck JSON
- focused on practical conversational usefulness

The study-session UI must reinforce that shape through clarity, speed, and low-friction interaction.

---

## Scope of This Spec

Included:
- session entry UI
- active study-item presentation
- recognition-oriented interaction UI
- production-oriented interaction UI
- answer reveal / confirmation flow
- session progression UI
- simple session completion or interruption handling
- UI behavior that reflects profile-specific progress updates

Not included:
- dashboards
- advanced analytics
- broad settings UX
- advanced pacing recommendation UX
- gamification systems
- pronunciation scoring
- social or multiplayer surfaces
- speculative extra learning modes

---

## Requirements

### R1. The app must present a focused study session surface
The study-session UI must provide a clear, focused surface for doing study work without unnecessary distraction.

The UI should feel:
- practical
- fast
- understandable
- aligned with the app’s narrow mission-focused purpose

### R2. The UI must support recognition-oriented study interaction
The session UI must allow the user to move through a recognition-oriented study flow coherently.

At minimum, the UI must support:
- seeing the current prompt
- revealing or confirming the intended answer
- recording the user’s result
- advancing cleanly to the next item

### R3. The UI must support production-oriented study interaction
The session UI must allow the user to move through a production-oriented study flow coherently.

At minimum, the UI must support:
- seeing the current production-oriented prompt
- attempting recall before confirmation
- revealing or confirming the intended answer
- recording the user’s result
- advancing cleanly to the next item

### R4. The UI must keep the current study step clear
The user should be able to tell:
- what they are being asked to do
- whether they are in recognition or production mode
- whether the answer is hidden or revealed
- how to continue

The UI must not bury the basic study action under decorative complexity.

### R5. The UI must reflect session progression coherently
The session UI must remain consistent as the user moves from one item to the next.

It must support:
- a clear current-item state
- a clear transition to the next item
- a clean end-of-session or interruption state
- a session flow that does not feel confusing or brittle

### R6. The UI must preserve product focus and low-friction behavior
The study-session UI must not drift toward:
- dashboard-heavy interaction
- overdecorated study surfaces
- novelty-first controls
- extra complexity that slows review

The UI should optimize for actual repeated use under a real timeline.

### R7. The UI must remain compatible with local-first, profile-aware behavior
The UI must work coherently with:
- profile-specific progress
- local-first session behavior
- offline-capable use
- trusted canonical content boundaries

### R8. The UI must handle missing, empty, or invalid session states honestly
If a usable session cannot be shown:
- the UI must fail honestly
- the user must not be shown fake or misleading session behavior
- the state should remain understandable enough for debugging or recovery

### R9. The session UI must remain reviewable and testable
The implementation must support:
- UI-flow validation
- reveal/progression validation
- recognition/production state checks
- session completion/interruption checks
- regression review for nearby interaction behavior

### R10. The session UI must preserve narrow scope
This spec must not silently implement:
- analytics dashboards
- broad study-history surfaces
- advanced gamification layers
- speculative extra learning modes
- cloud-dependent session behavior
- broad settings redesign

---

## Acceptance Criteria

### AC1. A focused session surface exists
- The user can enter a study session and see a clear active study surface
- The surface feels aligned with a narrow practical study purpose

### AC2. Recognition-oriented interaction works
- The user can move through a recognition-oriented item flow
- Prompt, reveal/confirmation, result recording, and next-item progression are coherent

### AC3. Production-oriented interaction works
- The user can move through a production-oriented item flow
- Prompt, reveal/confirmation, result recording, and next-item progression are coherent

### AC4. Session state remains understandable
- The user can tell what step they are in
- The UI does not hide the core action behind unnecessary complexity

### AC5. Session progression remains coherent
- Advancing between items works clearly
- Session completion or interruption states are understandable

### AC6. Local-first and profile-aware boundaries are preserved
- The session UI does not require backend behavior
- The UI works coherently with profile-specific state and trusted content

### AC7. Scope is preserved
- The implementation does not silently introduce dashboards, speculative learning modes, or unrelated product expansion

---

## Explicit Non-Requirements

This spec does not require:
- advanced dashboard UX
- study-history reporting
- streak systems
- leaderboards
- social comparison
- pronunciation scoring
- gamification layers
- advanced pacing recommendation UX
- broad settings redesign
- cloud sync

---

## Risks to Watch

- building a visually noisy session UI that slows repeated use
- making recognition and production feel like disconnected products
- unclear reveal/progression states
- coupling the UI too tightly to engine internals
- silently expanding into dashboard or analytics territory
- weak handling of empty or invalid session state

---

## Requirement Summary

This spec succeeds if 37NDEST gains a focused, low-friction, profile-aware study-session UI that supports recognition and production-oriented study clearly, advances coherently through a session, and stays tightly aligned with the product’s practical conversational purpose.