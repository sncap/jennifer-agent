# Jennifer Emergency Session Recovery

## Purpose

This document defines how Jennifer should recover when a live messaging session becomes unhealthy, including cases where:

- the assistant repeats itself
- the Telegram-linked session becomes stuck or confused
- the conversation no longer progresses normally
- a human needs a fast, reliable way to restore a healthy session

The goal is to prevent prolonged communication breakdown between the user and Jennifer.

---

## 1. Problem Statement

In real usage, a Telegram-connected assistant session can become unhealthy in ways that are visible to the user but hard for the system to fix automatically.

Examples:

- Jennifer repeats the same answer or phrasing
- Jennifer gets trapped in a loop and does not advance the conversation
- session context becomes confused or stale
- internal state may be healthy enough to keep replying, but not healthy enough to be useful
- manual recovery currently requires PC-side intervention and direct session reset

This creates an avoidable reliability problem.

Jennifer needs a **deliberate recovery path** that is:

- easy for the owner to invoke
- safe against accidental triggering
- strong enough to restore communication
- careful not to destroy durable memory

---

## 2. Core Principle

Emergency recovery should reset **conversation/session state**, not Jennifer's identity or long-term memory.

### Must preserve

- identity/persona
- long-term memory files
- workspace data
- backlog/design docs
- durable configuration

### May reset

- the currently unhealthy chat session
- recent transient conversation context
- stuck session-local state
- pending reply loop state
- selected background execution state when clearly tied to the unhealthy session

The aim is:

> reset the broken conversation, not erase Jennifer as a person/product.

---

## 3. Recovery Levels

Jennifer should support multiple recovery strengths.

## Level 1 — Soft Reset

### Purpose

Interrupt unhealthy repetition without fully tearing down the messaging session.

### When to use

- repeated wording
- obvious conversational looping
- stale framing
- assistant needs to "start fresh" in the same chat

### Expected effect

- clears transient reply framing
- stops repetition loop
- keeps the same surface/channel session alive if possible
- re-anchors to current message and durable memory

### Example owner commands

- `제니 정리해`
- `JENNIFER_SOFT_RESET`

---

## Level 2 — Session Reset

### Purpose

Discard the current messaging/session context and start a fresh session for the same user/channel.

### When to use

- Telegram-linked agent session is clearly unhealthy
- assistant keeps repeating or misunderstanding despite soft reset
- conversation state is beyond local cleanup

### Expected effect

- current chat session is replaced or restarted
- new session rehydrates from durable memory and identity files
- prior transient context is discarded
- owner can continue talking without manual PC-side repair

### Example owner commands

- `제니 세션초기화`
- `JENNIFER_SESSION_RESET`

---

## Level 3 — Emergency Recovery

### Purpose

Provide a stronger recovery path when the issue may involve not just chat state but stuck runtime/session coordination.

### When to use

- session reset is insufficient
- repeated loops keep returning
- Telegram-linked runtime seems stuck
- background state or routing may be involved

### Expected effect

- current unhealthy session is reset
- stuck sub-session/runtime state may be cleaned up
- basic service/gateway health should be rechecked
- owner receives a short recovery status report

### Example owner commands

- `제니 비상복구`
- `JENNIFER_EMERGENCY_RECOVERY`

---

## 4. Command Design

## Recommended command style

Use explicit, uncommon phrases to reduce accidental activation.

### Preferred internal commands

- `JENNIFER_SOFT_RESET`
- `JENNIFER_SESSION_RESET`
- `JENNIFER_EMERGENCY_RECOVERY`

### Friendly natural-language aliases

- `제니 정리해`
- `제니 세션초기화`
- `제니 비상복구`
- `인크래더블제니 정리`
- `인크래더블제니 리셋`
- `인크래더블제니 초기화`

### Why both?

- natural language is easy for the owner
- explicit uppercase commands are safer and unambiguous
- implementation can initially support the explicit forms first

---

## 5. Authorization Rules

Recovery commands must be protected.

### Hard rules

- direct chat only, unless a future policy explicitly allows otherwise
- authorized/owner sender only
- no execution from forwarded/quoted historical text
- no execution from quoted examples or documentation snippets

### Additional safety

For stronger commands, Jennifer may require a one-step confirmation.

#### Suggested policy

- Soft Reset: confirm optional
- Session Reset: confirm once
- Emergency Recovery: either confirm once or allow no-confirm only for explicitly trusted owner IDs

---

## 6. Confirmation Policy

## Recommended default

### Soft Reset

- can run immediately for the trusted owner

### Session Reset

- require short confirmation by default

Example:

> Current Telegram session looks unhealthy. Reset this session and start fresh? Reply `확인` to continue.

### Emergency Recovery

Two valid policy options:

#### Safer default

- require confirmation

#### Owner-fast-path

- if sender is the explicitly trusted owner, run immediately
- otherwise require confirmation

I recommend the safer default first unless the system has a very reliable owner-only identity boundary.

---

## 7. Recovery Behaviors

## A. Soft Reset behavior

### Actions

- stop current repetition/looping behavior
- discard recent transient reasoning frame
- ignore recent broken response chain
- re-anchor on the latest owner message
- preserve session identity if possible

### Owner-facing result

> 정리했어요. 지금 메시지 기준으로 다시 이어갈게요.

---

## B. Session Reset behavior

### Actions

1. authenticate recovery command
2. identify the current messaging session
3. terminate or replace the unhealthy session state
4. start a fresh session for the same surface/user
5. rehydrate from durable context:
   - identity/persona
   - user preferences
   - recent memory files
   - stable system rules
6. send short recovery completion notice

### Must not do

- erase memory files
- reset workspace files
- destroy unrelated sessions

### Owner-facing result

> 주인님, 현재 Telegram 세션을 초기화했고 새 세션으로 다시 연결했어요. 장기 기억은 유지했고, 꼬인 대화 상태만 버렸습니다.

---

## C. Emergency Recovery behavior

### Actions

1. authenticate command
2. capture minimal recovery breadcrumb/log
3. reset the unhealthy session
4. clear obviously stuck session-local state
5. inspect whether the gateway/runtime path looks healthy
6. if needed, recommend the next recovery action
7. send short structured recovery summary

### Optional additional actions

- stop related stuck background conversation loops
- clear stale routing/session lock artifacts if safe
- prompt a gateway health check if the messaging surface still looks unstable

### Owner-facing result

> 비상복구를 수행했습니다.
>
> - 세션 초기화: 완료
> - 임시 꼬임 상태 정리: 완료
> - 현재 상태: 정상 / 추가 점검 필요

---

## 8. Recovery Breadcrumbs

Jennifer should write a small recovery record for analysis and future improvement.

### Recommended fields

- timestamp
- triggering command
- sender/channel
- recovery level
- current session key if available
- whether confirmation was required
- outcome
- short reason if known (looping / repeated replies / session confusion)

### Important constraint

Breadcrumbs should be small and operational, not a full transcript dump.

---

## 9. Automatic Loop Detection (Future Enhancement)

In addition to manual recovery commands, Jennifer should eventually detect likely failure loops.

### Candidate signals

- same answer pattern repeated 2-3 times
- nearly identical reply emitted repeatedly
- assistant fails to incorporate new user input over several turns
- repeated refusal/repair loop without state change

### Recommended behavior

Do not auto-reset immediately.
Instead say something like:

> 반복 루프 가능성이 있어요. 원하시면 `JENNIFER_SESSION_RESET`으로 현재 세션을 초기화할 수 있어요.

This keeps the human in control.

---

## 10. Integration with Self-Improvement

Emergency recovery should feed Jennifer's self-improvement loop.

If recovery commands are used repeatedly, Jennifer should learn that:

- a session reliability bug exists
- a specific messaging surface may be fragile
- a better auto-detection or repair mechanism is needed

This means recovery events should become input for:

- self-improvement backlog
- reliability reports
- design priorities

---

## 11. Recommended Initial Rollout

## Phase 1 — Manual owner-only recovery

Implement first:

- `JENNIFER_SESSION_RESET`
- `JENNIFER_EMERGENCY_RECOVERY`
- authorized sender only
- direct chat only
- durable memory preserved

## Phase 2 — Guided confirmation and structured reporting

Add:

- confirmation flow
- clearer result summaries
- breadcrumb logging

## Phase 3 — Smart suggestions

Add:

- loop detection hints
- recommendation to invoke reset when a session appears unhealthy

## Phase 4 — Safer automatic assists

Add:

- optional low-risk soft reset heuristics
- richer runtime cleanup only when confidence is high

---

## 12. UX Principles

Recovery UX should be:

- short
- reliable
- explicit
- non-scary

### Good message style

- "세션을 초기화했고 다시 이어갈 준비가 됐어요."
- "장기 기억은 유지했고, 꼬인 대화 상태만 정리했어요."

### Bad message style

- vague internal jargon
- long technical error dumps
- uncertain wording after recovery

The owner should feel that Jennifer is back, not that the system has become more confusing.

---

## 13. Non-Goals

This system should **not**:

- erase Jennifer's long-term memory automatically
- wipe workspace state broadly
- act on recovery commands from unauthorized users
- silently run destructive recovery flows without safeguards

---

## 14. Recommended First Implementation

The best first implementation is:

1. add an owner-only emergency command parser
2. support `JENNIFER_SESSION_RESET`
3. support `JENNIFER_EMERGENCY_RECOVERY`
4. preserve durable memory
5. return a short success report
6. log a small breadcrumb for later analysis

This gives immediate practical value without requiring a full autonomous recovery system.

---

## 15. Summary

Jennifer should have a recovery mechanism because reliability matters more than polish when communication breaks down.

The correct model is:

- preserve identity and long-term memory
- reset unhealthy session state
- keep the owner in control
- support stronger recovery levels only when needed

That makes Jennifer safer, more trustworthy, and more resilient as a long-term personal assistant.
