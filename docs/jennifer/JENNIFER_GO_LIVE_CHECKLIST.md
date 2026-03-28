# Jennifer Go-Live Checklist (v0.1)

## 목적

Jennifer 전환을 "빠르게" 진행하되, 대화/업무 실패 상태에서 이동하지 않기 위한 최소 검증 체크리스트.

---

## Gate 1 — Conversation Stability

- [ ] 일반 지시 응답 정상 (누락/무응답 없음)
- [ ] `/new` 후 정상 tool 실행 확인
- [ ] `/reset` 후 정상 tool 실행 확인
- [ ] 긴 지시(다단계)에서 요약/결과 보고 누락 없음

## Gate 2 — Local Operations (Dashboard/CLI)

- [ ] `jennifer gateway` 실행/상태 확인
- [ ] `jennifer dashboard` 접근 가능
- [ ] 대시보드에서 현재 세션/상태 확인 가능
- [ ] Telegram 불가 상황에서도 로컬에서 운영 지속 가능

## Gate 3 — Execution Reliability

- [ ] 파일 편집 + 테스트 + 결과 보고 일관성
- [ ] "진행해줘" 요청 시 로컬 + GitHub 반영 동작 확인
- [ ] 실패 시 원인/대안/다음 액션을 함께 보고

## Gate 4 — Recovery & Rollback

- [ ] `인크래더블제니 정리` 동작 확인
- [ ] `인크래더블제니 리셋` 동작 확인
- [ ] `인크래더블제니 초기화` 동작 확인
- [ ] 복구 후 1회 정상 대화/업무 수행 확인

---

## 오늘(즉시) 실행 항목

1. 사용자 노출 명령어 표면 Jennifer 우선화(1차 완료)
2. Dashboard local-first 운영전략 문서화(완료)
3. Recovery 명령 alias 정리(완료)
4. Go-live 체크리스트 문서 확정(본 문서)
5. 내일 실전 테스트 시나리오 준비

---

## 내일 실전 테스트 시나리오 (집중)

### 시나리오 A: 기본 지시 수행

- 목표: 단순/중간/복합 지시 3종 성공

### 시나리오 B: 상태 꼬임 복구

- 목표: reset/new/recovery 명령 후 tool 실행 정상화 확인

### 시나리오 C: 로컬 중심 운영

- 목표: Telegram 없이 dashboard + CLI만으로 운영/제어

### 시나리오 D: 승인형 개선 루프

- 목표: 제안서 1건 생성 → 승인 → 반영 → 검증

---

## Go/No-Go 판정

- **Go**: Gate 1~4 핵심 항목 모두 통과
- **Conditional Go**: 경미 이슈 1~2건, 우회 가능 + 복구 경로 명확
- **No-Go**: 대화/명령 실패 반복 또는 복구 불안정
