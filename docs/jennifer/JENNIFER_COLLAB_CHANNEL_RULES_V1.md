# Jennifer Collaboration Channel Rules v1

## 채널 구조

- Owner ↔ Jenny(main): 지시/승인/최종 보고
- Jenny ↔ Jennifer(runtime): 실행 위임/결과 수집
- Jennifer child nodes: 전문 작업 실행

## 규칙

1. Owner는 Jenny에게만 지시한다.
2. Jenny가 작업을 분해해 Jennifer에 위임한다.
3. 고위험 작업은 승인 게이트를 통과해야 실행한다.
4. 결과는 Jenny가 검증 후 Owner에게 보고한다.
5. 동일 채널 내 봇 간 자유대화 루프를 금지한다.

## 실행 템플릿

- [GOAL]
- [CONSTRAINT]
- [APPROVAL]
- [DONE]

## 빠른 예시

- GOAL: 대시보드 복구 버튼 실동작
- CONSTRAINT: 코어 변경 최소, 민감로그 금지
- APPROVAL: 코드수정 전 설계 승인
- DONE: 버튼 클릭 시 복구 패널 이동 + 로그 확인
