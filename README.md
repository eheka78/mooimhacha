# 무임하차

대학생 팀플의 무임승차 문제를, 회의 중 **실시간 기여도 가시화**로 해결하는 Electron 데스크탑 앱.

> 회의 앱 옆에 띄우는 폭 400px 사이드 창에서 안건 진행 상태와 발언량·역할 수행도를 실시간으로 보여줍니다.

## 주요 제약

| 제약 | 내용 |
| --- | --- |
| 운영 비용 0원 | STT는 클라이언트 로컬 추론(Moonshine)만 사용. 유료 STT API 금지 |
| 음성 원본 미저장 | 음성은 기기 밖으로 나가지 않음. 서버에는 텍스트만 전송·저장 |
| 방식 B (각자 녹음) | 각자 본인 마이크로 본인 발화만 수집 → 화자 분리 불필요 |
| 사이드 창 폭 | 회의 중 보조 창은 폭 400px 고정 |
| LLM 호출 최소화 | GPT-4o-mini, 회의당 아젠다 생성 1회 + 회의 후 추출 1회 |

## 기술 스택 요약

- **클라이언트**: Electron · React · TypeScript · TailwindCSS · shadcn/ui · Framer Motion
- **STT**: Moonshine ONNX (`transformers.js`) + Silero VAD (`@ricky0123/vad-web`)
- **백엔드**: NestJS · MySQL · WebSocket (캐시는 NestJS 인메모리 — ElastiCache 미사용)
- **인프라**: AWS (Start AWS 학생 프로그램) — EC2 t3.small · RDS MySQL 프리티어 · 서울 리전
- **LLM**: OpenAI GPT-4o-mini (회의당 2회 이내)

자세한 내용은 [docs/01-아키텍처.md](docs/01-아키텍처.md), [docs/10-AWS-인프라-제약.md](docs/10-AWS-인프라-제약.md) 참고.

## 폴더 구조

```
.
├── docs/        # 설계 문서 (아키텍처, 기능 명세, API, STT, 기여도 산정, AWS 제약)
├── design/      # 디자인 시안 (HTML 목업 등)
├── server/      # NestJS 백엔드 (TypeScript) — server/README.md 참고
├── client/      # Electron 클라이언트 (Vite + React + TypeScript) — client/README.md 참고
└── README.md
```

## 문서

| 문서 | 용도 |
| --- | --- |
| [01. 아키텍처 & 기술 스택](docs/01-아키텍처.md) | 데이터 흐름, 스택 |
| [02. 기능 명세](docs/02-기능-명세.md) | 회의 전/중/후/외 기능 |
| [03. 데이터 모델](docs/03-데이터-모델.md) | 엔티티·필드 정의 |
| [04. API 명세](docs/04-API-명세.md) | REST, WebSocket |
| [05. STT 음성 처리](docs/05-STT-음성-처리.md) | Moonshine, VAD, PoC |
| [06. 기여도 산정](docs/06-기여도-산정.md) | 3축 지표·공식·엣지 케이스 |
| [07. Electron 구현](docs/07-Electron-구현.md) | 윈도우 관리, 빌드 |
| [08. 우선순위 & 로드맵](docs/08-우선순위-로드맵.md) | P0/P1/V2, 8주 일정 |
| [09. 미결정 사항](docs/09-미결정-사항.md) | 착수 전 결정 필요 항목 |
| [10. AWS 인프라 & 제약](docs/10-AWS-인프라-제약.md) | Start AWS 제약 + 우리 적용 |
| [11. 프로젝트 구조](docs/11-프로젝트-구조.md) | 저장소 레이아웃·명명·코드 배치 규칙 |

## 협업 가이드

### 브랜치 전략 — GitHub Flow

- `main` — 항상 배포 가능한 상태 (직접 푸시 금지, PR 머지만)
- `feature/<짧은-설명>` — 기능 작업 브랜치 (예: `feature/stt-poc`, `feature/contribution-bar`)
- `fix/<짧은-설명>` — 버그 수정 브랜치

### 커밋 메시지 — Conventional Commits

```
<type>(<scope>): <subject>
```

| type | 용도 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `refactor` | 리팩터링 (동작 변화 없음) |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드·설정·잡일 |

예시: `feat(stt): Moonshine 추론 파이프라인 추가`

### PR

- 작업 브랜치에서 `main`으로 PR 생성
- PR 템플릿 체크리스트를 채우고, 최소 1명 리뷰 후 머지
- 머지 방식은 **Squash and merge** 권장

## 시작하기

### 백엔드 (server/)

```bash
cd server
npm install
npm run start:dev   # http://localhost:3000
```

자세한 내용·환경 변수·다음 단계는 [server/README.md](server/README.md).

### 클라이언트 (client/)

```bash
cd client
npm install
npm run dev         # Electron + Vite 개발 모드 (HMR)
```

자세한 내용·다음 단계는 [client/README.md](client/README.md).
