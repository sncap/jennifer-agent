# Jennifer Memory Integration v1

## 목적

Jennifer가 `jennifer-memory`(private repo)를 안정적으로 읽고/기록하여 멀티노드 협업의 단일 기억 소스로 사용한다.

Repository: https://github.com/sncap/jennifer-memory

---

## 1) 기본 원칙

1. `jennifer-memory`는 기록 시스템(SoR)으로 사용한다.
2. 민감정보는 평문 저장 금지(마스킹/요약 저장).
3. 고위험 변경은 승인 후 기록한다.
4. 운영 중에는 작은 단위로 자주 기록한다.

---

## 2) 쓰기 규칙

### Orchestrator (Jennifer)

- 쓰기 가능:
  - `memory/short-term/daily/*`
  - `patterns/*/latest.md`
  - `tasks/inbox.md`, `tasks/active/*`, `tasks/done/*`
  - `decisions/YYYY/*`
  - `proposals/pending|approved|rejected/*`
  - `ops/*`
  - `node-state/*`

### Child Nodes

- 제한 쓰기:
  - `node-state/<node>.md`
  - 할당된 `tasks/active/*`
  - `proposals/pending/*` 초안

---

## 3) 기록 사이클

- 이벤트 기반: 중요한 결정/승인/실패 즉시 기록
- 일일 요약: short-term daily 갱신
- 주간 정리: 패턴/장기기억 승격 여부 검토

---

## 4) 파일 템플릿 (권장)

### decision

```
# YYYY-MM-DD <slug>
- context:
- decision:
- reason:
- risk:
- rollback:
```

### proposal

```
# YYYY-MM-DD <slug>
- problem:
- proposal:
- risk-band:
- approval-required: yes/no
- verification:
```

---

## 5) 운영 커맨드(수동)

```bash
# clone
cd ~/IdeaProjects
git clone git@github.com:sncap/jennifer-memory.git

# update
cd ~/IdeaProjects/jennifer-memory
git pull --rebase

# save
git add .
git commit -m "memory: <summary>"
git push
```

---

## 6) 금지사항

- API 키/토큰/계좌 원문 저장 금지
- 승인 전 확정 기록으로 승격 금지
- 노드 간 무제한 쓰기 권한 부여 금지

---

## 7) Definition of Done

- Jennifer가 daily/task/decision/proposal/ops를 일관되게 기록
- 패턴 파일이 주기적으로 갱신
- 감사 가능한 변경 이력 유지
