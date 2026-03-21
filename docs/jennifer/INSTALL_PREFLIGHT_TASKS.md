# Jennifer Install Preflight Tasks

This file breaks the install preflight / doctor spec into implementation work.

---

## Track A — Shared Diagnostics Foundation

### A1. Create shared diagnostics module

- Status: todo
- Goal:
  - one reusable implementation for onboarding preflight and doctor
- Scope:
  - proxy env parsing
  - result types
  - status categories
  - recommendation generation

### A2. Define structured result schema

- Status: todo
- Goal:
  - normalize output for CLI and future JSON/status usage
- Scope:
  - environment summary
  - layered checks
  - recommendation block

---

## Track B — Proxy Detection

### B1. Parse proxy env vars

- Status: todo
- Scope:
  - `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY`
  - lowercase variants
- Deliverable:
  - normalized internal proxy summary

### B2. Validate proxy formats safely

- Status: todo
- Goal:
  - detect malformed values early
  - avoid printing secrets in cleartext

### B3. Add shell vs service warning hook

- Status: todo
- Goal:
  - warn users that service-manager env may differ from shell env

---

## Track C — Layered Connectivity Checks

### C1. Basic DNS/HTTPS checks

- Status: todo
- Scope:
  - DNS resolve representative hosts
  - generic HTTPS request
  - timeout classification

### C2. Install-path checks

- Status: todo
- Scope:
  - `openclaw.ai`
  - `registry.npmjs.org`
  - `github.com`
- Goal:
  - explain whether Jennifer can be installed from this machine

### C3. Provider reachability checks

- Status: todo
- Scope:
  - selected provider endpoints
  - classify blocked vs auth-missing vs auth-invalid

### C4. Telegram reachability checks

- Status: todo
- Scope:
  - Bot API hostname resolution
  - lightweight HTTPS reachability
  - optional token-backed validation if configured
- Output categories:
  - direct ok
  - proxy ok
  - dns blocked
  - tcp blocked
  - tls blocked
  - auth invalid
  - timeout
  - unknown

### C5. Local gateway health checks

- Status: todo
- Scope:
  - gateway status
  - health endpoint / health RPC
  - dashboard availability

---

## Track D — Recommendation Engine

### D1. Implement recommendation mapping

- Status: todo
- Outputs:
  - direct mode
  - direct via proxy
  - local install + remote Telegram gateway
  - local-only restricted mode
  - install blocked

### D2. Add confidence levels

- Status: todo
- Goal:
  - mark recommendations as high / medium / low confidence

### D3. Add actionable next-step strings

- Status: todo
- Goal:
  - each recommendation includes a useful next action

---

## Track E — CLI Surface

### E1. Add `jennifer doctor --install-preflight`

- Status: todo
- Goal:
  - lightweight, non-mutating environment check

### E2. Add human-readable layered report output

- Status: todo
- Goal:
  - clear output grouped by Environment / Install Path / Providers / Telegram / Recommendation

### E3. Add machine-readable output mode

- Status: todo
- Candidate:
  - `--json`
- Goal:
  - future automation and supportability

### E4. Add onboarding preflight hook

- Status: todo
- Goal:
  - onboarding can optionally call the same diagnostics logic before channel setup

---

## Track F — Messaging / UX Rules

### F1. Separate install success from Telegram success in summaries

- Status: todo
- Goal:
  - if Telegram is blocked, onboarding still reports core install success when appropriate

### F2. Add “deferred channel success” wording

- Status: todo
- Example:
  - Jennifer installed successfully
  - Telegram setup deferred because the network blocks Telegram API access

### F3. Add provider-vs-network wording

- Status: todo
- Goal:
  - distinguish auth errors from network/proxy errors clearly

---

## Track G — Follow-on Docs

### G1. Link preflight spec from enterprise install docs

- Status: todo
- Goal:
  - make the docs chain discoverable

### G2. Add Telegram connectivity modes doc

- Status: todo
- Goal:
  - explain direct vs proxied vs remote Telegram setups

### G3. Add remote Telegram gateway doc

- Status: todo
- Goal:
  - document the recommended topology for blocked corporate hosts

---

## Suggested Implementation Order

### Batch 1 — Minimum useful implementation

1. B1 Parse proxy env vars
2. B2 Validate proxy formats safely
3. C1 Basic DNS/HTTPS checks
4. C2 Install-path checks
5. D1 Recommendation mapping
6. E1 `jennifer doctor --install-preflight`
7. E2 Human-readable layered report

### Batch 2 — High-value enterprise improvements

1. C4 Telegram reachability checks
2. C3 Provider reachability checks
3. F1 Separate install success from Telegram success
4. E4 Onboarding preflight hook
5. D3 Actionable next-step strings

### Batch 3 — Polishing and automation

1. C5 Local gateway health checks
2. D2 Confidence levels
3. E3 JSON output
4. F2 Deferred channel success wording
5. F3 Provider-vs-network wording

---

## Definition of Done

This effort is done when:

1. a user can run one command and learn whether Jennifer can be installed from the current host
2. proxy presence is explained clearly
3. install-path, provider, and Telegram failures are separated
4. the tool recommends remote Telegram gateway mode when appropriate
5. onboarding can continue even when Telegram is blocked but Jennifer core is healthy
