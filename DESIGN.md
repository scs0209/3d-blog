---
name: 3D Blog
description: Three.js 3D home with glass-orbit UI across blog, portfolio, and admin surfaces
colors:
  cosmos-void: "#070414"
  cosmos-nebula: "#1a1040"
  accent-warm: "#ff9a3c"
  accent-warm-soft: "#ffb870"
  accent-warm-glow: "#ffd4b0"
  accent-cool: "#3de8ff"
  accent-cool-soft: "#7ec8ff"
  accent-cool-glow: "#b8e4ff"
  text-warm-body: "#f5f0e8"
  text-warm-head: "#fffaf3"
  text-cool-body: "#e8eef5"
  text-cool-head: "#f4f8fc"
  link-warm: "#ffb070"
  link-cool: "#7ec8ff"
  blog-shell-mid: "#1c0e38"
  blog-card: "#1a1424"
  admin-shell: "#1a1428"
  admin-cta: "#1ed760"
  glass-border: "rgba(255, 255, 255, 0.2)"
  glass-surface: "rgba(255, 255, 255, 0.1)"
typography:
  display:
    fontFamily: "var(--font-syne), Syne, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-syne), Syne, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), Geist, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
  body:
    fontFamily: "var(--font-geist-sans), Geist, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: "0.01em"
  label:
    fontFamily: "var(--font-geist-sans), Geist, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
  mono:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  glass: "20px"
  glass-lg: "24px"
  window: "32px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-glass:
    backgroundColor: "{colors.glass-surface}"
    textColor: "rgba(255, 255, 255, 0.9)"
    rounded: "{rounded.glass}"
    padding: "12px 24px"
  button-glass-hover:
    backgroundColor: "rgba(255, 255, 255, 0.15)"
    textColor: "#ffffff"
    rounded: "{rounded.glass}"
    padding: "12px 24px"
  button-admin-primary:
    backgroundColor: "{colors.admin-cta}"
    textColor: "#000000"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "40px"
  blog-nav-active:
    backgroundColor: "rgba(255, 154, 60, 0.1)"
    textColor: "{colors.text-warm-head}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  blog-card:
    backgroundColor: "{colors.blog-card}"
    textColor: "{colors.text-warm-body}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
---

# Design System: 3D Blog

## Overview

**Creative North Star: "The Glass Orbit"**

3D Blog는 React Three Fiber 3D 홈을 중심으로, 글래스모피즘 UI가 궤도처럼 공개면을 감싸는 정제된 tech 포트폴리오다. 방문자는 먼저 3D 씬에 몰입하고, 블로그·포트폴리오·관리자로 이동할수록 각 존(zone)에 맞는 UI 언어로 전환된다. 전체적으로 어두운 코스믹 배경 위에 반투명 레이어, 부드러운 blur, 절제된 glow가 겹쳐지며 "우주 안의 유리 패널" 느낌을 만든다.

홈·3D는 Experience — UI가 최대한 물러나고 씬이 주인공이다. 블로그는 Read — 본문 가독성을 최우선으로, 액센트는 링크·라벨·chrome에만 쓴다. 관리자는 Operate — visionOS 스타일 spatial glass 윈도우로 작업 집중을 돕는다. 라이트/다크 테마는 블로그 chrome에서 warm orange(황혼) ↔ cool cyan(심해) 듀얼 팔레트로 전환된다.

**Key Characteristics:**

- 3D 코스믹 void(`#070414`)를 앵커로, radial gradient·별빛·네온 glow가 깊이를 만든다
- 글래스모피즘: `backdrop-blur` + 반투명 border + inset sheen이 기본 표면 언어
- 존별 혼합: 홈=몰입, 블로그=고대비 읽기, admin=spatial glass + Spotify-green CTA
- Syne display + Geist body/mono — 기술 포트폴리오에 맞는 기하학적 display + 깔끔한 UI 본문
- 테마별 warm/cool accent 전환 — orange `#ff9a3c` (light) ↔ cyan `#3de8ff` (dark)

## Colors

코스믹 void 위에 warm/cool 듀얼 액센트가 테마에 따라 전환되는 팔레트.

### Primary

- **Warm Horizon** (`#ff9a3c`): 라이트 모드 블로그 chrome, border glow, nav active, category pill. 황혼 네온.
- **Deep Cyan Pulse** (`#3de8ff`): 다크 모드 블로그 chrome, scrollbar thumb, code-block dots. 심해 네온.

### Secondary

- **Soft Amber Glow** (`#ffb870` / `#ffd4b0`): 섹션 라벨, 링크 hover, gradient title mid-tone.
- **Ice Blue Halo** (`#7ec8ff` / `#b8e4ff`): 다크 모드 라벨, 링크, code toolbar.

### Tertiary

- **Admin Signal Green** (`#1ed760`): 관리자 primary CTA, dock/nav CTA. Spotify-inspired action color.
- **Glass Indigo** (`rgba(99, 102, 241, 0.8)` light / `rgba(139, 92, 246, 0.8)` dark): shadcn primary, sidebar ring — 범용 UI accent.

### Neutral

- **Cosmos Void** (`#070414`): 3D scene-wrapper, 다크 shell root, code-block option bg.
- **Twilight Plum** (`#1c0e38` / `#2a1545`): 블로그 chrome bar, dropdown, sidebar bg.
- **Warm Parchment** (`#f5f0e8` / `#fffaf3`): 블로그 본문·헤딩 (light theme prose).
- **Cool Mist** (`#e8eef5` / `#f4f8fc`): 블로그 본문·헤딩 (dark theme prose).
- **Glass White** (`rgba(255, 255, 255, 0.1–0.2)`): admin window, glass-card, btn-glass surfaces.

### Named Rules

**The Link-Only Accent Rule.** 블로그 본문(`blog-prose`)에서는 액센트 색을 링크·blockquote border·code highlight에만 쓴다. 본문 텍스트는 `#f5f0e8`(light) / `#e8eef5`(dark) 고대비를 유지한다.

**The Zone Palette Rule.** 홈 3D는 코스믹 void 팔레트, 블로그는 warm/cool 듀얼, admin은 white/glass + green CTA. 존을 넘을 때 팔레트를 섞지 않는다.

## Typography

**Display Font:** Syne (`var(--font-syne)`) — 블로그 섹션 타이틀, 카드 제목, 모바일 nav brand
**Body Font:** Geist Sans (`var(--font-geist-sans)`) — UI 본문, admin, forms
**Mono Font:** Geist Mono (`var(--font-geist-mono)`) — code blocks, lang select, desk-os monospace

**Character:** Syne의 기하학적 display가 tech·cosmic 톤을, Geist의 중립적 sans가 읽기·운영 UI를 담당. 본문 line-height 1.85로 장문 가독성 확보.

### Hierarchy

- **Display** (600, clamp 1.25–1.875rem, lh 1.2): 블로그 hero title gradient, section headers.
- **Headline** (600, 1.5rem, lh 1.3): 포스트 카드 제목, admin header title (1.65rem semibold).
- **Title** (600, 0.875–1rem uppercase tracking 0.2em): 섹션 라벨 (`RECENT POSTS` 등), category pills.
- **Body** (400, 1.0625rem, lh 1.85): 블로그 prose, admin body. max ~65–75ch 권장.
- **Label** (600, 0.75rem, tracking 0.2em uppercase): admin section labels, tag pills.
- **Mono** (400, 0.8125rem, lh 1.7): inline code, code-block pre, desk-os UI.

### Named Rules

**The Syne-for-Chrome Rule.** Display/headline에 Syne, 본문·UI chrome에 Geist. 3D 씬 HTML overlay는 sans-serif fallback.

## Layout

- **홈 3D:** `100dvh` full viewport, fixed navbar top-center (`max-w-6xl`), canvas fills remainder.
- **블로그:** `min-h-screen` shell gradient, sticky chrome bar + sidebar (desktop), mobile bottom nav. Post detail: `max-w-4xl` comment section, md+ bordered post panel.
- **관리자:** `h-svh` spatial stage, flex row — nav col 15.5rem + main window `rounded-[32px]`, optional ornament sidebar (md+), bottom dock on mobile.
- **Spacing rhythm:** shadcn default (4px base) + glass padding 12–24px, admin window padding p-4/p-5.
- **Breakpoints:** Tailwind defaults (sm 640, md 768, lg 1024). Navbar desktop `lg:block`, mobile hamburger below lg.
- **Z-index scale:** base 1 → dropdown 1000 → overlay 2000 → modal 3000 → escape-hatch 9999.

## Elevation & Depth

하이브리드: UI 카드·윈도우는 **backdrop-blur + box-shadow + inset sheen**으로 떠 있는 느낌; 3D 씬은 Three.js 조명·postprocessing으로 깊이를 만든다. 플랫 단색만으로는 표면을 만들지 않는다.

### Shadow Vocabulary

- **Blog card lift** (`0 4px 24px rgba(255,154,60,0.08)` light / cyan dark): 포스트 카드 resting.
- **Blog card hover glow** (`0 0 28px rgba(255,154,60,0.18)`): hover state border+shadow escalation.
- **Admin window depth** (`0 40px 120px rgba(0,0,0,0.45)`): main spatial window.
- **Admin CTA glow** (`0 8px 24px rgba(30,215,96,0.28)`): primary green button.
- **Glass shadow** (tailwind `shadow-glass`: `10px 18px 6px rgba(0,0,0,0.1)`): generic glass panels.

### Named Rules

**The Blur-Before-Shadow Rule.** Glass surfaces always pair `backdrop-blur-md` (12px) or stronger with a semi-transparent border. Shadow alone without blur is not the default glass look.

**The Sheen Line Rule.** Chrome bars, cards, admin windows get a 1px top gradient sheen (`via-accent/50` or `via-white/35`) for spatial glass realism.

## Shapes

- **Glass radius:** 20px default (`.glass-card`, `.btn-glass`), 12px subtle, 24px strong.
- **Admin spatial:** 32px window corners, 28px ornament panel, 18px ornament buttons, pill dock (`rounded-full`).
- **Blog pills:** `rounded-full` category/tag chips.
- **shadcn base:** `--radius: 0.5rem` (8px) for default buttons/inputs outside glass zones.
- **Code blocks:** macOS-style traffic-light dots (8px circles), toolbar lang select pill.
- **Scrollbar:** 6px width, 3px radius, cyan-tinted thumb.

### Named Rules

**The Pill-for-Tags Rule.** Tags, categories, admin dock items use full pill radius. Rectangular cards use lg–glass radius, never sharp corners on public surfaces.

## Components

### Buttons

- **Shape:** Glass buttons 20px radius; admin primary pill; shadcn default 8px md.
- **Primary (admin):** `#1ed760` bg, black text, pill, shadow glow. Hover `#3be072`.
- **Glass (`btn-glass`):** rgba white 10% bg, blur 12px, white/90 text. Hover scale 1.02, bg 15%.
- **Glass-primary:** indigo tint border/bg, indigo text.
- **Navbar CTA:** dark `#1c1c1c` bar, border `#858585`, hover white glow shadow.
- **Hover / Focus:** scale transform on glass; ring-2 accent/35 on inputs; focus-visible outline-none + ring.

### Chips / Tags

- **Style:** `rounded-full` border accent/30, bg accent/10, text accent-glow (`#ffd4b0` / `#b8e4ff`).
- **State:** hash-based color on admin table tags; glass type on admin home.

### Cards / Containers

- **Blog card:** border accent/20, bg `#1a1424/88`, blur-sm, top glow line. Hover border+shadow escalate.
- **Glass card:** `.glass-card` — 10% white, blur 12px, 20px radius, hover brightens border.
- **Admin window:** 32px radius, white/20 border, white/10 bg, blur 40px, saturate 150%, deep shadow.
- **Internal padding:** 16–24px blog; py-4 admin cards; 12px 24px glass buttons.

### Inputs / Fields

- **Admin:** h-11, white/15 border, white/8 bg, white text, focus border/ring white/35.
- **Blog comment:** rounded-lg, white/15 border, black/30 bg, focus ring accent/40.
- **Title input (admin):** borderless bottom border only, 2xl semibold transparent bg.

### Navigation

- **Home navbar:** fixed top-center dark pill bar, slide-up hover text animation (600ms cubic-bezier).
- **Blog nav:** accent-bordered pills, active state glow shadow, Syne brand on mobile.
- **Admin nav:** 15.5rem sidebar, rounded-xl items, active inset shadow; bottom dock mobile.

### Signature: 3D Scene Wrapper

- **`.scene-wrapper`:** `#070414` + radial nebula gradient, full viewport.
- **`.void-os-desktop`:** portfolio desk OS — starfield micro-dots, purple/blue/pink radial washes.
- **Theme toggle:** light/dark switches blog warm↔cool and glass primary indigo↔violet.

## Do's and Don'ts

### Do:

- **Do** keep blog prose body at `#f5f0e8` / `#e8eef5` with line-height 1.85 for readability.
- **Do** use warm orange accent in light theme and cool cyan in dark theme for blog chrome consistently.
- **Do** pair glass surfaces with `backdrop-blur` and semi-transparent borders.
- **Do** use Syne for display headings and Geist for body/UI in blog and admin.
- **Do** reserve admin green `#1ed760` exclusively for primary actions in admin zone.
- **Do** add top sheen gradient lines on glass chrome bars and cards.

### Don't:

- **Don't** use accent colors for blog body text — links and labels only.
- **Don't** mix admin spatial glass palette into blog or 3D home surfaces.
- **Don't** use flat opaque cards on blog without border/glow treatment.
- **Don't** apply heavy box-shadow without blur on glass components.
- **Don't** use generic shadcn gray defaults on blog/public surfaces — use `blogTheme` tokens.
