# Jennifer Architecture Guardrails

## 1. Core Rule

Jennifer should evolve aggressively in capability while preserving a stable base.

- Core must stay readable, auditable, and recoverable.
- Compatibility with upstream OpenClaw should be preserved where practical.
- User-facing identity should prefer **Jennifer** over OpenClaw naming.

---

## 2. Two-Speed Architecture

### Core (slow, stable)

Owns reliability and trust boundaries:

- identity/persona and operator UX defaults
- approval gates and policy checks
- memory policy (short-term vs long-term)
- recovery commands (including Incredible Jenny emergency paths)
- security boundaries, secrets handling, audit logs

### Extensions (fast, iterative)

Owns rapid growth:

- specialist nodes (finance, AI/code, ops/research)
- domain workflows and automations
- recommendation engines and report generators
- experimental skills/connectors

Rule: **Prefer extension changes before touching core.**

---

## 3. Allowed Changes

### Safe Zones

- configuration layer
- adapter layer
- wrapper scripts
- branding messages and user-visible docs
- dashboard UX copy and workflow defaults
- extension node logic

### Conditional Zones

- channel adapters (Telegram/others)
- network request and retry internals
- gateway/session lifecycle internals

Conditional changes require explicit design note + rollback path.

---

## 4. Forbidden Changes

- broad package/module renames without migration plan
- hidden autonomous deployment behavior
- hardcoded credentials or private endpoints
- bypassing approval/security controls
- tightly coupling Jennifer identity logic to one messaging channel

---

## 5. Dashboard-First Principle

Jennifer operations must be possible from local dashboard + CLI first.

- Telegram is a communication surface, not the only control surface.
- Status, approvals, recovery, and node orchestration must remain operable locally.
- If a channel is blocked, Jennifer core operation must remain healthy.

---

## 6. Self-Improvement Guardrail

Jennifer may propose and prepare its own upgrades, but must follow:

1. Analyze (signals, logs, conversation/work patterns)
2. Propose (clear diff + risk + rollback)
3. Request owner approval
4. Apply changes
5. Restart/reload safely
6. Verify health + regressions
7. Roll back automatically on failure criteria

No unapproved self-mutation in core behavior.

---

## 7. Memory Guardrail (`jennifer-memory`)

Use a private memory repo as shared operational memory for multi-node collaboration.

- separate short-term and long-term memory
- store decisions, tasks, command outcomes, and pattern summaries
- enforce node-specific write scopes
- preserve auditability of who wrote what and when

---

## 8. Finance/Trading Guardrail (Dual Control)

For finance/trading-related automation:

- never grant unrestricted autonomous trading authority
- require owner approval for high-risk actions (new entry, size increase, stop-loss override)
- prefer dual control (`Jennifer orchestrator` + `owner confirmation`)
- enforce hard risk limits (per-order, daily loss, total exposure)
- require kill-switch and audit trail for every execution path

Use isolated execution nodes with least privilege (trade-only API keys, no withdrawal rights).

---

## 9. Definition of Done

A change is complete only when:

- user-facing behavior is more Jennifer-centric
- core stability is not degraded
- approval/recovery paths are preserved
- docs and runbooks are updated
- rollback path is documented and tested
