# Jennifer Enterprise Install Plan

## Purpose

This document defines how Jennifer should be installed and brought online reliably in:

- corporate proxy environments
- restricted outbound networks
- firewall-controlled offices
- setups where Telegram is partially or fully blocked

The immediate goal is **installation success and first-run reliability**.
A secondary goal is to support **Telegram connectivity through either direct, proxied, or remote-topology deployment models**.

---

## 1. Product Goal

Jennifer should feel like a personal assistant product, not a fragile developer tool.

For enterprise/restricted environments, that means:

1. users can understand their network mode quickly
2. install failures are diagnosed by layer
3. Jennifer can still be installed even if Telegram is blocked
4. Telegram connectivity has documented fallback topologies
5. proxy/firewall constraints are treated as first-class product requirements

---

## 2. Phase 2 Focus

### Phase 2A — Install reliability

Priority:

- make Jennifer install cleanly in restricted environments
- detect network/proxy problems early
- separate install success from Telegram success

### Phase 2B — Telegram topology support

Priority:

- support direct Telegram access when possible
- support proxy-based Telegram access where allowed
- support remote Telegram gateway topologies when direct access is blocked

### Phase 2C — Personal-agent UX

Priority:

- make Jennifer feel like a single-owner assistant
- improve onboarding defaults for personal deployment
- simplify post-install first use

This document focuses primarily on **Phase 2A**.

---

## 3. Problem Statement

Today, Jennifer/OpenClaw works well in normal networks, but enterprise environments introduce multiple independent failure classes:

1. Node/npm install path blocked
2. GitHub or docs host blocked
3. model provider endpoints blocked
4. Telegram Bot API blocked
5. TLS interception / custom corporate CA issues
6. direct internet unavailable but proxy available
7. local install succeeds but channel connectivity fails

Users often experience these as one generic failure:

- “install doesn’t work”
- “Telegram doesn’t connect”
- “onboarding hangs”

The product needs clearer separation and better fallback paths.

---

## 4. Design Principles

1. **Install first, channels second**
   - Jennifer core install must succeed independently of Telegram connectivity.

2. **Detect before failing**
   - Run cheap network checks early and explain recommendations.

3. **Corporate proxy is a primary scenario**
   - Not an edge case.

4. **Do not break OpenClaw compatibility**
   - Keep existing env vars, config structure, and CLI compatibility where possible.

5. **Topology matters**
   - If a host cannot reach Telegram, recommend a different deployment topology instead of pretending retrying will help.

6. **Explain the failure layer**
   - DNS, HTTPS, npm, GitHub, provider, Telegram, dashboard, and gateway should be diagnosable separately.

---

## 5. Installation Outcome We Want

A successful install experience should allow one of these outcomes:

### Outcome A — Full direct mode

- Jennifer installed locally
- Gateway healthy
- provider auth configured
- Telegram direct connectivity works

### Outcome B — Full proxied mode

- Jennifer installed locally
- Gateway healthy
- provider auth configured via proxy
- Telegram direct API access works through proxy

### Outcome C — Local core, remote Telegram topology

- Jennifer installed locally
- Gateway healthy for local dashboard / tools / provider access
- Telegram is blocked on this machine
- installer/doctor recommends remote Telegram gateway mode

### Outcome D — Local-only restricted mode

- Jennifer installed locally
- local UI and direct use work
- messaging channels intentionally deferred

Outcome C should be treated as a valid success state, not a failure.

---

## 6. User Environment Classification

Installer/onboarding should classify the environment early.

### Prompted network modes

- Direct internet
- Corporate HTTP/HTTPS proxy
- SOCKS proxy
- Restricted network / not sure

### Derived dimensions

- DNS reachable?
- HTTPS direct reachable?
- npm reachable?
- GitHub reachable?
- OpenClaw/Jennifer docs/install endpoints reachable?
- provider endpoint reachable?
- Telegram Bot API reachable?

This classification should drive recommendations.

---

## 7. Proposed Install Flow

## Stage 0 — Preflight classification

Before or at the start of onboarding:

- detect proxy env vars:
  - `HTTP_PROXY`
  - `HTTPS_PROXY`
  - `ALL_PROXY`
  - `NO_PROXY`
  - lowercase variants
- detect likely corporate environment hints
- ask user whether they are in a restricted network if uncertain

### Output

A short classification summary, e.g.:

- Proxy detected: yes
- Direct HTTPS: no
- npm registry: reachable via proxy
- Telegram Bot API: blocked
- Recommended mode: local install + remote Telegram gateway

---

## Stage 1 — Base install

Goal:

- install Node if needed
- install Jennifer/OpenClaw CLI
- verify CLI runs

This stage should not fail just because Telegram is blocked.

### Requirements

- proxy-aware install path
- clear npm/GitHub failures
- optional dry-run / test-only mode

---

## Stage 2 — Core runtime validation

Goal:

- gateway starts
- local dashboard opens
- config path and state path work
- provider connectivity can be tested separately

### Success definition

If the Gateway and dashboard work locally, core install is considered successful.

---

## Stage 3 — Provider validation

Goal:

- validate configured model provider endpoints
- distinguish auth failure from network failure
- distinguish proxy failure from provider outage

### Output examples

- OpenAI reachable
- Anthropic blocked by proxy policy
- Gemini reachable but auth missing

---

## Stage 4 — Channel validation

Goal:

- validate Telegram connectivity independently of install/provider health
- recommend topology when blocked

### Telegram results should classify into:

- direct OK
- proxy OK
- DNS blocked
- TCP blocked
- TLS blocked
- auth invalid
- unknown timeout

---

## 8. Key Feature Proposals

## Feature 1 — Installer network preflight

### Purpose

Identify likely enterprise network problems before install or onboarding proceeds too far.

### Checks

- DNS resolution
- generic HTTPS fetch
- npm registry
- GitHub
- install host / docs host
- selected provider endpoint(s)
- Telegram Bot API endpoint

### UX

Preflight summary shown as:

- OK / WARN / BLOCKED
- recommendation string

### Example

- npm registry: OK (via proxy)
- GitHub: OK (via proxy)
- provider: OK
- Telegram Bot API: BLOCKED
- Recommendation: install Jennifer locally, use remote Telegram gateway mode

---

## Feature 2 — Proxy-aware onboarding

### Purpose

Treat proxy/corporate networking as a first-class onboarding path.

### Requirements

- auto-detect proxy env vars
- allow manual proxy entry
- validate proxy format
- document `NO_PROXY`
- explain corporate CA/TLS interception issues
- show which layers honor proxy settings and which do not

### Future enhancement

Offer onboarding choice:

- direct network
- corporate proxy
- SOCKS proxy
- not sure / diagnose for me

---

## Feature 3 — Enterprise doctor

### Purpose

Make post-install diagnosis useful in real corporate environments.

### Doctor sections

- Proxy detection
- DNS/HTTPS health
- npm/GitHub/install host health
- provider reachability
- Telegram reachability
- local gateway health
- dashboard health
- topology recommendation

### Example recommendation output

“Jennifer is installed correctly. Telegram is blocked from this host. Recommended next step: run Telegram on a remote gateway and connect this machine as a worker/node.”

---

## Feature 4 — Telegram connectivity modes

### Goal

Support multiple deployment topologies explicitly.

### Mode A — direct

This machine talks to Telegram Bot API directly.

### Mode B — direct via proxy

This machine talks to Telegram Bot API through configured proxy.

### Mode C — remote Telegram gateway

A separate machine handles Telegram connectivity; this machine hosts local tools/workspace or acts as a node/worker.

### Why this matters

In many offices, Telegram will never work reliably from the corporate machine. The product should recommend topology changes instead of implying local retries will solve it.

---

## Feature 5 — Decision guide for users

Jennifer docs should include a simple decision table.

| Environment                       | Local Install                                     | Telegram Strategy | Recommended Mode                     |
| --------------------------------- | ------------------------------------------------- | ----------------- | ------------------------------------ |
| Home / unrestricted               | Yes                                               | Direct            | Direct mode                          |
| Corporate proxy, Telegram allowed | Yes                                               | Proxy             | Direct via proxy                     |
| Corporate proxy, Telegram blocked | Yes                                               | Remote            | Local core + remote Telegram gateway |
| Fully restricted / no outbound    | Yes (if dependencies reachable via approved path) | None initially    | Local-only restricted mode           |

---

## 9. Telegram Topology Design

## Recommended topology for corporate users

### Topology 1 — local everything

Use only when Telegram API is reachable from the corporate machine.

### Topology 2 — local Jennifer core + remote Telegram gateway

Recommended when Telegram is blocked by the company network.

#### Structure

- local corporate machine:
  - Jennifer workspace
  - tools
  - local dashboard
  - possibly local provider access
- remote machine (home server / VPS / personal Mac):
  - Telegram gateway connectivity
  - always-on chat ingress

#### Benefits

- avoids Telegram firewall restrictions on the corporate host
- keeps personal workflow continuity via Telegram
- lets enterprise workstation still perform useful local work

### Topology 3 — remote-first Jennifer + local node/worker

Use when the corporate machine cannot host reliable internet egress for messaging, but can participate as a controlled node.

---

## 10. Documentation Additions Needed

### New docs to add

1. `docs/jennifer/ENTERPRISE_INSTALL_PLAN.md` (this document)
2. `docs/jennifer/CORPORATE_PROXY_INSTALL.md`
3. `docs/jennifer/TELEGRAM_CONNECTIVITY_MODES.md`
4. `docs/jennifer/REMOTE_TELEGRAM_GATEWAY.md`

### Existing docs to extend

- install docs
- onboarding docs
- Telegram docs
- troubleshooting docs
- doctor/status docs

---

## 11. Success Criteria

Phase 2A is complete when:

1. installer can classify direct vs proxy vs restricted environments
2. install docs include a corporate proxy path
3. onboarding separates install success from Telegram success
4. doctor reports layer-specific network failures
5. Telegram-blocked corporate installs produce a clear remote-topology recommendation

Phase 2B is complete when:

1. Telegram connectivity modes are documented
2. remote Telegram gateway topology is documented and testable
3. direct/proxy/remote recommendations are clear from diagnostics

---

## 12. Non-Goals

For this phase, we are **not** trying to:

- fully rename OpenClaw internals
- redesign the entire networking stack
- guarantee Telegram works from every corporate host
- replace all direct provider integrations with a central proxy layer

The near-term goal is reliability, diagnosability, and practical topology guidance.

---

## 13. Recommended Implementation Order

### Track A — Docs / UX first

1. Add enterprise install planning docs
2. Add proxy/corporate install guide
3. Add Telegram connectivity modes guide
4. Update onboarding docs with enterprise branch

### Track B — Runtime diagnostics

1. add network preflight checks
2. add proxy detection reporting
3. add provider vs Telegram reachability separation
4. add topology recommendation output

### Track C — Topology support

1. document remote Telegram gateway pattern
2. define supported local-core + remote-gateway workflow
3. clarify node/worker role for corporate workstations

---

## 14. Practical Recommendation for Jennifer

Short term:

- make Jennifer install succeed reliably in corporate proxy environments
- make Telegram blockage non-fatal
- teach users the recommended topology when Telegram is blocked

Mid term:

- make remote Telegram gateway mode a documented first-class deployment pattern
- improve personal-agent defaults after installation succeeds

That is the most practical path to making Jennifer truly usable as a personal assistant in real office environments.
