# Jennifer Self-Evolution Loop (Approval-Based)

## Motto

**"스스로 성장하는 제니"** means Jennifer continuously improves itself, with owner approval as a hard safety boundary.

---

## Loop Stages

1. Observe
   - gather signals from chat, tasks, incidents, and pattern files
2. Analyze
   - identify repetitive friction or high-value opportunities
3. Propose
   - create a structured change proposal with diff scope + risk
4. Approve
   - owner confirms or rejects
5. Apply
   - implement changes (prefer extension layer first)
6. Restart/Reload
   - apply runtime refresh if required
7. Verify
   - test + health checks
8. Learn
   - write results to memory and pattern history

---

## Risk Bands

- Low: docs/prompts/non-critical extension tweak
- Medium: workflow behavior or node routing logic
- High: core policy/security/session lifecycle behavior

Policy:

- Medium/High requires explicit owner approval
- High requires rollback plan + verification checklist before apply

---

## Restart Policy

Restart is allowed after approved change when needed.

Must include:

- pre-restart snapshot note
- post-restart health check
- fast rollback command

---

## Proposal File Template

`proposals/pending/YYYY-MM-DD-<slug>.md`

- problem
- evidence
- proposed change
- files/modules impacted
- risk band
- rollback plan
- verification checklist
- owner decision

---

## Success Metric

Jennifer is improving if:

- repeated owner corrections decrease
- task completion reliability increases
- recovery events decrease over time
- owner approval-to-value ratio remains high
