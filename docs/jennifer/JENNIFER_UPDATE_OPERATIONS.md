# Jennifer Update Operations (Stable Runtime Rule)

## 목적

운영 중 `doctor/update`가 반복되며 시간을 소모하는 상황을 방지하고, 업데이트를 통제된 절차로 수행한다.

---

## 핵심 운영 규칙 (고정)

1. **운영 시간에는 update 금지**
   - 실사용/검증/작업 중에는 `doctor`의 update 제안을 기본적으로 `No`로 선택.

2. **업데이트는 별도 유지보수 창에서만 수행**
   - 작업 중단 가능한 시간에만 update 실행.

3. **dirty working tree 상태에서는 update 진행하지 않음**
   - 먼저 변경사항 정리(commit/stash/restore) 후 update.

4. **업데이트 직후 필수 검증**
   - `jennifer status`
   - `jennifer channels status --probe`
   - `jennifer doctor` (update는 No)

5. **문제 발생 시 즉시 롤백 경로 확보**
   - 직전 커밋 SHA 기록
   - 서비스 재시작/복구 절차 문서화

---

## 권장 절차

### A) 운영 모드 (기본)

1. 기능 개발/검증 수행
2. `doctor` 실행 시 update 질문은 `No`
3. 변경사항은 작게 커밋 후 push

### B) 업데이트 모드 (유지보수 창)

1. `git status` clean 확인
2. update 수행
3. 빌드/의존성 재검증
4. 상태 점검(위 3개 명령)
5. 이상 없을 때만 운영 모드 복귀

---

## 빠른 체크리스트

- [ ] 지금 운영 시간인가?
- [ ] working tree가 clean인가?
- [ ] update 후 상태검증 3종을 통과했는가?
- [ ] 실패 시 복구 커맨드를 준비했는가?

이 체크리스트가 모두 Yes일 때만 update를 진행한다.
