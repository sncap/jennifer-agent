# Jennifer P0 Stabilization Plan (Execution)

## Goal

Make Jennifer reliably operable as a standalone runtime before additional feature expansion.

## P0 Scope

1. Command surface consistency (`jennifer` first, compatibility paths documented)
2. Runtime startup reliability (no dependency/link break surprises)
3. Doctor/update operational stability (no update-loop during normal operation)
4. Telegram group collaboration predictability (mention/task gating)
5. Fast operator diagnostics (single command/script for status snapshot)

---

## Work Items

### P0-1 Command Surface Hygiene

- Audit user-facing docs for command ambiguity
- Keep one canonical operator flow (`jennifer ...`)
- Document compatibility fallback (`openclaw ...`) only in troubleshooting

### P0-2 Runtime Health Guard

- Add a stable health check command/script that avoids interactive update prompts
- Verify gateway/channels/doctor flow under clean boot and restart scenarios

### P0-3 Update Loop Guard

- Enforce operational rule: skip update during active operations
- Explicit maintenance-window update process only

### P0-4 Group Collaboration Guard

- Verify default mode / free-response mode toggle behavior
- Ensure stop words (`STOP`, `PAUSE`, `기본모드`, `임시모드 종료`) return to default mode

### P0-5 Incident Triage Baseline

- Standardize first-response checklist when “no response / hang” occurs
- Include logs path and minimum recovery commands

---

## Exit Criteria (P0 Complete)

- Operator can run one command and get clear runtime health summary
- Group collaboration responds predictably with no observed loop in smoke test
- Update checks no longer interrupt regular operations
- Basic recovery from non-response takes under 3 minutes
