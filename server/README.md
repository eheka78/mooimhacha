# 무임하차 — 백엔드 (NestJS)

무임하차 프로젝트의 백엔드 서버. **NestJS 11 + TypeScript + Node.js**.

운영 환경 설계는 [../docs/01-아키텍처.md](../docs/01-아키텍처.md), AWS 제약은 [../docs/10-AWS-인프라-제약.md](../docs/10-AWS-인프라-제약.md) 참고.

## 빠른 시작

```bash
cd server
npm install        # 최초 1회
npm run start:dev  # 개발 모드 (변경 자동 재시작)
```

기본 포트: **3000** (환경 변수 `PORT`로 변경 가능)

## 주요 명령

| 명령 | 용도 |
| --- | --- |
| `npm run start` | 일반 실행 |
| `npm run start:dev` | watch 모드 (개발용, 권장) |
| `npm run start:prod` | 빌드 산출물(`dist/`) 실행 |
| `npm run build` | TypeScript 빌드 → `dist/` |
| `npm run lint` | ESLint 실행 |
| `npm run format` | Prettier 포맷팅 |
| `npm run test` | 유닛 테스트 |
| `npm run test:e2e` | E2E 테스트 |

## 다음 단계 (구현 착수 시)

지금은 NestJS 기본 보일러플레이트만 깔린 상태. 다음 모듈을 단계별로 추가한다:

1. **MySQL 연결** — DB 엔진은 RDS MySQL 프리티어로 확정. 다만 **DB 접근 방식(ORM/쿼리 빌더/raw SQL)과 마이그레이션 도구는 미결정** — 팀원 구성·역할 협의 후 결정. [docs/09 §정책 결정](../docs/09-미결정-사항.md) 참조
   - `@nestjs/config`로 환경 변수 로딩은 어떤 방식이든 공통이므로 먼저 도입 가능: `npm i @nestjs/config`
2. **WebSocket Gateway** — 회의 중 발화 브로드캐스트, 0.5초 디바운스
   - `npm i @nestjs/websockets @nestjs/platform-socket.io`
3. **카카오 OAuth + JWT** — `passport-kakao` + `@nestjs/jwt`
4. **인메모리 카운터 + 5초 RDS flush** — 사용자별 누적 글자수 집계 (Redis 미사용, [10-AWS-인프라-제약](../docs/10-AWS-인프라-제약.md) 참조)
5. **OpenAI GPT-4o-mini 클라이언트** — 회의당 아젠다 생성 1회 + 회의 후 추출 1회

## 환경 변수 (착수 시 `.env` 작성)

협업자에게 공유할 키 목록:

```bash
# 서버
PORT=3000

# DB (RDS MySQL 프리티어)
DB_HOST=<rds-endpoint>
DB_PORT=3306
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=mooimhacha

# JWT
JWT_SECRET=<랜덤 32+ 바이트>
JWT_EXPIRES_IN=7d

# 카카오 OAuth
KAKAO_CLIENT_ID=<카카오 콘솔에서 발급>
KAKAO_CLIENT_SECRET=<카카오 콘솔에서 발급>
KAKAO_REDIRECT_URI=http://<ec2-ip>:3000/api/auth/kakao/callback

# OpenAI
OPENAI_API_KEY=<sk-...>
```

`.env`는 `.gitignore`에 의해 추적 제외. EC2에는 SSH로 직접 작성하거나 SSM Parameter Store에서 주입.

## 배포 (운영)

EC2 t3.small + Docker. 자세한 흐름은 [../docs/10-AWS-인프라-제약.md](../docs/10-AWS-인프라-제약.md) §배포 흐름 참조.

> 현재 `Dockerfile`·`docker-compose.yml`은 아직 없다. 인프라 셋업 단계에서 추가한 뒤 아래 명령을 사용한다.

```bash
# EC2에서 (Dockerfile·docker-compose.yml 작성 이후)
cd ~/mooimhacha
git pull
docker compose up -d --build
docker compose logs -f nest
```

## 폴더 구조

```
server/
├── src/
│   ├── app.module.ts       # 루트 모듈
│   ├── app.controller.ts   # 헬스 체크용 기본 컨트롤러
│   ├── app.service.ts
│   └── main.ts             # bootstrap, 포트 listen
├── test/                   # e2e 테스트
├── nest-cli.json
├── tsconfig.json
└── package.json
```
