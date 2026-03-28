# Jennifer Finance Security Checklist (mandatory)

Use this checklist before enabling or changing any finance node behavior.

## A. Secrets & Credentials

- [ ] API keys stored only in secret manager/environment (no plaintext in repo/logs)
- [ ] Trade keys have **no withdrawal permission**
- [ ] Separate keys per node/environment (dev/stage/prod)
- [ ] Key rotation plan documented

## B. Data Handling

- [ ] Account IDs/order IDs/token values are masked in logs and alerts
- [ ] Sensitive payloads excluded from chat summaries
- [ ] Retention policy defined for finance logs
- [ ] PII/financial snapshots are encrypted at rest when persisted

## C. Access Control

- [ ] Signal node has no execution permission
- [ ] Execution node runs in isolated runtime with least privilege
- [ ] Role scopes documented (read/analyze/execute/audit)
- [ ] Emergency kill-switch tested

## D. Dual Control (Owner + Jennifer)

- [ ] New entry requires explicit owner approval
- [ ] Position size increase requires explicit owner approval
- [ ] Stop-loss override requires explicit owner approval
- [ ] Approval TTL enforced (expired approvals cannot execute)

## E. Risk Limits

- [ ] Per-order notional cap configured
- [ ] Daily loss cap configured
- [ ] Max total exposure configured
- [ ] Whitelist of allowed instruments configured
- [ ] Volatility guard active (suspend in abnormal regime)

## F. Auditability

- [ ] Every order has proposal/approval/execution trail
- [ ] Decision rationale is recorded
- [ ] Rollback/disable procedure documented
- [ ] Incident postmortem template exists

## G. Validation

- [ ] Backtest/simulation completed for target strategy
- [ ] Paper-trading phase completed
- [ ] Small-capital canary phase completed
- [ ] Metrics and fail-safe triggers verified

---

If any mandatory item is unchecked, keep mode at **Advisory** or **Guarded Auto (disabled)**.
