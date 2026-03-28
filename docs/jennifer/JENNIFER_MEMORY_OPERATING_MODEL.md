# Jennifer Memory Operating Model (Draft v0.1)

## Goal

Define a private shared memory system (`jennifer-memory` repo) for:

- Jennifer orchestrator
- specialist child nodes
- owner-approved self-improvement loop

The system should preserve context continuity, reduce repeated instructions, and support reliable multi-node collaboration.

---

## 1) Repository Structure (proposed)

```text
jennifer-memory/
  README.md
  identity/
    owner-profile.md
    jennifer-charter.md
  memory/
    short-term/
      daily/YYYY-MM-DD.md
      weekly/YYYY-WW.md
    long-term/
      facts.md
      preferences.md
      strategic-goals.md
      constraints.md
  patterns/
    conversation/
      latest.md
      history/YYYY-MM.md
    work/
      latest.md
      history/YYYY-MM.md
  tasks/
    inbox.md
    active/
    done/
  decisions/
    YYYY/
      YYYY-MM-DD-<slug>.md
  proposals/
    pending/
    approved/
    rejected/
  ops/
    recovery-log.md
    restart-log.md
    incident-log.md
  node-state/
    orchestrator.md
    finance-node.md
    ai-code-node.md
    ops-node.md
```

---

## 2) Memory Tiers

### Short-term memory

- recent chats
- active tasks
- temporary assumptions
- rolling context (day/week)

### Long-term memory

- owner preferences and stable profile
- durable goals
- reusable operating rules
- validated lessons from completed cycles

Promotion rule:

- short-term facts become long-term only after repeated validation or explicit owner confirmation.

---

## 3) Pattern Analysis Loop (new requirement)

Jennifer should continuously update patterns from conversation and execution history.

### Inputs

- chat transcripts (owner + channel)
- task execution outcomes
- approvals/rejections
- recovery incidents

### Outputs

- `patterns/conversation/latest.md`
  - preferred response length/tone
  - preferred command style
  - common correction points
- `patterns/work/latest.md`
  - frequent work categories
  - urgency/time-of-day patterns
  - failure/retry hotspots

### Cadence

- light update: daily
- deep update: weekly
- strategic review: monthly

---

## 4) Node Collaboration Rules

### Orchestrator (Jennifer)

- reads everything
- writes everywhere with policy
- assigns tasks to child nodes
- consolidates reports

### Child nodes

- read shared long-term memory + assigned task context
- write only to scoped paths:
  - `node-state/<node>.md`
  - `tasks/active/...`
  - proposal drafts under `proposals/pending/`
- cannot directly mutate core identity/policy files

---

## 5) Approval-Centric Self-Improvement

Every self-improvement should follow:

1. detect friction/opportunity
2. generate proposal
3. classify risk (low/medium/high)
4. request owner approval
5. apply + restart/reload when needed
6. verify metrics
7. auto-rollback on failure threshold

Proposal template should include:

- motivation
- exact changes
- expected benefit
- risk and rollback
- validation plan

---

## 6) Recovery Integration

Recovery events (including Incredible Jenny commands) must be logged under `ops/recovery-log.md` with:

- trigger command
- channel/source
- session id
- action level (soft/session/emergency)
- outcome
- follow-up improvement ticket

---

## 7) Governance Rules

- private repo only
- no secrets in plaintext markdown
- all automation changes require owner approval before apply
- destructive operations require explicit confirmation
- maintain auditability of memory writes and decision updates

---

## 8) Immediate Next Steps

1. Create private `jennifer-memory` repo with this skeleton
2. Connect orchestrator read/write adapters
3. Add daily pattern update job
4. Add proposal template + approval queue
5. Add recovery logging hook
