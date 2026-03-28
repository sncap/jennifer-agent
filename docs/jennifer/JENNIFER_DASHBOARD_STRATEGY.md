# Jennifer Dashboard Strategy (Local-First)

## Why

Jennifer must not be Telegram-centric for core operations.
Local dashboard + CLI should remain the primary control surface for reliability, observability, and recovery.

---

## Core Principles

1. **Local-first control**
   - start, status, approval, recovery from local dashboard/CLI
2. **Channel-agnostic operations**
   - Telegram/WhatsApp/Discord are messaging surfaces, not control-plane dependencies
3. **Recovery resilience**
   - if external channel fails, Jennifer remains operable locally

---

## Minimum Dashboard Capabilities

- gateway health/status
- active sessions and node status
- approvals queue
- recovery controls (soft/session/emergency)
- recent incidents/restarts
- pending self-improvement proposals

---

## UX Recommendations

- make dashboard entry obvious in onboarding
- show "local dashboard URL" in status output
- expose node orchestration view (orchestrator + children)
- expose memory sync health (`jennifer-memory`)

---

## Operator Runbook

### Start

```bash
jennifer gateway --port 18789 --verbose
jennifer dashboard
```

### Health check

```bash
jennifer status
jennifer health
```

### Recovery

- prefer dashboard action buttons first
- fall back to owner command aliases when channel-only context is required

---

## Telegram Positioning

Telegram remains valuable for:

- mobile command input
- alert delivery
- quick interactions

But should not be required for:

- approvals
- architecture updates
- node management
- recovery of stuck runtime state

---

## Completion Criteria

Dashboard strategy is considered implemented when:

- daily operation can be completed without Telegram
- recovery and approvals are fully local-accessible
- user-visible docs default to `jennifer` command surface
