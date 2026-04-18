# 37NDEST Technical Steering

## Approved Stack

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State Management:** State management should remain lightweight and local-first; avoid introducing heavy global state solutions unless justified by an active spec
- **Local Persistence:** IndexedDB via Dexie.js
- **PWA Support:** Service worker and installable app behavior compatible with the approved Vite-based architecture

### Deployment
- Static hosting (Vercel, Netlify, GitHub Pages, or equivalent)
- No backend required
- No database server required
- No authentication service in v1

### Testing
- Unit tests: Vitest
- Component tests: Vitest + React Testing Library
- End-to-end testing may be added later if justified by an active spec

---

## Architecture Defaults

### Static/Local-First
- All data stored locally in IndexedDB
- No cloud synchronization
- No backend API calls
- No real-time features
- No multi-device sync

### Content Source of Truth
- Canonical deck JSON stored in `/data/decks/canonical/`
- JSON is the authoritative content format
- App imports canonical JSON through deterministic validation routines
- No code-embedded content
- No database-driven content

### Runtime Structure
- Import canonical JSON into internal runtime structures
- Separate canonical content from user progress
- Per-profile progress stored independently
- No mutation of canonical content

### Simplicity First
- Prefer simple, auditable code
- Avoid premature abstraction
- Avoid complex plugin systems
- Avoid unnecessary dependencies
- Favor deterministic transforms

---

## Data and Persistence Rules

### Canonical Content
- Stored as JSON in `/data/decks/canonical/`
- Immutable at runtime
- Validated through deterministic validation routines during import workflows and other quality checks as needed
- Never modified by user actions
- Single source of truth

### User Progress
- Stored in IndexedDB per profile
- Completely separate from canonical content
- Includes review history, scheduling state, and profile metadata
- Can be cleared without affecting canonical content
- Supports export/import for backup

### Profile Separation
- Two independent profiles supported
- Each profile has separate progress state
- Each profile has separate review schedule
- No shared state between profiles
- Profile data isolated in IndexedDB

### Data Validation
- Validate canonical JSON through deterministic validation routines during import workflows and other quality checks as needed
- Validate profile data on load
- Validate review state consistency
- Fail gracefully on invalid data
- Log validation errors for debugging

---

## Import and Content Rules

### Canonical Deck JSON
- Primary import format
- Must validate against schema
- Must preserve all required fields
- Must handle missing optional fields gracefully
- Import script must be deterministic and auditable

### Future Optional Formats
- TSV import may be added later (not core)
- APKG import may be added later (not core)
- Not the internal storage format
- Always convert to canonical JSON for storage
- Always validate before import

### Content Transformation
- Use deterministic scripts for transformations
- Avoid manual editing of canonical content
- Version canonical content in repository
- Document all transformations
- Preserve original source references

### No Code-Embedded Content
- Do not hardcode deck content in source files
- Do not generate content from code
- Do not store content in constants
- All content must come from `/data/decks/canonical/`

---

## Testing Expectations

### Import Validation
- Test JSON schema validation
- Test missing field handling
- Test invalid data rejection
- Test successful import flow
- Test error reporting

### Schedule Logic
- Test pacing calculations
- Test remaining-time adjustments
- Test review interval calculations
- Test schedule consistency
- Test edge cases (zero time, past dates)

### Review Logic
- Test card presentation order
- Test recognition vs. production flow
- Test review state transitions
- Test progress tracking
- Test schedule updates after review

### Profile Separation
- Test independent profile creation
- Test profile isolation
- Test profile switching
- Test profile deletion
- Test no cross-profile data leakage

### Performance
- Test import performance with large decks
- Test IndexedDB query performance
- Test UI responsiveness during review
- Test memory usage under load

---

## Performance and Simplicity Priorities

### Performance Targets
- Prioritize fast initial load, responsive review interactions, and modest bundle size on typical target devices
- Set hard performance thresholds in feature specs when needed, not in top-level steering
- Review interactions should remain smooth on typical target devices
- Avoid unnecessary memory use and performance overhead

### Code Simplicity
- Prefer explicit over implicit
- Prefer simple functions over complex abstractions
- Prefer local state over global state
- Prefer composition over inheritance
- Prefer deterministic logic over heuristics

### Dependency Minimization
- Only add dependencies that solve concrete problems
- Avoid large frameworks for small tasks
- Avoid unnecessary build-time dependencies

### Auditable Code
- Code must be readable by humans
- Logic must be traceable
- No magic or implicit behavior
- Comments for non-obvious decisions
- Clear error messages

---

## Explicitly Rejected or Deferred Technologies

### Rejected (No Implementation)
- Backend authentication
- Cloud synchronization
- Database server
- Broad plugin architecture
- Full APKG-native internal storage model
- Broad charting/analytics dependencies
- Real-time collaboration
- Multi-device sync
- Server-side rendering
- GraphQL or complex API layers

### Deferred (May Reconsider Later with Explicit Approval)
- Supabase or other hosted backend
- Firebase or other BaaS
- Advanced MCP-dependent runtime architecture
- Complex state management libraries
- Advanced analytics
- Machine learning features
- Pronunciation evaluation

### Never (Architectural Constraints)
- Do not replace approved stack without decision-log entry
- Do not move source-of-truth deck content into code files
- Do not embed content in constants or configuration
- Do not create backend without explicit spec
- Do not implement cloud sync without explicit spec
- Do not add authentication without explicit spec

---

## Stack Change Protocol

### To Change Approved Stack
1. Create ADR (Architecture Decision Record) in `/docs/adr/`
2. Document rationale and alternatives
3. Get explicit approval
4. Update this file
5. Update all relevant specs
6. Execute migration plan

### To Add Major Dependency
1. Justify in ADR
2. Verify bundle size impact
3. Verify maintenance status
4. Get explicit approval
5. Document in this file

---

## Deployment and Build

### Build Output
- Static HTML, CSS, JavaScript
- Service worker for offline support
- Manifest for PWA installation
- No server-side rendering
- Avoid unnecessary build-time generation and keep build steps simple and auditable

### Hosting Requirements
- Static file hosting
- HTTPS support
- Service worker support
- No special server configuration
- No database required

### Versioning
- Use clear release versioning practices
- Keep app and cache versioning auditable and consistent

---

## Code Organization

### Source Structure
```
src/
├── app/              # App shell and routing
├── components/       # Reusable React components
├── features/         # Feature-specific logic
├── lib/              # Utilities and helpers
├── db/               # IndexedDB schema and queries
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── styles/           # Global styles, tokens, and style helpers
└── test/             # Test utilities and fixtures
```

### Data Structure
```
data/
├── decks/
│   ├── canonical/    # Source-of-truth deck JSON
│   ├── derived/      # Generated/processed content
│   └── imports/      # Import staging area
├── schema/           # JSON schema definitions
└── schedule/         # Pacing and schedule configuration
```

---

## Tone and Constraints

- Concrete engineering focus
- No vague language
- Specific technology choices
- Clear rejection criteria
- Explicit approval requirements
- Auditable decision-making
