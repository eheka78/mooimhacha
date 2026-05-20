# 무임하차 — 클라이언트 (Electron)

회의 중 폭 400px 사이드 창에서 안건·기여도를 실시간으로 보여주는 Electron 데스크탑 앱.

베이스 보일러플레이트: [electron-vite-react](https://github.com/electron-vite/electron-vite-react) (Electron 33 + Vite 5 + React 18 + TypeScript).

운영 환경 설계는 [../docs/01-아키텍처.md](../docs/01-아키텍처.md), STT 처리는 [../docs/05-STT-음성-처리.md](../docs/05-STT-음성-처리.md) 참고.

## 빠른 시작

```bash
cd client
npm install        # 최초 1회
npm run dev        # 개발 모드 (HMR, 자동 재시작)
```

`npm run dev`는 Vite 개발 서버를 띄우고 Electron 메인 프로세스를 함께 실행한다.

## 주요 명령

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 개발 모드 (Vite + Electron, HMR) |
| `npm run build` | TypeScript 컴파일 → Vite 빌드 → electron-builder 패키징 (`release/`에 산출) |
| `npm run preview` | 빌드 산출물 미리보기 |
| `npm run test` | Vitest 유닛 테스트 |

## 폴더 구조

```
client/
├── electron/                # Electron 메인·프리로드 프로세스
│   ├── main/                # BrowserWindow, IPC, 시스템 통합
│   ├── preload/             # 렌더러 ↔ 메인 브리지
│   └── electron-env.d.ts
├── src/                     # React 렌더러 (UI)
│   ├── App.tsx
│   ├── main.tsx
│   ├── assets/
│   ├── components/          # 공용 컴포넌트 (보일러플레이트의 update 컴포넌트 포함)
│   └── demos/               # IPC/노드 데모 (필요 없으면 정리 예정)
├── public/                  # 정적 자산
├── build/                   # electron-builder 아이콘·리소스
├── test/                    # 테스트
├── electron-builder.json    # 패키징 설정 (appId: com.mooimhacha.app)
├── vite.config.ts
├── tailwind.config.js       # Tailwind v3 설정 (실제 활용은 UI 구현 시)
└── package.json
```

## 다음 단계 (구현 착수 시)

지금은 보일러플레이트 + 우리 프로젝트 메타데이터만 정리된 상태. 다음 모듈을 단계별로 추가한다:

1. **보일러플레이트 데모 정리** — `src/App.tsx`·`src/demos/`·`src/components/update/`는 템플릿 데모 코드. UI 구현 착수 시 제거 또는 교체.
2. **상태관리 도입** — Zustand 또는 React Query (`docs/01` 기준)
3. **shadcn/ui 도입** — Tailwind는 이미 설정됨, shadcn CLI로 컴포넌트 추가
4. **회의 중 사이드 창** — `BrowserWindow` width 400px, always-on-top 옵션 ([../docs/07-Electron-구현.md](../docs/07-Electron-구현.md))
5. **STT 파이프라인** — `@ricky0123/vad-web` + `transformers.js` (Moonshine ONNX). 클라이언트 로컬 추론, 음성은 기기 밖으로 나가지 않음.
6. **WebSocket 클라이언트** — 서버(NestJS Gateway)와 발화 텍스트 송수신
7. **electron-store** — 로컬 설정 저장

## 환경 변수 (착수 시 `.env` 작성)

```bash
# 서버 엔드포인트 (개발 시 localhost, 운영 시 EC2 퍼블릭 IP)
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트 번들에 노출한다.

## 알려진 보일러플레이트 부산물

- `src/demos/` — IPC/Node 데모 코드. 실제 기능 구현 전 정리 예정.
- `src/components/update/` — `electron-updater` 데모 컴포넌트. 자동 업데이트 도입 여부 결정 후 정리.
- `electron-updater` 의존성 — 현재 패키징·자동 업데이트 인프라 없음. 사용 결정 시 publish URL 설정 필요.
