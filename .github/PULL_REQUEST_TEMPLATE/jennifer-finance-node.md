## Jennifer Finance Node PR Checklist (required)

### Scope

- [ ] This PR is finance/trading related
- [ ] Risk band declared (Low/Medium/High)

### Security-first gate

- [ ] I completed `docs/jennifer/JENNIFER_FINANCE_SECURITY_CHECKLIST.md`
- [ ] No plaintext secrets were added
- [ ] Logging/alerts mask sensitive values
- [ ] Execution privileges are least-privilege and isolated

### Dual control gate

- [ ] High-risk actions require owner approval
- [ ] Approval TTL is enforced
- [ ] Kill-switch path tested

### Risk gate

- [ ] Order limits and exposure limits are enforced
- [ ] Stop-loss / volatility guard behavior verified

### Verification

- [ ] Tests or simulation evidence attached
- [ ] Rollback plan documented
- [ ] Audit trail format verified

### Notes

- Summary of changes:
- Security impact:
- Operational impact:
