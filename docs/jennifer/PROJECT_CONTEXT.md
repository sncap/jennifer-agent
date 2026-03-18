# Jennifer Project Context

## 1. Overview
Jennifer is an enterprise-grade assistant built as a **branding overlay on top of OpenClaw**.

This project aims to:
- preserve OpenClaw core architecture
- introduce a "Jennifer" identity for enterprise use
- enhance network compatibility for restricted environments
- enable safe integration with external coding agents (e.g., Codex)

---

## 2. Project Goals

### Primary Goals
- Introduce "Jennifer" as the assistant identity
- Maintain upstream compatibility with OpenClaw
- Support enterprise network environments (proxy/firewall)
- Provide safe execution boundaries for automation (Codex, scripts)

### Secondary Goals
- Improve observability for network failures
- Enable extensible adapter-based architecture
- Provide clear configuration for enterprise deployment

---

## 3. Scope

### In Scope (Phase 1)
- Branding overlay (Jennifer identity)
- Telegram assistant identity update
- Greeting/help message override
- Configuration-based branding
- Proxy/firewall compatibility layer
- Minimal safe integration point for external tools (Codex wrapper)

### Out of Scope
- Full repository rename
- Package/module renaming
- Breaking config schema changes
- Replacing OpenClaw core architecture

---

## 4. Architecture Principles

1. **Do not break upstream compatibility**
2. **Minimize core code modifications**
3. **Prefer overlays over rewrites**
4. **Separate concerns clearly**
   - Branding
   - Network
   - Execution
5. **All sensitive values must come from environment variables**
6. **All outbound communication must be controllable**

---

## 5. Branding Strategy

Jennifer branding should be applied to:
- Assistant name
- Greeting messages
- Help responses
- Telegram bot persona
- User-visible UI elements (where safe)

OpenClaw references may remain in:
- Internal module names
- Code structure
- Config keys (unless safe to alias)

---

## 6. Enterprise Constraints

Jennifer must work under:

- Restricted outbound network
- Proxy-only environments
- Firewall-controlled domains
- No direct internet access (optional mode)
- Security/audit requirements

---

## 7. Expected Deliverables

Each feature must include:
- Minimal code change
- Config example
- Documentation update
- Test instructions
- Upgrade impact notes

---

## 8. Development Workflow

Before implementation:

1. Analyze current structure
2. Identify extension points
3. Propose minimal solution
4. Implement in small commits

---

## 9. Non-Functional Requirements

- Security-first design
- Observability (logs, errors)
- Retry-safe network behavior
- Maintainable fork structure
- Easy upstream merge

---

## 10. Definition of Done

A task is complete when:
- Behavior works in enterprise network
- No unintended core modification
- Config is documented
- Risks are explained

