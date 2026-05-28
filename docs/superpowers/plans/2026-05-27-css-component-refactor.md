# CSS 분리 + 공통 컴포넌트 추출 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `global.css` 2,614줄을 역할별 파일로 분리하고, 페이지 간 중복되는 Modal/Card JSX 패턴을 공통 컴포넌트로 추출한다.

**Architecture:** CSS는 섹션 주석 기준으로 페이지별 파일로 분리하고 각 페이지 컴포넌트에서 직접 import. Modal/Card는 props 기반 컴포넌트로 추출해 기존 페이지에서 사용. 기존 클래스명, 스타일, 동작 일체 변경 없음.

**Tech Stack:** React 18, TypeScript, CSS (plain), Vite

---

## 파일 구조

**생성:**

- `client/src/components/Modal.tsx`
- `client/src/components/Card.tsx`
- `client/src/styles/login.css`
- `client/src/styles/onboarding.css`
- `client/src/styles/home.css`
- `client/src/styles/dashboard.css`

**수정:**

- `client/src/styles/global.css` — 4개 페이지 섹션 제거
- `client/src/pages/login/LoginPage.tsx` — login.css import
- `client/src/pages/onboarding/OnboardingPage.tsx` — onboarding.css import
- `client/src/pages/home/HomePage.tsx` — home.css import, Card 적용
- `client/src/pages/dashboard/DashboardPage.tsx` — dashboard.css import
- `client/src/pages/dashboard/overview/OverviewPage.tsx` — Card 적용
- `client/src/pages/dashboard/tasks/TasksPage.tsx` — Modal 적용
- `client/src/pages/dashboard/meeting/MeetingPage.tsx` — Modal 적용 (3개)
- `client/src/pages/dashboard/report/ReportPage.tsx` — Card 적용

---

## Task 1: Modal 컴포넌트 생성

**Files:**

- Create: `client/src/components/Modal.tsx`

- [ ] **Step 1: 파일 생성**

`client/src/components/Modal.tsx`를 아래 내용으로 생성:

```tsx
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions: ReactNode;
}

export default function Modal({
  title,
  onClose,
  children,
  actions,
}: ModalProps) {
  return (
    <div
      className="modal-bg open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-ttl">
          {title}
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add client/src/components/Modal.tsx
git commit -m "feat: Modal 공통 컴포넌트 추가"
```

---

## Task 2: Modal → TasksPage 적용

**Files:**

- Modify: `client/src/pages/dashboard/tasks/TasksPage.tsx`

- [ ] **Step 1: import 추가**

`TasksPage.tsx` 상단에 추가:

```tsx
import Modal from "@/components/Modal";
```

- [ ] **Step 2: 모달 JSX 교체**

`TasksPage.tsx`에서 `{modalOpen && (` 블록 전체를 아래로 교체:

```tsx
{
  modalOpen && (
    <Modal
      title="태스크 추가"
      onClose={() => setModalOpen(false)}
      actions={
        <>
          <button className="btn" onClick={() => setModalOpen(false)}>
            취소
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalOpen(false);
              showToast("태스크가 추가되었습니다");
            }}
          >
            추가
          </button>
        </>
      }
    >
      <div className="modal-sub">
        담당자와 마감일을 지정하면 기여도에 자동 반영됩니다.
      </div>
      <div className="field">
        <label className="field-label">태스크 이름</label>
        <input className="input" placeholder="예) 발표 자료 수정" />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">담당자</label>
          <select className="input">
            <option>김민준</option>
            <option>이서연</option>
            <option>박지호</option>
            <option>최유나</option>
            <option>전원</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">마감일</label>
          <input className="input" type="date" />
        </div>
      </div>
      <div className="field">
        <label className="field-label">상태</label>
        <select className="input">
          <option>할 일</option>
          <option>진행 중</option>
          <option>완료</option>
        </select>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: 브라우저 확인**

`/dashboard/tasks`에서 "태스크 추가" 버튼 클릭 → 모달 열림/닫힘/배경클릭 닫힘 확인.

- [ ] **Step 4: 커밋**

```bash
git add client/src/pages/dashboard/tasks/TasksPage.tsx
git commit -m "refactor: TasksPage Modal 컴포넌트로 교체"
```

---

## Task 3: Modal → MeetingPage 적용 (3개)

**Files:**

- Modify: `client/src/pages/dashboard/meeting/MeetingPage.tsx`

- [ ] **Step 1: import 추가**

`MeetingPage.tsx` 상단에 추가:

```tsx
import Modal from "@/components/Modal";
```

- [ ] **Step 2: "meeting" 모달 교체**

`{modalOpen === "meeting" && (` 블록 전체를 아래로 교체:

```tsx
{
  modalOpen === "meeting" && (
    <Modal
      title="새 회의 만들기"
      onClose={() => setModalOpen(null)}
      actions={
        <>
          <button className="btn" onClick={() => setModalOpen(null)}>
            취소
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalOpen(null);
              showToast("새 회의가 생성되었습니다");
            }}
          >
            회의 생성
          </button>
        </>
      }
    >
      <div className="modal-sub">
        아젠다를 미리 작성하면 회의 효율이 올라갑니다.
      </div>
      <div className="field">
        <label className="field-label">회의 이름</label>
        <input className="input" placeholder="예) 중간 점검 회의" />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">날짜</label>
          <input className="input" type="date" />
        </div>
        <div className="field">
          <label className="field-label">시간</label>
          <input className="input" type="time" defaultValue="15:00" />
        </div>
      </div>
      <div className="field">
        <label className="field-label">
          아젠다 <span className="opt">(줄바꿈으로 구분)</span>
        </label>
        <textarea
          className="input"
          rows={3}
          placeholder={"1. 진행 상황 공유\n2. 역할 재조정"}
        />
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: "decision" 모달 교체**

`{modalOpen === "decision" && (` 블록 전체를 아래로 교체:

```tsx
{
  modalOpen === "decision" && (
    <Modal
      title="결정 사항 추가"
      onClose={() => setModalOpen(null)}
      actions={
        <>
          <button className="btn" onClick={() => setModalOpen(null)}>
            취소
          </button>
          <button className="btn btn-primary" onClick={addDecision}>
            추가
          </button>
        </>
      }
    >
      <div className="field">
        <label className="field-label">결정 내용</label>
        <textarea
          className="input"
          rows={3}
          placeholder="회의에서 결정된 내용을 입력하세요"
          value={decInput}
          onChange={(e) => setDecInput(e.target.value)}
        />
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: "agenda" 모달 교체**

`{modalOpen === "agenda" && (` 블록 전체를 아래로 교체:

```tsx
{
  modalOpen === "agenda" && (
    <Modal
      title="아젠다 추가"
      onClose={() => setModalOpen(null)}
      actions={
        <>
          <button className="btn" onClick={() => setModalOpen(null)}>
            취소
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalOpen(null);
              showToast("아젠다가 추가되었습니다");
            }}
          >
            추가
          </button>
        </>
      }
    >
      <div className="field">
        <label className="field-label">아젠다 내용</label>
        <input className="input" placeholder="예) 최종 발표 순서 확정" />
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">소요 시간 (분)</label>
          <input className="input" type="number" defaultValue={10} min={1} />
        </div>
        <div className="field">
          <label className="field-label">담당</label>
          <select className="input">
            <option>김민준</option>
            <option>이서연</option>
            <option>박지호</option>
            <option>최유나</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: 브라우저 확인**

`/dashboard/meeting`에서 `+` 버튼, 결정사항 탭 추가 버튼, 아젠다 추가 버튼 각각 클릭 → 모달 정상 동작 확인.

- [ ] **Step 6: 커밋**

```bash
git add client/src/pages/dashboard/meeting/MeetingPage.tsx
git commit -m "refactor: MeetingPage Modal 컴포넌트로 교체 (3개)"
```

---

## Task 4: Card 컴포넌트 생성

**Files:**

- Create: `client/src/components/Card.tsx`

- [ ] **Step 1: 파일 생성**

`client/src/components/Card.tsx`를 아래 내용으로 생성:

```tsx
import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  icon: string;
  title: string;
  titleSuffix?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}

export default function Card({
  icon,
  title,
  titleSuffix,
  extra,
  children,
  style,
}: CardProps) {
  return (
    <div className="card" style={style}>
      <div className="card-head">
        <span className="card-title">
          <i className={icon} /> {title}
          {titleSuffix}
        </span>
        {extra}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add client/src/components/Card.tsx
git commit -m "feat: Card 공통 컴포넌트 추가"
```

---

## Task 5: Card → OverviewPage 적용

**Files:**

- Modify: `client/src/pages/dashboard/overview/OverviewPage.tsx`

- [ ] **Step 1: import 추가**

```tsx
import Card from "@/components/Card";
```

- [ ] **Step 2: "기여도 현황" 카드 교체**

기존:

```tsx
<div className="card">
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-chart-bar" /> 기여도 현황{" "}
      <span className="live-dot" style={{ background: "var(--green)" }} />
    </span>
    <span className="badge b-green">실시간</span>
  </div>
  <div style={{ padding: "2px 18px 14px" }}>
    {CONTRIB.map(...)}
  </div>
</div>
```

교체 후:

```tsx
<Card
  icon="ti ti-chart-bar"
  title="기여도 현황"
  titleSuffix={
    <span className="live-dot" style={{ background: "var(--green)" }} />
  }
  extra={<span className="badge b-green">실시간</span>}
>
  <div style={{ padding: "2px 18px 14px" }}>
    {CONTRIB.map((c) => (
      <div key={c.name} className="contrib-row">
        <span className="c-name">{c.name}</span>
        <span className="c-bar">
          <i data-w={c.pct} style={{ background: c.color }} />
        </span>
        <span
          className="c-pct"
          style={c.pct === 8 ? { color: c.color } : undefined}
        >
          {c.pct}%
        </span>
        <span
          className="c-task"
          style={c.taskColor ? { color: c.taskColor } : undefined}
        >
          {c.task}
        </span>
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 3: "진행 중 태스크" 카드 교체**

기존:

```tsx
<div className="card">
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-checklist" /> 진행 중 태스크
    </span>
  </div>
  <div style={{ padding: "2px 16px 14px" }}>
    {[...].map(...)}
  </div>
</div>
```

교체 후:

```tsx
<Card icon="ti ti-checklist" title="진행 중 태스크">
  <div style={{ padding: "2px 16px 14px" }}>
    {[
      { done: true, name: "시장 조사 보고서", who: "민준", due: undefined },
      {
        done: false,
        name: "UI 와이어프레임",
        who: "",
        due: "내일",
        dueColor: "var(--coral)",
      },
      {
        done: false,
        name: "발표 슬라이드 초안",
        who: "",
        due: "내일",
        dueColor: "var(--coral)",
      },
      {
        done: false,
        name: "기술 스택 문서화",
        who: "",
        due: "5/12",
        dueColor: "var(--text-soft)",
      },
    ].map((t, i) => (
      <div key={i} className="task-mini">
        <div className={`chk-mini ${t.done ? "done" : ""}`}>
          {t.done && <i className="ti ti-check" />}
        </div>
        <div
          style={{
            flex: 1,
            textDecoration: t.done ? "line-through" : undefined,
            color: t.done ? "var(--text-soft)" : undefined,
          }}
        >
          {t.name}
        </div>
        {t.due && (
          <span style={{ color: t.dueColor, fontWeight: 700 }}>{t.due}</span>
        )}
        {t.who && <span style={{ color: "var(--text-soft)" }}>{t.who}</span>}
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 4: "최근 회의" 카드 교체**

기존:

```tsx
<div className="card">
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-calendar" /> 최근 회의
    </span>
  </div>
  <div style={{ padding: "2px 16px 14px" }}>
    {[...].map(...)}
  </div>
</div>
```

교체 후:

```tsx
<Card icon="ti ti-calendar" title="최근 회의">
  <div style={{ padding: "2px 16px 14px" }}>
    {[
      {
        name: "킥오프 회의",
        badge: "b-green",
        status: "완료",
        meta: "5월 1일 · 38분",
      },
      {
        name: "중간 점검",
        badge: "b-green",
        status: "완료",
        meta: "5월 5일 · 52분",
      },
      {
        name: "발표 준비 회의",
        badge: undefined,
        status: "진행 중",
        meta: "오늘 오후 3시",
        spill: true,
      },
    ].map((m) => (
      <div key={m.name} className="meeting-mini">
        <div className="mm-top">
          <span>{m.name}</span>
          {m.spill ? (
            <span className="spill spill-live">{m.status}</span>
          ) : (
            <span className={`badge ${m.badge}`}>{m.status}</span>
          )}
        </div>
        <div className="mm-meta">{m.meta}</div>
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 5: 브라우저 확인**

`/dashboard/overview` 진입 → 카드 레이아웃 기존과 동일한지 확인.

- [ ] **Step 6: 커밋**

```bash
git add client/src/pages/dashboard/overview/OverviewPage.tsx
git commit -m "refactor: OverviewPage Card 컴포넌트로 교체"
```

---

## Task 6: Card → HomePage, ReportPage 적용

**Files:**

- Modify: `client/src/pages/home/HomePage.tsx`
- Modify: `client/src/pages/dashboard/report/ReportPage.tsx`

- [ ] **Step 1: HomePage import 추가**

`HomePage.tsx` 상단에 추가:

```tsx
import Card from "@/components/Card";
```

- [ ] **Step 2: "내 태스크" 카드 교체**

기존:

```tsx
<div className="card" style={{ marginBottom: 14 }}>
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-checklist" /> 내 태스크
    </span>
    <span className="card-link">{tasks.length}개</span>
  </div>
  <div style={{ padding: "2px 12px 12px" }}>...</div>
</div>
```

교체 후:

```tsx
<Card
  icon="ti ti-checklist"
  title="내 태스크"
  extra={<span className="card-link">{tasks.length}개</span>}
  style={{ marginBottom: 14 }}
>
  <div style={{ padding: "2px 12px 12px" }}>
    {tasks.length === 0 ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
          padding: "22px 0",
          color: "var(--text-soft)",
        }}
      >
        <i
          className="ti ti-circle-check"
          style={{ fontSize: 28, color: "var(--green)" }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>
          처리할 태스크가 없어요
        </span>
      </div>
    ) : (
      tasks.map((t, i) => (
        <div key={i} className="task-row">
          <div className="t-check" onClick={() => completeTask(i)}>
            <i className="ti ti-check" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-name">{t.name}</div>
            <div className="t-meta">
              <span className="t-group">{t.group}</span>
              <span className={`t-due ${t.dueCls}`}>{t.due}</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</Card>
```

- [ ] **Step 3: "최근 활동" 카드 교체**

기존:

```tsx
<div className="card">
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-activity" /> 최근 활동
    </span>
  </div>
  <div style={{ padding: "2px 14px 12px" }}>...</div>
</div>
```

교체 후:

```tsx
<Card icon="ti ti-activity" title="최근 활동">
  <div style={{ padding: "2px 14px 12px" }}>
    {ACTIVITY.map((a, i) => (
      <div key={i} className="activity-row">
        <div className="act-dot" style={{ background: a.color }} />
        <div className="act-body">{a.text}</div>
        <div className="act-time">{a.time}</div>
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 4: ReportPage import 추가**

`ReportPage.tsx` 상단에 추가:

```tsx
import Card from "@/components/Card";
```

- [ ] **Step 5: "팀원별 기여도" 카드 교체**

기존:

```tsx
<div className="card" style={{ marginBottom: 14 }}>
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-chart-bar" /> 팀원별 기여도
    </span>
  </div>
  <div style={{ padding: "0 18px 14px" }}>...</div>
</div>
```

교체 후:

```tsx
<Card icon="ti ti-chart-bar" title="팀원별 기여도" style={{ marginBottom: 14 }}>
  <div style={{ padding: "0 18px 14px" }}>
    {MEMBERS.map((m) => (
      <div key={m.name} className="mrc">
        <div className="mrc-head">
          <div className={`av ${m.av} av-lg`}>{m.name[0]}</div>
          <div>
            <div className="mrc-name">
              {m.name}{" "}
              {m.tag && (
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--text-soft)",
                    fontWeight: 400,
                  }}
                >
                  {m.tag}
                </span>
              )}
            </div>
            <div className="mrc-role">{m.role}</div>
          </div>
          <div className={`mrc-score ${m.scoreCls}`}>
            {m.score}점{m.score < 10 ? " ⚠️" : ""}
          </div>
        </div>
        <div className="mrc-stats">
          {m.stats.map((s) => (
            <div key={s.l} className="mrc-stat">
              <div className="mrc-stat-l">{s.l}</div>
              <div
                className="mrc-stat-v"
                style={s.vc ? { color: s.vc } : undefined}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>
        <div className="mrc-bar">
          <i style={{ width: `${m.bar}%`, background: m.barColor }} />
        </div>
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 6: "기여도 레이더" 카드 교체**

기존:

```tsx
<div className="card" style={{ marginBottom: 14 }}>
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-chart-dots" /> 기여도 레이더
    </span>
    <span className="card-link" style={{ cursor: "default" }}>
      김민준 vs 팀 평균
    </span>
  </div>
  <div className="radar-wrap">...</div>
</div>
```

교체 후:

```tsx
<Card
  icon="ti ti-chart-dots"
  title="기여도 레이더"
  extra={
    <span className="card-link" style={{ cursor: "default" }}>
      김민준 vs 팀 평균
    </span>
  }
  style={{ marginBottom: 14 }}
>
  <div className="radar-wrap">
    <svg id="radar" width="240" height="240" viewBox="0 0 240 240" />
    <div className="radar-legend">
      <div className="rl-item">
        <span className="rl-swatch" style={{ background: "var(--green)" }} />{" "}
        김민준 (나)
      </div>
      <div className="rl-item">
        <span
          className="rl-swatch"
          style={{ background: "var(--text-soft)" }}
        />{" "}
        팀 평균
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-soft)",
          lineHeight: 1.7,
          marginTop: 4,
        }}
      >
        발언 · 태스크 · 참석 · 액션완료
        <br />
        4개 축 기준 정규화 점수
      </div>
    </div>
  </div>
</Card>
```

- [ ] **Step 7: "회의별 요약" 카드 교체**

기존:

```tsx
<div className="card">
  <div className="card-head">
    <span className="card-title">
      <i className="ti ti-calendar" /> 회의별 요약
    </span>
  </div>
  <div style={{ padding: "0 18px 14px" }}>...</div>
</div>
```

교체 후:

```tsx
<Card icon="ti ti-calendar" title="회의별 요약">
  <div style={{ padding: "0 18px 14px" }}>
    {SESSIONS.map((s) => (
      <div key={s.num} className="ms-row">
        <div className="ms-num">{s.num}</div>
        <div>
          <div className="ms-title">
            {s.title} <span>{s.sub}</span>
          </div>
          <div className="ms-body">{s.body}</div>
          <div className="ms-meta">{s.meta}</div>
        </div>
      </div>
    ))}
  </div>
</Card>
```

- [ ] **Step 8: 브라우저 확인**

`/home`, `/dashboard/report` → 카드 레이아웃 기존과 동일한지 확인.

- [ ] **Step 9: 커밋**

```bash
git add client/src/pages/home/HomePage.tsx client/src/pages/dashboard/report/ReportPage.tsx
git commit -m "refactor: HomePage, ReportPage Card 컴포넌트로 교체"
```

---

## Task 7: login.css 분리

**Files:**

- Create: `client/src/styles/login.css`
- Modify: `client/src/styles/global.css`
- Modify: `client/src/pages/login/LoginPage.tsx`

- [ ] **Step 1: login.css 생성**

`global.css`에서 `/* 화면 1 — 로그인 */` 주석 블록부터 `/* 화면 2 — 온보딩 */` 주석 직전까지를 새 파일 `client/src/styles/login.css`에 복사.

포함 클래스: `.login-left`, `.ll-blob`, `.ll-logo`, `.ll-tag`, `.ll-mid`, `.ll-headline`, `.ll-sub`, `.ll-feat`, `.ll-feat-ic`, `.ll-feat-t`, `.ll-feat-s`, `.ll-foot`, `.login-right`, `.lr-logo`, `.lr-greet`, `.kakao-btn`, `.lr-terms`, `.lr-alt`

- [ ] **Step 2: global.css에서 해당 섹션 삭제**

`global.css`에서 Step 1에서 복사한 블록 전체 삭제 (주석 포함).

- [ ] **Step 3: LoginPage에 import 추가**

`LoginPage.tsx` 상단에 추가:

```tsx
import "@/styles/login.css";
```

- [ ] **Step 4: 브라우저 확인**

`/` (로그인 페이지) → 레이아웃, 색상, 애니메이션 기존과 동일한지 확인.

- [ ] **Step 5: 커밋**

```bash
git add client/src/styles/login.css client/src/styles/global.css client/src/pages/login/LoginPage.tsx
git commit -m "refactor: login.css 분리"
```

---

## Task 8: onboarding.css 분리

**Files:**

- Create: `client/src/styles/onboarding.css`
- Modify: `client/src/styles/global.css`
- Modify: `client/src/pages/onboarding/OnboardingPage.tsx`

- [ ] **Step 1: onboarding.css 생성**

`global.css`에서 `/* 화면 2 — 온보딩 */` 주석 블록부터 `/* 화면 3 — 홈 */` 주석 직전까지를 `client/src/styles/onboarding.css`에 복사.

포함 클래스: `.ob-steps`, `.ob-step`, `.ob-sc`, `.ob-sl`, `.ob-line`, `.ob-card`, `.ob-pane`, `.ob-top`, `.ob-ic`, `.ob-title`, `.ob-sub`, `.ob-form`, `.chip-row`, `.chip`, `.ob-foot`, `.code-strip`, `.code-label`, `.code-val`, `.code-exp`, `.copy-btn`, `.ob-confetti`, `.ob-summary`, `.ob-sg`, `.ob-sg-l`, `.ob-sg-v`, `.ob-feat`, `.ob-feat-ic`, `.ob-feat-t`, `.ob-feat-s`, `.ob-team-avs`

- [ ] **Step 2: global.css에서 해당 섹션 삭제**

- [ ] **Step 3: OnboardingPage에 import 추가**

```tsx
import "@/styles/onboarding.css";
```

- [ ] **Step 4: 브라우저 확인**

`/onboarding` → 3단계 스텝, 카드, 칩 선택 기존과 동일한지 확인.

- [ ] **Step 5: 커밋**

```bash
git add client/src/styles/onboarding.css client/src/styles/global.css client/src/pages/onboarding/OnboardingPage.tsx
git commit -m "refactor: onboarding.css 분리"
```

---

## Task 9: home.css 분리

**Files:**

- Create: `client/src/styles/home.css`
- Modify: `client/src/styles/global.css`
- Modify: `client/src/pages/home/HomePage.tsx`

- [ ] **Step 1: home.css 생성**

`global.css`에서 `/* 화면 3 — 홈 */` 주석 블록부터 `/* 화면 4 — 대시보드 */` 주석 직전까지를 `client/src/styles/home.css`에 복사.

포함 클래스: `.topnav`, `.tn-logo`, `.tn-right`, `.tn-icon`, `.home-body`, `.greet-title`, `.greet-sub`, `.home-cols`, `.sec-head`, `.sec-title`, `.sec-count`, `.groups-grid`, `.group-card`, `.gc-stripe`, `.gc-top`, `.gc-name`, `.gc-avs`, `.gc-more`, `.gc-contrib-row`, `.gc-bar`, `.gc-foot`, `.gc-deadline`, `.new-group`, `.ng-circle`, `.ng-txt`, `.join-box`, `.join-label`, `.join-row`, `.join-input`, `.task-row`, `.t-check`, `.t-name`, `.t-meta`, `.t-group`, `.t-due`, `.due-red`, `.due-amber`, `.due-soft`, `.activity-row`, `.act-dot`, `.act-body`, `.act-time`, `.meet-grid`, `.meet`, `.meet-top`, `.date-chip`, `.meet-title`, `.meet-meta`, `.meet-foot`

- [ ] **Step 2: global.css에서 해당 섹션 삭제**

- [ ] **Step 3: HomePage에 import 추가**

```tsx
import "@/styles/home.css";
```

- [ ] **Step 4: 브라우저 확인**

`/home` → 네비게이션, 그룹 카드, 태스크, 활동, 회의 섹션 기존과 동일한지 확인.

- [ ] **Step 5: 커밋**

```bash
git add client/src/styles/home.css client/src/styles/global.css client/src/pages/home/HomePage.tsx
git commit -m "refactor: home.css 분리"
```

---

## Task 10: dashboard.css 분리

**Files:**

- Create: `client/src/styles/dashboard.css`
- Modify: `client/src/styles/global.css`
- Modify: `client/src/pages/dashboard/DashboardPage.tsx`

- [ ] **Step 1: dashboard.css 생성**

`global.css`에서 `/* 화면 4 — 대시보드 */` 주석 블록부터 `/* 모달 + 토스트 */` 주석 직전까지를 `client/src/styles/dashboard.css`에 복사.

포함 클래스: `.sidebar`, `.sb-back`, `.sb-team`, `.sb-team-badge`, `.sb-team-name`, `.sb-team-sub`, `.sb-sec`, `.nav-item`, `.nbadge`, `.sb-members`, `.sb-mrow`, `.me-tag`, `.sb-spacer`, `.sb-user`, `.sb-user-name`, `.sb-user-role`, `.main-area`, `.main-top`, `.main-title`, `.main-content`, `.dpage`, `.alert-bar`, `.stats-grid`, `.stat-card`, `.stat-lbl`, `.stat-val`, `.stat-sub`, `.dash-grid`, `.dash-grid2`, `.contrib-row`, `.c-name`, `.c-bar`, `.c-pct`, `.c-task`, `.mini-meeting`, `.task-mini`, `.chk-mini`, `.meeting-mini`, `.mm-top`, `.mm-meta`, `.view-toggle`, `.vt`, `.prog-strip`, `.prog-bg`, `.prog-fill`, `.board`, `.board-col`, `.col-head`, `.col-dot`, `.col-title`, `.col-cnt`, `.tcard`, `.tc-title`, `.tc-foot`, `.tc-who`, `.tc-status`, `.s-todo`, `.s-inprog`, `.s-done`, `.add-col`, `.list-view`, `.lrow`, `.lrow-title`, `.lrow-due`, `.report-wrap`, `.report-banner`, `.rb-title`, `.rb-sub`, `.rb-meta`, `.rb-score-lbl`, `.rb-score`, `.mrc`, `.mrc-head`, `.mrc-name`, `.mrc-role`, `.mrc-score`, `.mrc-stats`, `.mrc-stat`, `.mrc-stat-l`, `.mrc-stat-v`, `.mrc-bar`, `.radar-wrap`, `.rl-item`, `.rl-swatch`, `.ms-row`, `.ms-num`, `.ms-title`, `.ms-body`, `.ms-meta`, `.meeting-layout`, `.msidebar`, `.msb-head`, `.msb-list`, `.msb-group`, `.mcard`, `.mcard-top`, `.mcard-name`, `.mcard-meta`, `.spill`, `.spill-live`, `.spill-soon`, `.spill-done`, `.mdetail`, `.mdetail-head`, `.mdh-top`, `.mdh-title`, `.mdh-meta`, `.tabs`, `.tab`, `.tab-body`, `.tab-panel`, `.panel-label`, `.ag-item`, `.ag-num`, `.ag-text`, `.ag-prog`, `.ag-time`, `.speak-row`, `.speak-name`, `.speak-bar`, `.speak-pct`, `.dec-item`, `.dec-ic`, `.dec-text`, `.summary-box`

- [ ] **Step 2: global.css에서 해당 섹션 삭제**

이 시점에서 `global.css`에는 토큰+리셋+공통컴포넌트+모달+토스트+미디어쿼리만 남아야 함. 줄 수가 800줄 이하인지 확인:

```bash
wc -l client/src/styles/global.css
```

- [ ] **Step 3: DashboardPage에 import 추가**

```tsx
import "@/styles/dashboard.css";
```

- [ ] **Step 4: 브라우저 확인**

`/dashboard`, `/dashboard/overview`, `/dashboard/meeting`, `/dashboard/tasks`, `/dashboard/report` 전체 페이지 순회 → 레이아웃, 색상, 인터랙션 기존과 동일한지 확인.

- [ ] **Step 5: 커밋**

```bash
git add client/src/styles/dashboard.css client/src/styles/global.css client/src/pages/dashboard/DashboardPage.tsx
git commit -m "refactor: dashboard.css 분리, CSS 분리 완료"
```

---

## 최종 검증

- [ ] `npm run build` — 빌드 에러 없음 확인
- [ ] `wc -l client/src/styles/global.css` — 800줄 이하 확인
- [ ] 전체 페이지 순회 (/, /onboarding, /home, /dashboard/\*) — 시각적 회귀 없음 확인
