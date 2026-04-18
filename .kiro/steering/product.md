# 37NDEST Product Steering

## Product Mission

Build a lightweight, offline-capable Japanese conversation trainer for two users preparing for a mission trip. Focus on practical, mission-relevant vocabulary and interaction patterns. Support basic conversational Japanese in ~3.5 months through targeted, schedule-aware review.

---

## Intended Users

- Me and my wife only
- No multi-user, social, or collaborative features
- No public or generic user base

---

## Primary Outcome

Basic conversational Japanese sufficient for:
- Daily relationship building with local contacts
- Navigation and survival interactions
- Ministry-focused conversations

Timeline: ~3.5 months to mission trip.

---

## Priority Learning Domains (Strict Order)

1. Everyday Relationship Building
   - Greetings and personal topics
   - Daily life vocabulary and phrases
   - Casual conversation patterns

2. Navigation and Survival
   - Directions and location vocabulary
   - Ordering and transactions
   - Basic practical interactions

3. Ministry
   - Faith-related vocabulary
   - Spiritual conversation patterns
   - Mission-specific phrases

---

## What v1 Must Do

- Import and load canonical deck JSON as the content source
- Support two independent local user profiles
- Track per-profile progress and review state
- Support spaced-repetition-based review flows
- Support recognition-oriented review flows
- Support production-oriented recall flows
- Provide schedule-aware pacing recommendations
- Remain simple, fast, and offline-capable
- Store all user progress locally
- Work as an installable offline-capable web app on mobile and desktop

---

## What v1 Must Not Become

- Generic language-learning platform
- Full JLPT or N5 curriculum manager
- Broad kanji study suite
- Multiplayer or social product
- Cloud-first synced platform
- Analytics-heavy dashboard product
- Gamified engagement platform
- Multi-language learning system

---

## Success Criteria

- Canonical deck JSON loads and displays correctly
- Two profiles can be created and tracked independently
- Review flow supports both recognition and production-oriented study
- Pacing recommendations align with remaining time to mission
- App functions fully offline after setup
- App feels fast and responsive on typical target devices
- No backend dependency for core v1 use
- No sync system required for core v1 use

---

## Product Non-Goals

- Broad language learning coverage
- Kanji mastery or JLPT alignment
- Social or multiplayer features
- Cloud synchronization
- Advanced analytics
- Gamification or engagement mechanics
- Multi-language support
- AI tutor-style runtime features
- Pronunciation scoring
- User analytics or tracking

---

## Scope Boundaries

### Explicitly In Scope
- Offline-first PWA
- Local profile management
- Canonical deck JSON import
- Spaced repetition review
- Schedule-aware pacing
- Recognition and production-oriented study flows
- Simple, fast UI

### Explicitly Out of Scope (Unless Explicitly Approved)
- Backend services
- Cloud synchronization
- Multi-user collaboration
- Kanji system expansion
- JLPT curriculum expansion
- Analytics dashboards
- Social features
- Multiplayer modes
- Advanced AI runtime features
- Pronunciation evaluation

---

## Anti-Scope Anchors

Do not expand into:
- Full JLPT preparation system
- Comprehensive kanji study
- Generic language-learning platform
- Multiplayer or social product
- Cloud-dependent architecture
- Analytics-driven engagement systems

Maintain:
- Mission-focused scope
- Two-user constraint
- Offline-first design
- Simple, fast performance
- Canonical deck JSON as source of truth

---

## Tone and Constraints

- Strict product focus
- Anti-scope-creep enforcement
- No marketing language
- No feature bloat
- No adjacent systems
- No "nice to have" features without explicit approval
