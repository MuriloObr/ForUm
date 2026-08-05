---
name: ForUm
description: A lightweight, conversational forum
colors:
  background-surface: "#1e293b"
  background-card: "#0f172a"
  background-modal: "#ffffff"
  text-primary: "#18181b"
  text-muted: "#3f3f46"
  text-on-dark: "#ffffff"
  border-default: "#e4e4e7"
  border-strong: "#09090b"
  color-success: "#10b981"
  color-open: "#9333ea"
  color-action: "#1d4ed8"
  color-register: "#f97316"
  color-danger: "#dc2626"
  color-engagement: "#fbbf24"
  color-like: "#fb7185"
  overlay: "rgba(15, 23, 42, 0.8)"
typography:
  display:
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.5
  headline:
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "32px"
motion:
  skeleton:
    duration: "1.8s"
    gradient: "rgba(255, 255, 255, 0.1)"
    base: "rgba(255, 255, 255, 0.08)"
components:
  button-primary:
    backgroundColor: "{colors.color-action}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-success:
    backgroundColor: "{colors.color-success}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-danger:
    backgroundColor: "{colors.color-danger}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  card-post:
    backgroundColor: "{colors.background-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "20px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "0"
    borderBottom: "2px solid {colors.border-strong}"
---

# Design System: ForUm

## Overview

**Creative North Star: "The Conversation Table"**

ForUm's design is built around the feeling of a well-worn table where people gather to share ideas. The interface is clean and purposeful — spacious, high-contrast, and deliberately quiet so the conversation itself fills the room. Cards sit on the slate surface like panels that can be picked up and engaged with. Every element either serves reading, writing, or navigating the discussion; chrome exists only to make those actions feel tactile and dependable.

The palette stays neutral (slate backgrounds, slate-900 cards with hairline white borders, zinc text) so that the status badges, interactive buttons, and user-generated markdown content become the color moments. This is not a brand that needs to shout — it's a table that welcomes anyone to sit down and write.

**Key Characteristics:**
- Neutral canvas with deliberate color accents for functional feedback
- Cards sit a half-step down from the surface (slate-900 on slate-800) and are defined by a hairline border; hover brightens the border
- Tactile, bold interactive states — buttons feel clickable, fields feel editable
- Dark first: the feed, post page, header, and all cards live on the slate scale; white is reserved for modals and the light auth surfaces
- Spacious internal rhythms (16–20px padding on containers)
- Underlined navigation links with a scale-in animation on hover

## Colors

The palette follows a "Neutral Canvas, Colorful Content" philosophy. Backgrounds and chrome exist in slate and zinc tones; color is reserved for status, action, and engagement signals.

### Primary

- **Background Surface** (#1e293b / slate-800): The feed and post-page background. This deep slate creates the tabletop surface that content cards sit on.
- **Background Card** (#0f172a / slate-900): Feed cards, comment cards, empty states, and error cards on dark surfaces. One half-step darker than the surface, defined by a hairline `border-white/10`.
- **Background Modal** (#ffffff / white): Modal dialogs and form containers. The one deliberately lit surface — a modal is the only white moment on the dark tabletop.
- **Overlay** (rgba(15, 23, 42, 0.8) / slate-900 at 80%): Modal backdrops. Dims the tabletop without fully extinguishing it.

### Secondary

- **Background Form** (#fafafa): The page-level background for login/register/about pages. Near-white with a hint of warmth. Profile and the error pages are dark like the feed.
- **Text Primary** (#18181b / zinc-900): Body text, headings, and labels on light surfaces (auth forms, modals).
- **Text On Card** (#e4e4e7 / zinc-200): Body text on slate-900 cards (titles zinc-100, secondary zinc-400).
- **Text Muted** (#a1a1aa / zinc-400): Secondary text like dates and metadata on dark surfaces.
- **Text On Dark** (#ffffff / white): Text and icons on colored or dark backgrounds.

### Status Colors

- **Success Green** (#10b981 / emerald-500): Closed posts and affirmative status. Represents resolution. On feed cards the Closed badge uses the darker **emerald-700** (#047857) so white text clears WCAG AA.
- **Open Purple** (#9333ea / purple-600): Open posts. Complements the green without implying right/wrong.
- **Action Blue** (#1d4ed8 / blue-700): Login button, add/compose buttons, markdown hyperlinks. The standard signal for "do this now."
- **Register Orange** (#f97316 / orange-500): Register button. Distinct from login to prevent confusion.
- **Danger Red** (#dc2626 / red-600): Delete actions, destructive confirmation.

### Engagement Colors

- **Engagement Amber** (#fbbf24 / amber-400): Like/engagement ratio metric. Warm, energetic; brightened for WCAG AA on slate-900 cards.
- **Like Rose** (#fb7185 / rose-400): Like count. Slightly warmer than pure red to feel positive; brightened for WCAG AA on slate-900 cards.
- **Views Blue** (#60a5fa / blue-400): View count. Calm, informational; brightened for WCAG AA on slate-900 cards.

### Border

- **Border Default** (#e4e4e7 / zinc-200): Header bottom border, subtle dividers.
- **Border Strong** (#09090b / black): Form input underlines, status button outlines, and high-emphasis borders.

### Named Rules

**The One-Color-Rule.** A single accent color is used per functional zone. Status badges get their own color (green/purple); action buttons get blue/orange; engagement metrics get amber/rose. They never blend into a single palette gradient — each color carries distinct meaning.

## Typography

**Display & Body Font:** Inter, system-ui, Avenir, Helvetica, Arial, sans-serif

**Character:** A single-family sans-serif stack anchored on Inter. Clean, highly legible at every size, with a neutral personality that lets the content's own markdown formatting provide hierarchy. No secondary or display face is needed — the product's voice comes from spacing, weight contrast, and the writing itself.

### Hierarchy

- **Display** (700, 1.5rem/24px, 1.5): The ForUm brand wordmark in the header. Used only for the site identity.
- **Headline** (700, 1.875rem/30px, 1.4): Profile page username. The largest content heading.
- **Title** (600, 1.25rem/20px, 1.5): Post titles, modal labels, section headings. Bold but not loud.
- **Body** (400, 1rem/16px, 1.5): Post content, comment text, form labels, navigation. The default reading size.
- **Label** (500, 0.875rem/14px, 1.5): Button text, status badges, metadata (dates, usernames). Compact and legible at small sizes.

### Markdown

Rendered markdown content uses the `.markdown` class: headings step down from text-3xl (h1) to text-xs (h6); code blocks use highlight.js's agate theme; links are blue-400 with underline. This hierarchy exists inside the post/comment body and is intentionally more expressive than the surrounding UI chrome.

### Named Rules

**The One-Family Rule.** Every text element on screen uses the same font family stack. Hierarchy comes from weight, size, and spacing — never from a font swap.

## Layout

ForUm uses a single-column content layout centered on the viewport. The feed is a vertical stack of cards with generous vertical gaps (gap-5/1.25rem). Cards are constrained to w-3/4 (75% width) on standard screens, centered via mx-auto.

**Key patterns:**
- **Feed view (home):** Full-width slate background, card stack centered, sticky floating AddButton in bottom-right
- **Post view:** Centered post card (w-5/6) with comment cards stacked beneath, same slate background
- **Auth pages (login/register):** Two-column split — logo on left (w-2/6), form on right (w-1/5), vertically centered at 100dvh
- **Profile page:** Single column, avatar + username at top, user details in stacked rows, posts listed below
- **Header:** Full-width bar (p-3) with logo left, search center (hidden on small screens), navigation right

**Container sizing:**
- Post cards: `w-3/4 mx-auto`
- Post page cards: `w-5/6 mx-auto`
- Modals: `w-full max-w-xl` (576px cap)
- Forms: `w-1/5`
- Profile content: `w-1/6`
- Full viewport height uses `h-screen-d` (100dvh custom Tailwind extension)

**Responsive behavior:**
- Search bar hidden below `sm` breakpoint (hidden on small screens)
- Navigation gap scales from 2xl:gap-x-12 down to sm:gap-x-2
- No multi-column layouts; the single-column stack collapses gracefully

**Spacing rhythm:**
- Card internal padding: p-5 (1.25rem)
- Card stack gap: gap-5 (1.25rem)
- Modal internal padding: p-8 (2rem), gap-5 between children
- Form internal gap: gap-8 (2rem) for login, gap-1 (0.25rem) for register (cramped due to caution message)

## Elevation & Depth

Dark cards separate from the surface by tone and a hairline border, not by shadow. At rest, a card is `bg-slate-900 border border-white/10` — one half-step below the slate-800 surface, its edge catching the light. On hover the border brightens to `border-white/25`, a quiet cue that the panel can be picked up.

**Depth strategy:**
- Rest: `bg-slate-900 border border-white/10` — defined by edge, not elevation
- Hover: `hover:border-white/25` — the edge brightens to signal interactivity
- Modal: `backdrop:bg-slate-900/80` overlay — the tabletop dims, the modal is the only lit (white) surface
- No shadows on dark surfaces — they are invisible against slate; the hairline border is the depth system
- Buttons do not use shadows; they rely on background color and hover brightness for their state change

### Named Rules

**The Bordered-Edge Rule.** Dark cards are defined by their hairline border (`border-white/10`), never by shadow. The baseline edge is never zero — interactive content surfaces always carry a visible boundary against the slate surface.

## Shapes

The dominant corner radius is `rounded-md` (6px). This applies to cards, buttons, modals, popovers, and status badges. It is the system's only recurring shape — a gentle, friendly curve that avoids the severity of sharp corners without drifting into pill-button territory.

**Radius strategy:**
- `rounded-md` (6px): All standard containers (cards, modals, buttons, badges)
- `rounded-lg` (8px): Login/Register button pair (paired buttons with 2px black border)
- `rounded-full` (9999px): Avatar images only
- No radius (`rounded-none` / border-b-2): Form input fields — they use an underline style rather than a box

**Borders:**
- Cards: `border border-white/10` — the hairline edge that defines dark surfaces; brightens to `white/25` on hover
- Header: `border-b-2 border-zinc-200` — a single subtle line separating the header from content
- Status buttons: `border-2 border-black` — prominent outline on login/register pair
- Form inputs: `border-b-2 border-black` — underline style, no box
- Hover card: `border border-black/40` — subtle boundary on the floating Radix popover

## Components

### Buttons

- **Shape:** Gently curved (rounded-md / 6px)
- **AddButton:** The shared compose/submit button. Two tones via a `tone` prop: **action** (Action Blue #1d4ed8, blue-700) for compose/submit, **danger** (Danger Red #dc2626, red-600) for destructive confirms. White text, font-bold, text-lg, padding py-2 px-4, rounded-md. Two roles via a `position` prop: **fab** (floating, `sticky bottom-8 ml-auto`) and **inline** (in-flow; modal submits right-align via `ml-auto` at the call site).
- **Login:** Background Action Blue (#1d4ed8), white text, font-bold. Rounded left in a pair (rounded-l-lg) with 2px black border.
- **Register:** Background Register Orange (#f97316), white text, font-bold. Rounded right in a pair (rounded-r-lg) with 2px black border.
- **Danger (Delete):** Background Danger Red (#dc2626), white text, hover:brightness-90. Owner post action, opens the type-to-confirm delete modal.
- **Config (Owner actions):** Inline right-aligned row on the owner's post page card, between the header and the content, separated by a hairline divider (`border-t border-white/10`). Buttons are filled rounded-md with icon + PT-BR label, `hover:brightness-90`. **Close/Open:** fill matches the status badge — Success Green (emerald-700) when closed, Open Purple (purple-600) when open; label Fechar/Reabrir. **Answer toggle:** background emerald-600 (active) or slate-600 (inactive); label "Melhor resposta". Both toggles expose their state via `aria-pressed`.
- **Ghost (Form submit):** No background, uses the underline-scale animation (after/before pseudo-elements on the parent button).
- **State change:** All colored buttons use `hover:brightness-90` for hover feedback — no shadow, no scale, just a consistent lightness shift. Disabled buttons render at 50% opacity with pointer events off. Focus uses a 2px offset outline: `outline-slate-900` on light surfaces, `outline-zinc-400` on the slate feed.

### Cards / Post Containers

- **Corner Style:** Gently curved (rounded-md / 6px)
- **Background:** slate-900 (#0f172a), text-zinc-200 — a half-step down from the slate-800 feed
- **Edge at Rest:** `border border-white/10`
- **Edge on Hover:** `hover:border-white/25` (cards are links; the border brightens instead of a shadow)
- **Internal Padding:** 20px (p-5)
- **Layout:** Flex column with gap-y-4 between header, content, and footer
- **Transition:** `transition-all` on the whole card
- **Group hover:** Title underline appears on card hover via `group-hover/post:underline`
- **Navigation:** The card is a router `<Link>` (`to=/username/postID`, username URI-encoded), not a raw `<a>` — SPA navigation preserves feed scroll position
- **Focus:** 2px offset outline, `focus-visible:outline-zinc-400` on the dark card surface

### Inputs / Text Fields

- **Style:** Underline-only — `border-b-2 border-black`, transparent background, no box or radius
- **Text Style:** font-normal, text-2xl, leading-10 (forms) or leading-8 (modals)
- **Focus:** Browser outline suppressed (`outline-none`) with the underline shifting to Action Blue (`focus:border-blue-700`) as the visible focus indicator
- **Label:** Text-2xl (modal) or tracking-wide (form), followed by ↴ arrow character
- **Textarea (ModalArea):** Same underline pattern, 10 rows tall, with a quiet two-button Raw/Preview switch — neutral zinc track (`bg-zinc-200/80`), white sliding indicator, active label in Action Blue (`text-blue-700`), Label-size text (text-sm font-medium), `aria-pressed` on both buttons

### Navigation (Header)

- **Layout:** Inline flex row, text-xl, responsive gap (2xl:gap-x-12 down to gap-x-0)
- **Typography:** Inter, text-zinc-900, weight inherited (400 from body)
- **Default state:** Text only, no background
- **Hover state:** Underline-scale animation via pseudo-elements — `after:scale-x-100` (top line) and `before:scale-x-100` (bottom line), both with `origin-left` / `origin-right` for a directional sweep effect
- **Login/Register:** Treated as button-style nav items (see Buttons section)
- **Logged-in state:** Login/Register buttons replaced by a single "Profile" link with the same underline animation

### Modal

- **Trigger:** Native `<dialog>` element opened via `showModal()`
- **Container:** `w-full max-w-xl` (576px cap), rounded-md, white background
- **Backdrop:** `backdrop:bg-slate-900/80` — dims the feed surface
- **Internal layout:** Flex column, gap-5, padding p-8, `max-h-[85dvh]` with `overflow-y-auto`; the panel is `relative` so the loading overlay can paint inside it
- **Result message:** h-5, text-red-700, appears above the action row; `onClose` clears it on dismiss
- **Close:** X button (top-right), Cancel button, backdrop click, and Esc all close via `ref.close()`; the `onClose` callback lets callers reset state. Successful submissions close via ref from the caller.
- **Submit row:** Right-aligned flex — ghost Cancel + AddButton submit (action or danger tone)
- **Loading:** The LoadingSubmit overlay renders inside the dialog panel (absolute inset-0), never as a fixed sibling behind the top-layer dialog

### Status Badges

- **Shape:** rounded-md, p-1
- **Closed:** Background emerald-700 (#047857, AA-safe with white text), bold, with X icon
- **Open:** Background Open Purple (#9333ea), white text, bold, with Check icon
- **Placement:** Top-right of the post header, ml-auto
- **Labels:** Portuguese — "Fechado" / "Aberto"

### Engagement Indicators

- **Layout:** Two groups on one row (flex justify-between, flex-wrap) — the three colored metrics grouped left, a single muted "nickname · relative date" meta group right
- **Engagement ratio:** Amber-400 text (#fbbf24, WCAG AA on slate-900), Target icon (aria-hidden), `title` tooltip "Proporção de curtidas por visualização" — displays likes/views as percentage; renders 0% when there are no views
- **Views:** Blue-400 text (#60a5fa, WCAG AA on slate-900), TrendUp icon (aria-hidden) — number with k/M abbreviation
- **Likes:** Rose-400 text (#fb7185, WCAG AA on slate-900), ThumbsUp icon (aria-hidden) — number with k/M abbreviation
- **Abbreviations:** Numeric division, one decimal ("1.2 k", "2 M"), never string-sliced
- **Metadata:** Nickname (text-sm, zinc-100, medium) + "·" + relative date in Portuguese ("agora mesmo" / "min atrás" / "h atrás" / "d atrás", falling back to pt-BR date) in text-zinc-400 text-sm

### Loading States

- **Page loading:** Skeleton cards that mirror the real card geometry 1:1 so the page does not shift when data arrives — the feed shows 5 PostSkeletons (w-3/4 cards), the post page shows 1 main + 3 comment skeletons (w-5/6 cards), the profile shows 3 PostSkeletons. Each block is a `.shimmer` (base `rgba(255,255,255,0.08)`, rounded-md) with a white gradient sweep (`1.8s`) that respects `prefers-reduced-motion`. Announced via `role="status"` + an `aria-label` Portuguese label ("Carregando posts..."). No spinner, no centered loader — the page chrome stays in place.
- **Submit loading:** Full-screen overlay (bg-white/75), centered CircleNotch icon (80px), z-50 — used only for in-flight mutations (login, register, post, comment, delete).

### Chips / Tags / Hover Card

- **MyHoverCard:** Radix UI HoverCard, trigger is any element, content floats centered (w-1/2 mx-auto), bg-slate-800 with border border-black/40, rounded-md, p-4, white text. Arrow fill-zinc-900.

## Do's and Don'ts

### Do:

- **Do define dark cards by their hairline border** (`border border-white/10`, brightening on hover) — never by shadows, which vanish on slate.
- **Do reserve color for functional meaning.** Green = resolved, Purple = open, Blue = action, Orange = register, Red = danger.
- **Do use the underline-scale animation for navigation links** — it's the system's signature micro-interaction.
- **Do keep content cards on the slate scale** (slate-900 on the slate-800 surface) so the dark feed reads as one surface.
- **Do use brightness-90 for button hover states** — it's the consistent, predictable feedback pattern.

### Don't:

- **Don't add shadows to buttons.** Button state is communicated through background color and brightness, not elevation.
- **Don't place white cards on the dark feed or post page** — white is reserved for modals and the light auth surfaces.
- **Don't use rounded corners larger than 8px** — the system is defined by subtle (rounded-md) curvature.
- **Don't mix input styles.** All text inputs use the underline (border-b-2) pattern — no bordered boxes.
- **Don't introduce a secondary font family** — Inter serves all roles via weight and size contrast.
- **Don't place accent colors on backgrounds** — the slate feed + slate-900 card pattern is the invariant surface relationship.
