# 07. Electron 구현

## 윈도우 관리

| 윈도우 | 모드 | 사용 시점 |
| --- | --- | --- |
| 메인 윈도우 | 풀 화면 (1280×800) | 대시보드, 회의 전·후 |
| 보조 창 | 폭 400px 고정, 높이 가변 | 회의 중에만 |
| 정리 화면 | 풀 화면 새 윈도우 | 회의 종료 시 |

## 사용 네이티브 API

| 기능 | API |
| --- | --- |
| 윈도우 생성 | `BrowserWindow` |
| Always-on-top | `setAlwaysOnTop(true)` |
| 시스템 알림 | `Notification` |
| 로컬 저장 (창 위치 등) | `electron-store` |
| 마이크 권한 | `session.setPermissionRequestHandler` |
| 자동 업데이트 | `electron-updater` (V2) |
| 트레이 아이콘 | `Tray` (선택) |

## STT 모델 패키징

- Moonshine ONNX 모델을 앱에 동봉하거나 최초 실행 시 다운로드 (방식 미결정 — [09](09-미결정-사항.md))
- 동봉 시 빌드 산출물 용량 증가, 다운로드 시 최초 실행 시간·오프라인 이슈 → 트레이드오프 검토
- 모델 추론은 렌더러 프로세스 또는 Worker에서 수행, 메인 UI 블로킹 방지

## 빌드·배포

- 빌드 도구: `electron-builder`
- 타겟: Windows (.exe, .msi), macOS (.dmg, .pkg)
- 코드 사이닝: 발표 단계에서 결정
- 자동 업데이트 인프라: V2

## 데스크탑 채택으로 인한 결정

- Always-on-top 등 네이티브 경험 활용
- Discord/Zoom과 자연스럽게 병행 실행
- 로컬 STT 추론·모델 패키징을 데스크탑 환경에서 안정적으로 수행
- 트레이드오프: 사용자 설치 부담(웹 대비), macOS·Windows 양쪽 빌드 인프라 필요
