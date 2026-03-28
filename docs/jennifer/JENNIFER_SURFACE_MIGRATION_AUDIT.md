# Jennifer Surface Migration Audit (Draft v0.1)

## Scope

Audit user-visible surfaces that still show OpenClaw-first wording/commands, and define migration priority to Jennifer-first experience.

---

## A. Updated in this pass

### README / Docs

- README command examples shifted toward `jennifer ...` first
- Added local-first dashboard strategy reference
- Project context updated from pure rebrand to private self-evolving Jennifer system

### Wizard / Onboarding text

- setup wizard command hints changed from `openclaw ...` to `jennifer ...` for key recovery/config/security paths

### CLI Help examples

- channels/security/nodes/qr examples now show `jennifer ...` commands first

---

## B. Remaining OpenClaw residue categories

1. Compatibility mentions (acceptable)
   - docs links, package names, internal paths, env vars
2. User-facing command examples (high priority)
   - remaining example strings should prefer `jennifer`
3. Product naming in UI copy (medium priority)
   - labels/titles that still read OpenClaw-first
4. Developer/test-only strings (low priority)
   - keep as-is unless they leak to users

---

## C. Dashboard Review & Prioritized Improvements

### Priority 1 (must-have)

1. **Node Control Card**
   - orchestrator + child node status
   - node health, last heartbeat, active task
2. **Approval Queue Card**
   - pending self-improvement proposals
   - approve/reject + risk level badge
3. **Recovery Card (Incredible Jenny)**
   - soft/session/emergency actions
   - recent recovery log summary
4. **Memory Sync Card**
   - `jennifer-memory` sync state + last successful write

### Priority 2 (should-have)

1. Pattern Insight Card (conversation/work trends)
2. Active Goals Card (long-term goals + current progress)
3. Incident/Restart Timeline Card

### Priority 3 (nice-to-have)

1. Proposal impact simulator
2. Node workload balancing hints
3. Autonomy score trend

---

## D. Migration policy

- User-facing command examples: `jennifer` first
- `openclaw` remains documented only as compatibility alias/internal foundation
- Avoid deep core renames that hurt upstream mergeability

---

## E. Next implementation slice

1. Sweep remaining non-test CLI help examples to `jennifer`
2. Add dashboard copy pass: title/labels to Jennifer-first
3. Add dashboard backlog tickets for P1 cards above
4. Wire recovery logs + proposal queue data providers for dashboard cards
