# Jennifer Project Context

## 1. Overview

Jennifer started as a rebranding layer on top of OpenClaw, and is now evolving into a **private, owner-operated, self-improving AI agent system**.

This project aims to:

- preserve OpenClaw core compatibility where practical
- establish Jennifer as an independent product identity and operator experience
- support multi-node operations (Jennifer orchestrator + specialist child nodes)
- support safe self-improvement loops with explicit owner approval
- enhance network compatibility for restricted environments
- enable safe integration with external coding agents (e.g., Codex)

---

## 2. Project Goals

### Primary Goals

- Introduce "Jennifer" as the assistant identity
- Convert from rebranded fork behavior to owner-centric Jennifer product behavior
- Support multi-node orchestration (top-level Jennifer + specialist child nodes)
- Build a memory operating model (`jennifer-memory` private repo)
- Add safe self-improvement workflows (analyze → propose → approve → apply)
- Maintain upstream compatibility with OpenClaw where it does not conflict with Jennifer UX
- Support enterprise network environments (proxy/firewall)
- Provide safe execution boundaries for automation (Codex, scripts)

### Secondary Goals

- Improve observability for network failures
- Enable extensible adapter-based architecture
- Provide clear configuration for enterprise deployment
- Analyze owner conversation/work patterns and continuously refine workflows
- Keep local dashboard workflows first-class (not Telegram-centric)

---

## 3. Scope

### In Scope (Phase 1)

- Branding overlay (Jennifer identity)
- Telegram assistant identity update
- Greeting/help message override
- Configuration-based branding
- Proxy/firewall compatibility layer
- Minimal safe integration point for external tools (Codex wrapper)

### Out of Scope

- Full repository rename in a single step
- Package/module renaming that breaks compatibility without migration plan
- Unreviewed autonomous code deployment
- Replacing OpenClaw core architecture in one pass

---

## 3.1 Current Transition Target

Jennifer is moving from "rebrand" to "operating system for owner workflows":

- `Core` (stable): identity, memory policy, approvals, recovery, security boundaries
- `Extensions` (fast iteration): domain nodes (finance, AI/code, ops/research), automations, strategy modules

The intent is to keep core reliable while allowing rapid growth in extensions.

---

## 4. Architecture Principles

1. **Do not break upstream compatibility**
2. **Minimize core code modifications**
3. **Prefer overlays over rewrites**
4. **Separate concerns clearly**
   - Branding
   - Network
   - Execution
5. **All sensitive values must come from environment variables**
6. **All outbound communication must be controllable**

---

## 5. Branding Strategy

Jennifer branding should be applied to:

- Assistant name
- Greeting messages
- Help responses
- Telegram bot persona
- User-visible UI elements (where safe)

OpenClaw references may remain in:

- Internal module names
- Code structure
- Config keys (unless safe to alias)

---

## 6. Enterprise Constraints

Jennifer must work under:

- Restricted outbound network
- Proxy-only environments
- Firewall-controlled domains
- No direct internet access (optional mode)
- Security/audit requirements

---

## 7. Expected Deliverables

Each feature must include:

- Minimal code change
- Config example
- Documentation update
- Test instructions
- Upgrade impact notes

---

## 8. Development Workflow

Before implementation:

1. Analyze current structure
2. Identify extension points
3. Propose minimal solution
4. Implement in small commits

---

## 9. Non-Functional Requirements

- Security-first design
- Observability (logs, errors)
- Retry-safe network behavior
- Maintainable fork structure
- Easy upstream merge

---

## 10. Definition of Done

A task is complete when:

- Behavior works in enterprise network
- No unintended core modification
- Config is documented
- Risks are explained

---

## 11. Working Docs

- `docs/jennifer/ARCHITECTURE_GUARDRAILS.md`
- `docs/jennifer/JENNIFER_MEMORY_OPERATING_MODEL.md`
- `docs/jennifer/JENNIFER_DASHBOARD_STRATEGY.md`
- `docs/jennifer/JENNIFER_SELF_EVOLUTION_LOOP.md`
- `docs/jennifer/JENNIFER_CORE_BOOT_PLAN.md`
- `docs/jennifer/JENNIFER_FINANCE_NODE_SAFETY_MODEL.md`
- `docs/jennifer/JENNIFER_FINANCE_SECURITY_CHECKLIST.md`
- `docs/jennifer/JENNIFER_MEMORY_INTEGRATION_V1.md`
- `docs/jennifer/JENNIFER_COLLAB_CHANNEL_RULES_V1.md`
- `docs/jennifer/JENNIFER_UPDATE_OPERATIONS.md`
- `docs/jennifer/JENNIFER_SURFACE_MIGRATION_AUDIT.md`
- `docs/jennifer/JENNIFER_GO_LIVE_CHECKLIST.md`
- `docs/jennifer/JENNIFER_TOMORROW_TEST_PLAN.md`
- `docs/jennifer/EMERGENCY_SESSION_RECOVERY.md`
