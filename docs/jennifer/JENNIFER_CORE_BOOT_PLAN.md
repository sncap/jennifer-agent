# Jennifer Core Boot Plan (Execution-first)

## 목표

OpenClaw 리브랜딩 단계에서 벗어나, **독립된 Jennifer Core**를 빠르게 가동한다.

핵심 원칙:

1. 무한 고민 금지 — 작게 만들고 바로 검증
2. 코어 우선 — 안정/복구/승인/기억을 먼저 고정
3. 확장 후행 — 멀티노드/도메인 기능은 코어 위에 확장

---

## Core MVP (must-have)

### C1. Control Surface

- Dashboard + CLI로 운영 가능 (Telegram 비의존)
- Overview에서 즉시 액션(승인/복구/로그/새로고침)

### C2. Reliability

- reset/new/recovery 이후에도 명령 실행 안정
- 오류 시 원인/복구 경로를 즉시 제시

### C3. Approval Loop

- 개선 제안 → 사용자 승인 → 반영
- 승인 없는 코어 변경 금지

### C4. Memory Backbone

- `jennifer-memory` private 구조를 기준으로 단기/장기/결정/작업 분리
- 대화/업무 패턴 분석 결과를 주기 갱신

---

## 7-Day Execution Sprint

### Day 1-2

- 코어 운영 UX 고정 (Dashboard quick actions + runbook)
- Go-live gate 핵심 항목 재검증

### Day 3-4

- approval queue 최소동작 연결
- recovery 액션 동선 고정

### Day 5

- memory backbone 파일 구조 적용
- 패턴 분석 리포트(초안) 자동 생성 시작

### Day 6

- 제안 1건 생성/승인/반영/검증 사이클 1회 수행

### Day 7

- Jennifer Core v0 운영 선언 (conditional)
- 남은 리스크/백로그 정리

---

## Done Criteria (Core MVP)

- Dashboard에서 승인/복구/상태 확인이 즉시 가능
- 명령 실패/멈춤 시 복구 루트가 재현 가능
- 패턴 분석 기반 개선 제안 1회 이상 성공
- 사용자 체감: "OpenClaw rebrand"가 아닌 "Jennifer core"로 동작

---

## 운영 규칙

- "완벽"보다 "안정적 전진"
- 매일 결과물을 남긴다 (commit + short changelog)
- 코어 변경은 작게, 확장 변경은 빠르게
