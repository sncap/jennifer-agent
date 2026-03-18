# Jennifer Architecture Guardrails

## 1. Core Rule

OpenClaw core must remain:
- readable
- mergeable
- minimally modified

---

## 2. Allowed Changes

### Safe Zones
- Configuration layer
- Adapter layer
- Wrapper scripts
- Branding messages
- Documentation

### Conditional Changes
- Channel adapters (Telegram, etc.)
- Network request layer (only via abstraction)

---

## 3. Forbidden Changes

- Broad rename of modules/packages
- Large refactoring of core logic
- Hardcoding credentials
- Introducing hidden side-effects
- Bypassing security controls

---

## 4. Layered Architecture

Jennifer should follow this structure:

