# Jennifer Enterprise Install Tasks

This file turns the enterprise install plan into a practical implementation backlog.

---

## Track 1 — Discovery and Documentation

### T1-1. Add enterprise install plan document

- Status: done
- File: `docs/jennifer/ENTERPRISE_INSTALL_PLAN.md`
- Goal: define the overall architecture and phased plan

### T1-2. Add corporate proxy install guide

- Status: todo
- Proposed file: `docs/jennifer/CORPORATE_PROXY_INSTALL.md`
- Scope:
  - explain direct vs proxy vs restricted installs
  - list supported proxy env vars
  - explain npm/git/provider considerations
  - explain corporate CA / TLS interception issues

### T1-3. Add Telegram connectivity modes guide

- Status: todo
- Proposed file: `docs/jennifer/TELEGRAM_CONNECTIVITY_MODES.md`
- Scope:
  - direct mode
  - direct-via-proxy mode
  - remote Telegram gateway mode
  - decision matrix by network environment

### T1-4. Add remote Telegram gateway guide

- Status: todo
- Proposed file: `docs/jennifer/REMOTE_TELEGRAM_GATEWAY.md`
- Scope:
  - architecture diagrams
  - recommended host choices (home Mac, VPS, server)
  - security notes
  - examples

---

## Track 2 — Installer / Onboarding UX

### T2-1. Add network mode question to onboarding

- Status: todo
- Goal:
  - classify environment as direct / corporate proxy / SOCKS / unknown
- Deliverable:
  - onboarding prompt branch
  - summary stored in onboarding state

### T2-2. Detect proxy environment variables automatically

- Status: todo
- Scope:
  - `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY`
  - lowercase variants
- Deliverable:
  - normalized proxy summary in onboarding / doctor

### T2-3. Add install preflight mode

- Status: todo
- Example CLI:
  - `jennifer doctor --install-preflight`
  - or `jennifer onboard --preflight`
- Scope:
  - DNS
  - HTTPS
  - npm registry
  - GitHub
  - docs/install host
  - provider endpoint
  - Telegram Bot API

### T2-4. Separate core install success from channel success

- Status: todo
- Goal:
  - onboarding should not frame Telegram failure as total install failure
- Deliverable:
  - explicit messaging in onboarding summary

---

## Track 3 — Diagnostics / Doctor

### T3-1. Add proxy detection section to doctor

- Status: todo
- Output:
  - detected proxy vars
  - malformed proxy warnings
  - no-proxy notes

### T3-2. Add layered network checks

- Status: todo
- Layers:
  - DNS
  - generic HTTPS
  - npm/GitHub
  - provider connectivity
  - Telegram connectivity

### T3-3. Add topology recommendation output

- Status: todo
- Example outputs:
  - direct mode recommended
  - direct via proxy recommended
  - remote Telegram gateway recommended
  - local-only restricted mode recommended

### T3-4. Distinguish Telegram failure categories

- Status: todo
- Categories:
  - DNS blocked
  - TCP blocked
  - TLS blocked
  - auth invalid
  - timeout / unknown

---

## Track 4 — Telegram / Enterprise Network Support

### T4-1. Verify Telegram client path honors proxy configuration

- Status: todo
- Goal:
  - confirm whether current Telegram channel HTTP stack honors env proxy settings
- Deliverable:
  - implementation note and test matrix

### T4-2. Add documented remote Telegram gateway topology

- Status: todo
- Goal:
  - make corporate-host Telegram blockage a supported deployment pattern

### T4-3. Add enterprise troubleshooting section to Telegram docs

- Status: todo
- Scope:
  - firewall-blocked Telegram
  - proxy-based access
  - remote gateway recommendation

---

## Track 5 — Personal-Agent Usability After Install

### T5-1. Define personal-owner default setup profile

- Status: todo
- Scope:
  - single owner defaults
  - durable DM allowlist guidance
  - minimal secure setup for Telegram users

### T5-2. Improve post-install summary

- Status: todo
- Goal:
  - after onboarding, Jennifer should clearly tell users:
    - what worked
    - what is blocked
    - how to continue

### T5-3. Add “corporate install succeeded, Telegram deferred” success state

- Status: todo
- Goal:
  - reduce false perception of total failure

---

## Suggested Implementation Order

### First batch (highest value)

1. T1-2 Corporate proxy install guide
2. T2-2 Proxy env detection
3. T2-3 Install preflight
4. T3-1 Proxy detection in doctor
5. T3-3 Topology recommendation output

### Second batch

1. T4-1 Telegram proxy verification
2. T4-3 Telegram enterprise troubleshooting
3. T2-4 Separate install success from channel success
4. T5-2 Improve post-install summary

### Third batch

1. T1-3 Connectivity modes guide
2. T1-4 Remote Telegram gateway guide
3. T5-1 Personal-owner default setup profile
4. T5-3 Deferred Telegram success state

---

## Definition of Success

We should consider this effort successful when a user in a corporate proxy environment can:

1. install Jennifer successfully
2. understand whether proxy config is being used
3. see whether Telegram is blocked specifically
4. receive a recommended next step instead of a generic failure
5. choose either direct Telegram, proxied Telegram, or remote Telegram gateway mode
