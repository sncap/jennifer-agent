# Jennifer Install Preflight and Doctor Spec

## Purpose

This document specifies how Jennifer should detect and explain installation/network problems in restricted environments.

It covers two related surfaces:

1. **Install preflight**
   - early checks before or during onboarding
2. **Doctor / diagnostics**
   - deeper checks after install or when something is broken

The goal is to make Jennifer installation reliable in:

- normal networks
- corporate proxy environments
- restricted outbound environments
- environments where Telegram is blocked

---

## 1. Scope

This spec focuses on:

- network classification
- proxy detection
- layered connectivity checks
- result reporting
- recommendation logic

This spec does **not** define:

- low-level HTTP client rewrites
- full Telegram transport redesign
- complete service-manager integration details

---

## 2. Product Goals

The install preflight / doctor flow should help the user answer:

1. Is Jennifer itself installed correctly?
2. Is my network direct, proxied, or restricted?
3. Are npm/GitHub/docs reachable?
4. Are model providers reachable?
5. Is Telegram specifically blocked?
6. Should I keep trying locally, use a proxy, or switch to a remote Telegram topology?

---

## 3. Proposed Commands

## A. Preflight command

Preferred options:

```bash
jennifer doctor --install-preflight
```

Alternative future integration:

```bash
jennifer onboard --preflight
```

### Purpose

- run lightweight environment checks before deeper onboarding
- classify the host/network environment
- provide recommendations without mutating config

---

## B. Doctor command extension

Existing command family should gain enterprise-oriented diagnostics.

Example:

```bash
jennifer doctor --verbose
```

Potential future focused mode:

```bash
jennifer doctor --network
```

### Purpose

- diagnose layered failures after installation
- explain differences between install success and channel failure
- recommend direct/proxy/remote topology

---

## 4. User Journey

## Journey 1 — Before install

User runs preflight and sees:

- proxy detection summary
- install host reachability
- npm/GitHub/docs checks
- provider reachability checks
- Telegram reachability checks
- recommendation

## Journey 2 — During onboarding

Onboarding runs or offers preflight and uses the result to:

- branch prompts
- explain likely restrictions
- defer Telegram if blocked

## Journey 3 — After install

Doctor runs deeper checks and answers:

- is Jennifer core healthy?
- which network layer is failing?
- what next step is recommended?

---

## 5. Layered Check Model

Checks should be grouped into layers.

## Layer 0 — Environment summary

Collect:

- OS / shell / runtime basics
- whether running in WSL / VM / container (when cheaply detectable)
- whether proxy env vars are present
- whether a service manager is likely involved

### Output example

- OS: macOS
- Runtime: Node 24
- Proxy detected: yes
- Proxy type: HTTP/HTTPS
- Service environment: unknown

---

## Layer 1 — Proxy detection

### Inputs

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `ALL_PROXY`
- `NO_PROXY`
- lowercase variants

### Output fields

- detected: yes/no
- proxy type: http / https / socks / mixed / malformed / unknown
- has no_proxy: yes/no
- likely corporate proxy: yes/no

### Behaviors

- parse and validate format without making network calls first
- warn on malformed values
- normalize env display without printing secrets in full

### Example output

- HTTPS_PROXY: set (`http://proxy.company.local:8080`)
- NO_PROXY: set (`127.0.0.1,localhost`)
- Proxy classification: corporate HTTP proxy

---

## Layer 2 — Local runtime checks

### Checks

- `node` available?
- `npm` available?
- `git` available?
- CLI entry available?

### Purpose

Separate missing tooling from network failure.

### Example output

- Node: OK (v24.2.0)
- npm: OK
- Git: OK
- Jennifer CLI: OK

---

## Layer 3 — Basic network checks

### Checks

1. DNS resolution for representative hosts
2. Generic HTTPS fetch
3. timeout classification
4. TLS/certificate classification where possible

### Candidate hosts

- `openclaw.ai`
- `github.com`
- `registry.npmjs.org`

### Output categories

- OK
- BLOCKED
- TIMEOUT
- DNS_FAIL
- TLS_FAIL
- PROXY_FAIL
- UNKNOWN

---

## Layer 4 — Install path checks

### Checks

- install/docs host reachability
- npm registry reachability
- GitHub reachability

### Why separate this layer?

Users often need to know:

- can I install Jennifer at all?
- if install fails, is it npm or GitHub or docs host?

### Output example

- install host (`openclaw.ai`): OK via proxy
- npm registry: OK via proxy
- GitHub: BLOCKED
- Recommendation: prefer installer or approved artifact path instead of git-based install

---

## Layer 5 — Provider connectivity checks

### Checks

Provider checks should be optional and either:

- target a selected provider
- or test a minimal representative provider endpoint

### Candidate providers

- OpenAI
- Anthropic
- Gemini
- OpenRouter

### Output categories

- REACHABLE
- AUTH_MISSING
- AUTH_INVALID
- BLOCKED
- TLS_FAIL
- PROXY_FAIL
- UNKNOWN

### Why this matters

A system may allow npm and GitHub but block AI provider APIs.

---

## Layer 6 — Telegram connectivity checks

### Goal

Determine whether Telegram failure is due to auth, DNS, TCP reachability, TLS, timeout, or policy block.

### Checks

At minimum:

- resolve Telegram Bot API hostname
- attempt lightweight HTTPS reachability to Bot API
- classify timeout/cert/refusal
- if token is present, optionally test a low-cost API call

### Output categories

- DIRECT_OK
- PROXY_OK
- DNS_BLOCKED
- TCP_BLOCKED
- TLS_BLOCKED
- AUTH_INVALID
- TIMEOUT
- UNKNOWN

### Important rule

Telegram failure must not be presented as total install failure if Jennifer core is otherwise healthy.

---

## Layer 7 — Local gateway checks

### Checks

- gateway config readable
- gateway status available
- health endpoint / health RPC reachable
- dashboard URL available

### Purpose

Distinguish:

- network problem
- service not started
- config/auth issue

---

## 6. Output Model

Both preflight and doctor should produce:

1. **human-readable summary**
2. **structured machine-readable result** (future-friendly)

## Human-readable summary

Short example:

- Proxy detected: yes
- npm registry: reachable via proxy
- GitHub: reachable via proxy
- OpenAI: reachable
- Telegram Bot API: blocked
- Jennifer core install: likely to succeed
- Recommended mode: local install + remote Telegram gateway

## Structured result (conceptual)

```json
{
  "environment": {
    "proxy": {
      "detected": true,
      "type": "http"
    }
  },
  "checks": {
    "npm": { "status": "ok", "path": "proxy" },
    "github": { "status": "ok", "path": "proxy" },
    "telegram": { "status": "blocked", "kind": "timeout" }
  },
  "recommendation": {
    "mode": "remote-telegram-gateway",
    "confidence": "high"
  }
}
```

---

## 7. Recommendation Engine

The system should map check outcomes into a recommended next step.

## Recommendation A — direct mode

Criteria:

- no proxy needed or direct path works
- install hosts reachable
- provider reachable
- Telegram reachable

## Recommendation B — direct via proxy

Criteria:

- proxy detected and valid
- install hosts reachable through proxy
- provider reachable through proxy
- Telegram reachable through proxy

## Recommendation C — local install + remote Telegram gateway

Criteria:

- Jennifer core install path is healthy
- provider path is healthy or acceptable
- Telegram path is blocked or unreliable

## Recommendation D — local-only restricted mode

Criteria:

- Jennifer core can be installed
- provider and/or Telegram are intentionally deferred or blocked

## Recommendation E — install blocked

Criteria:

- neither direct nor proxy path can reach required install hosts
- or local runtime prerequisites are missing and cannot be installed

---

## 8. Messaging Rules

The wording should follow these rules:

1. never collapse all problems into “Jennifer failed”
2. say which layer failed
3. say what still works
4. say what to do next

### Good example

“Jennifer core installation is healthy. Telegram is blocked from this host. Recommended next step: keep using the local dashboard or move Telegram connectivity to a remote gateway.”

### Bad example

“Setup failed.”

---

## 9. Onboarding Integration

Preflight should influence onboarding.

### If proxy is detected

- show proxy summary
- offer to continue with detected settings
- warn that service-manager env may differ from shell env

### If Telegram is blocked

- continue onboarding
- mark Telegram as deferred
- recommend remote Telegram gateway mode

### If providers are blocked

- explain that Jennifer can still install
- suggest local-only/dashboard-first setup until provider connectivity is solved

---

## 10. Service Environment Consideration

Doctor should mention whether checks are being run from:

- interactive shell
- configured service environment
- container/VM path when relevant

This matters because proxy env vars often work in a shell but not in launchd/systemd.

### Suggested warning

“Proxy settings are present in the current shell, but the installed Gateway service may not inherit them. Verify the service environment separately.”

---

## 11. Implementation Shape

## Shared library proposal

Create a reusable network diagnostics module used by:

- onboarding preflight
- doctor
- future telemetry/status surfaces

### Suggested responsibilities

- env parsing
- proxy classification
- HTTP reachability checks
- provider endpoint checks
- Telegram endpoint checks
- recommendation generation

This avoids duplicating logic across onboarding and doctor.

---

## 12. Suggested Check Set (MVP)

### MVP for preflight

- proxy env parse
- basic DNS/HTTPS
- install host (`openclaw.ai`)
- npm registry
- GitHub
- one provider endpoint (optional if configured)
- Telegram Bot API host
- recommendation output

### MVP for doctor

- all of the above
- local gateway health
- dashboard reachability
- richer Telegram classification
- stronger provider classification
- service-environment warning

---

## 13. CLI Output Example

## `jennifer doctor --install-preflight`

```text
Jennifer install preflight

Environment
- OS: macOS
- Proxy detected: yes (HTTPS proxy)
- NO_PROXY: 127.0.0.1,localhost

Install path
- openclaw.ai: OK via proxy
- npm registry: OK via proxy
- GitHub: OK via proxy

Providers
- OpenAI: OK

Telegram
- Bot API: BLOCKED (timeout)

Recommendation
- Jennifer core install is likely to succeed.
- Telegram is blocked from this host.
- Recommended mode: local install + remote Telegram gateway.
```

---

## 14. Acceptance Criteria

This spec is implemented successfully when:

1. users can run one command and understand whether install is feasible
2. proxy configuration is detected and explained clearly
3. install-path failures are separated from provider failures
4. provider failures are separated from Telegram failures
5. Telegram blockage yields a topology recommendation instead of a generic failure
6. onboarding can continue when Telegram is blocked but Jennifer core is installable

---

## 15. Recommended Next Steps After This Spec

1. implement proxy env parsing and normalization
2. implement basic layered reachability checks
3. integrate preflight summary into onboarding
4. extend doctor output with recommendation logic
5. add docs for remote Telegram gateway mode
