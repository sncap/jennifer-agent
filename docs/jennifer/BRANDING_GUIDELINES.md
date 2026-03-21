# Jennifer Branding Guidelines

## Purpose

This document defines when to use **Jennifer** vs **OpenClaw** in this repository.

Goal:

- make the product feel like Jennifer to end users
- preserve OpenClaw compatibility internally
- reduce future branding drift
- keep upstream merges practical

---

## Core rule

- **Jennifer** = the user-facing assistant / product persona
- **OpenClaw** = the underlying engine / gateway / codebase / compatibility layer

If a human is **using** the product, prefer **Jennifer**.
If the text is about the **platform internals**, prefer **OpenClaw**.

---

## Use "Jennifer" for

### 1. User-facing assistant identity

- assistant name
- greeting text
- pairing/access messages
- approval confirmations
- onboarding copy shown to end users
- dashboard copy that describes the assistant experience

Examples:

- "Jennifer: access not configured."
- "Jennifer: your access has been approved."
- "Install Jennifer"
- "Control Jennifer"

### 2. First-run/product marketing surfaces

- homepage title/summary
- getting-started docs
- primary onboarding docs
- screenshots/captions where the assistant is the star
- end-user help text

### 3. Persona and conversational UX

- default assistant self-introduction
- branded help/status headings where safe
- user-visible status copy when it represents the assistant product

---

## Use "OpenClaw" for

### 1. Engine / architecture / platform references

- gateway internals
- system architecture explanations
- package/module names
- plugin SDK references
- protocol/runtime descriptions
- source compatibility notes

Examples:

- "powered by the OpenClaw gateway"
- "OpenClaw plugin SDK"
- "OpenClaw config"

### 2. Stable technical identifiers

- npm package names
- repo/module paths
- internal constants
- environment variables
- state directory names
- config keys
- socket names
- temporary directories
- service identifiers when changing them could break compatibility

Examples:

- `openclaw`
- `OPENCLAW_STATE_DIR`
- `~/.openclaw/openclaw.json`
- `openclaw pairing approve ...`

### 3. Compatibility-critical command examples

Keep `openclaw` where the command is still the canonical engine command, unless the `jennifer` alias is explicitly supported and preferred.

Rule of thumb:

- **preferred user path**: show `jennifer`
- **low-level compatibility / fallback / internal recovery**: `openclaw` is acceptable

---

## Writing rules

### Preferred framing

When both names are needed, write them like this:

- "Jennifer runs on the OpenClaw gateway"
- "Install Jennifer (powered by OpenClaw)"
- "Jennifer is the user-facing assistant persona built on OpenClaw"

### Avoid

- Blind global replacement of `OpenClaw` → `Jennifer`
- Renaming internal identifiers just for branding
- Breaking existing config/env/package compatibility
- Creating docs that imply OpenClaw no longer exists

---

## Surface-by-surface guidance

### Safe to brand as Jennifer

- onboarding titles
- doctor/status titles
- dashboard helper copy
- channel approval/access messages
- homepage/getting-started top sections
- user-visible help text

### Usually keep as OpenClaw

- code comments about internals
- SDK/plugin/runtime docs
- env var docs
- config schema docs
- filesystem paths
- service/runtime diagnostics
- package manager install specs

### Needs case-by-case judgment

- FAQ entries
- troubleshooting docs
- browser/gateway diagnostics
- status reports that mix product + engine language
- security docs

For these mixed surfaces:

1. prefer Jennifer in the user goal
2. keep OpenClaw in the technical explanation

---

## Editing workflow

Before changing branding text:

1. Ask: is this user-facing or engine-facing?
2. Check whether changing the string affects compatibility.
3. Prefer the smallest safe edit.
4. Verify command examples still work.
5. Keep wording consistent with this guide.

---

## Review checklist

Before merging a branding change, confirm:

- user-facing copy prefers Jennifer where appropriate
- technical compatibility references still use OpenClaw where needed
- no env var / config key / package path was renamed accidentally
- no fallback or recovery commands were made less accurate
- docs still explain the Jennifer/OpenClaw relationship clearly

---

## Short version

Use this quick test:

- **Am I talking about the assistant the user meets?** → **Jennifer**
- **Am I talking about the engine, config, package, or compatibility layer?** → **OpenClaw**

That is the default rule unless a specific surface has a stronger reason to differ.
