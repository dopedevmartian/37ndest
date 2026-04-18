# 37NDEST Deployment Steering

## Purpose

This file defines the default deployment posture for 37NDEST. The goal is a simple, low-friction, auditable deployment model that matches the project's local-first, offline-capable, two-user scope.

---

## Deployment Defaults

### Core Deployment Model
- Deploy as a static web application
- Preserve offline-capable behavior after initial setup
- Keep hosting simple and low-maintenance
- Avoid deployment architecture that implies backend dependency

### Hosting Posture
- Prefer static hosting platforms or equivalent simple hosting
- HTTPS support is required
- Service worker support is required
- Do not require custom server-side runtime for core v1 deployment
- Do not require a database or API for core v1 deployment

### Product Fit
- Deployment should match the actual product size and scope
- Do not overbuild infrastructure for a two-user personal application
- Simplicity is a feature, not a temporary compromise

---

## Build Output Expectations

### Output Shape
- Static HTML
- Static JavaScript
- Static CSS
- Service worker assets
- Manifest and install assets
- Static canonical content and supporting client assets as appropriate

### Build Discipline
- Keep the build process simple and auditable
- Avoid unnecessary build-time generation
- Avoid hidden deployment steps
- Avoid deployment pipelines that require manual tribal knowledge
- Prefer deterministic build behavior

---

## Offline and Installability Expectations

### Offline-Capable Behavior
- Core study behavior should work without a backend
- Canonical content required for v1 should be available to the installed app
- User progress should remain local and usable without network access
- Do not quietly degrade core study behavior into network dependence

### Installability
- The deployed app should support installable web app behavior on supported platforms
- Manifest and service worker behavior should remain aligned with the approved architecture
- Do not treat installability as optional polish if it materially affects the intended use experience

---

## Environment and Configuration Posture

### Default Environment Philosophy
- Keep environment configuration minimal
- Avoid environment-variable sprawl for core v1
- Avoid deployment settings that only make sense for backend products
- Prefer repository-visible configuration over hidden platform-specific magic when practical

### Secrets and Sensitive Data
- Do not create secrets requirements unless a future approved capability truly needs them
- Do not introduce fake environment scaffolding for features that do not exist
- Do not design deployment around imagined future backend needs

---

## Release Discipline

### Release Expectations
- Deployment should follow reviewable repository state
- Avoid ad hoc hand-deployed production drift
- Keep release behavior easy to understand and repeat
- Make it easy to identify what version of the app is deployed

### What Should Be Reviewable

Before a release, it should be clear:
- what changed
- what was supposed to remain unchanged
- whether relevant validation was performed
- whether any deployment-relevant configuration changed

---

## What Deployment Must Not Become

Do not turn deployment into:
- a backend platform
- an auth platform
- a sync platform
- a database-backed runtime
- a complex DevOps project
- a fragile chain of hidden manual steps

37NDEST should deploy like a focused static product, not like an overbuilt service.

---

## Deployment Change Rules

### Allowed by Default
- normal static build updates
- manifest and installability updates tied to approved work
- asset updates tied to approved work
- hosting configuration adjustments that preserve the static deployment model

### Not Allowed by Default
- introducing server-side runtime requirements
- introducing backend deployment dependencies
- introducing database dependencies
- introducing auth infrastructure
- introducing sync infrastructure
- introducing deployment complexity that is disproportionate to project scope

Changes in the "not allowed by default" group require explicit approval through steering, specs, ADRs, or the decision log.

---

## Validation Expectations for Deployment-Relevant Changes

When a change affects deployment, installation, or offline-capable behavior, validate as relevant:
- build success
- static asset correctness
- manifest behavior
- service worker behavior
- offline-capable core flow behavior
- absence of accidental backend dependency

Do not assume deployability. Verify it when the change meaningfully affects deployment behavior.

---

## Final Bias

When there is doubt:
- choose the simpler deployment model
- choose the more reviewable release path
- choose the static option over the service-like option
- choose the option that preserves offline-capable behavior
- choose the option that fits a two-user personal product

Deployment should remain boring, reliable, and proportionate to the real product.
