# Jennifer Practical Rebranding Plan

## Goal

Make Jennifer practically usable as a personal assistant product while keeping OpenClaw engine compatibility.

## Principles

- User-facing surfaces should prefer `jennifer`.
- Internal compatibility with OpenClaw should remain intact.
- Work in small phases with explicit verification before continuing.
- Avoid broad refactors unless required for user-facing consistency.

## Phase 1 — CLI entrypoint

### Scope

- Provide a `jennifer` command path alongside `openclaw`.
- Keep existing `openclaw` compatibility.
- Add only the minimum packaging/entrypoint changes needed.

### Files

- `package.json`
- `jennifer.mjs` (new)

### Verification

- `jennifer --help`
- `jennifer onboard --help`
- `jennifer status --help`
- `openclaw --help` still works

### Completion criteria

- A user can enter the product through `jennifer` without needing `openclaw`.

## Phase 2 — Core docs/guides

### Scope

- Update README and key onboarding/status docs to prefer `jennifer` commands.
- Keep any engine-compatibility note brief and secondary.

### Verification

- README command examples are internally consistent.
- No contradictory `openclaw` first-run commands remain in the primary getting-started path.

## Phase 3 — Runtime-visible strings

### Scope

- Update help/onboarding/status/gateway user-facing strings where safe.
- Keep internal types/module names unchanged unless necessary.

### Verification

- Help and onboarding feel branded as Jennifer.
- Core commands still behave correctly.

## Phase 4 — Personal assistant defaults

### Scope

- Default identity/persona/profile should clearly present Jennifer as the end-user assistant.
- Focus on single-user personal use defaults.

### Verification

- Fresh install/onboard experience reads as Jennifer, not a generic platform.

## Phase 5 — Residual cleanup

### Scope

- Remaining docs, localized docs, screenshots, and user-visible leftovers.

### Verification

- User-facing OpenClaw remnants are minimal.

## Working method

For every phase:

1. Lock scope.
2. Implement only that scope.
3. Run explicit checks.
4. Record outcome.
5. Move to the next phase only after verification.
