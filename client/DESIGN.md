---
name: ForUm
description: A lightweight, conversational forum
colors:
  background-surface: "#1e293b"
  background-card: "#ffffff"
  text-primary: "#18181b"
  text-muted: "#3f3f46"
  text-on-dark: "#ffffff"
  border-default: "#e4e4e7"
  border-strong: "#09090b"
  color-success: "#10b981"
  color-open: "#9333ea"
  color-action: "#3b82f6"
  color-register: "#f97316"
  color-danger: "#dc2626"
  color-engagement: "#f59e0b"
  color-like: "#f43f5e"
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

ForUm's design is built around the feeling of a well-worn table where people gather to share ideas. The interface is clean and purposeful — spacious, high-contrast, and deliberately quiet so the conversation itself fills the room. Cards sit on a slate surface like paper scattered across a tabletop, gently lifted to suggest they can be picked up and engaged with. Every element either serves reading, writing, or navigating the discussion; chrome exists only to make those actions feel tactile and dependable.

The palette stays neutral (slate backgrounds, white cards, zinc text) so that the status badges, interactive buttons, and user-generated markdown content become the color moments. This is not a brand that needs to shout — it's a table that welcomes anyone to sit down and write.

**Key Characteristics:**
- Neutral canvas with deliberate color accents for functional feedback
- Cards always gently lifted; hover deepens the elevation
- Tactile, bold interactive states — buttons feel clickable, fields feel editable
- High contrast between surface zones (slate feed / white cards)
- Spacious internal rhythms (16–20px padding on containers)
- Underlined navigation links with a scale-in animation on hover

## Colors

The palette follows a "Neutral Canvas, Colorful Content" philosophy. Backgrounds and chrome exist in slate and zinc tones; color is reserved for status, action, and engagement signals.

### Primary

- **Background Surface** (#1e293b / slate-800): The feed and post-page background. This deep slate creates the tabletop surface that content cards sit on.
- **Background Card** (#ffffff / white): Card, modal, and container fills. Pure white keeps content legible and creates clear figure-ground separation from the slate surface.
- **Overlay** (rgba(15, 23, 42, 0.8) / slate-900 at 80%): Modal backdrops. Dims the tabletop without fully extinguishing it.

### Secondary

- **Background Form** (#fafafa): The page-level background for login/register/about/profile pages. Near-white with a hint of warmth.
- **Text Primary** (#18181b / zinc-900): Body text, headings, and labels on light backgrounds.
- **Text Muted** (#3f3f46 / zinc-700): Secondary text like dates and metadata.
- **Text On Dark** (#ffffff / white): Text and icons on colored or dark backgrounds.

### Status Colors

- **Success Green** (#10b981 / emerald-500): Closed posts, add/compose buttons, affirmative status. Represents resolution and action.
- **Open Purple** (#9333ea / purple-600): Open posts. Complements the green without implying right/wrong.
- **Action Blue** (#3b82f6 / blue-500): Login button, markdown hyperlinks. Standard interactive signal.
- **Register Orange** (#f97316 / orange-500): Register button. Distinct from login to prevent confusion.
- **Danger Red** (#dc2626 / red-600): Delete actions, destructive confirmation.

### Engagement Colors

- **Engagement Amber** (#f59e0b / amber-500): Like/engagement ratio metric. Warm, energetic.
- **Like Rose** (#f43f5e / rose-500): Like count. Slightly warmer than pure red to feel positive.
- **Views Blue** (#3b82f6 / blue-500): View count. Calm, informational.

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
- Modals: `w-1/3`
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

Cards are always gently lifted. At rest, each card carries `shadow-md` — enough to feel like a separate sheet on the slate tabletop without floating. On hover, cards elevate to `shadow-xl hover:shadow-slate-950`, creating a clear visual response that signals interactivity.

**Depth strategy:**
- Rest: `shadow-md shadow-slate-950` — soft, present, unobtrusive
- Hover: `shadow-xl hover:shadow-slate-950` — pronounced lift, explicitly cued
- Modal: `backdrop:bg-slate-900/80` overlay — the tabletop dims, the modal is the only lit surface
- No elevation tokens beyond shadows; the system is flat by default with shadow-only depth
- Buttons do not use shadows; they rely on background color and hover brightness for their state change

### Named Rules

**The Lifted-At-Rest Rule.** Cards always carry a shadow. The baseline elevation is not zero — content surfaces that can be interacted with are always visually lifted from the background.

## Shapes

The dominant corner radius is `rounded-md` (6px). This applies to cards, buttons, modals, popovers, and status badges. It is the system's only recurring shape — a gentle, friendly curve that avoids the severity of sharp corners without drifting into pill-button territory.

**Radius strategy:**
- `rounded-md` (6px): All standard containers (cards, modals, buttons, badges)
- `rounded-lg` (8px): Login/Register button pair (paired buttons with 2px black border)
- `rounded-full` (9999px): Avatar images only
- No radius (`rounded-none` / border-b-2): Form input fields — they use an underline style rather than a box

**Borders:**
- Header: `border-b-2 border-zinc-200` — a single subtle line separating the header from content
- Status buttons: `border-2 border-black` — prominent outline on login/register pair
- Form inputs: `border-b-2 border-black` — underline style, no box
- Cards: no borders, only shadow for container definition
- Hover card: `border border-black/40` — subtle boundary on the floating Radix popover

## Components

### Buttons

- **Shape:** Gently curved (rounded-md / 6px)
- **Primary (Add / Compose):** Background Success Green (#10b981), white text, font-bold, text-lg. Padding: py-2 px-4. Positioned sticky bottom-8 ml-auto.
- **Login:** Background Action Blue (#3b82f6), white text, font-bold. Rounded left in a pair (rounded-l-lg) with 2px black border.
- **Register:** Background Register Orange (#f97316), white text, font-bold. Rounded right in a pair (rounded-r-lg) with 2px black border.
- **Danger (Delete):** Background Danger Red (#dc2626), white text, hover:brightness-90. Used in config popover.
- **Config (Close/Open):** Filled rounded-md button, background matches status (Success Green for closed, Open Purple for open), hover:brightness-90.
- **Config (Answer toggle):** Background slate-800 (active) or slate-600 (inactive), rounded-md.
- **Ghost (Form submit):** No background, uses the underline-scale animation (after/before pseudo-elements on the parent button).
- **State change:** All colored buttons use `hover:brightness-90` for hover feedback — no shadow, no scale, just a consistent lightness shift.

### Cards / Post Containers

- **Corner Style:** Gently curved (rounded-md / 6px)
- **Background:** Pure white (#ffffff)
- **Shadow at Rest:** shadow-md shadow-slate-950
- **Shadow on Hover:** shadow-xl hover:shadow-slate-950 — also uses `hover:cursor-pointer`
- **Internal Padding:** 20px (p-5)
- **Layout:** Flex column with gap-y-4 between header, content, and footer
- **Transition:** `transition-all` on the whole card
- **Group hover:** Title underline appears on card hover via `group-hover/post:underline`

### Inputs / Text Fields

- **Style:** Underline-only — `border-b-2 border-black`, transparent background, no box or radius
- **Text Style:** font-normal, text-2xl, leading-10 (forms) or leading-8 (modals)
- **Focus:** Standard browser outline suppressed (`outline-none`) — focus is implicit via the underline
- **Label:** Text-2xl (modal) or tracking-wide (form), followed by ↴ arrow character
- **Textarea (ModalArea):** Same underline pattern, 10 rows tall, with raw/preview toggle

### Navigation (Header)

- **Layout:** Inline flex row, text-xl, responsive gap (2xl:gap-x-12 down to gap-x-0)
- **Typography:** Inter, text-zinc-900, weight inherited (400 from body)
- **Default state:** Text only, no background
- **Hover state:** Underline-scale animation via pseudo-elements — `after:scale-x-100` (top line) and `before:scale-x-100` (bottom line), both with `origin-left` / `origin-right` for a directional sweep effect
- **Login/Register:** Treated as button-style nav items (see Buttons section)
- **Logged-in state:** Login/Register buttons replaced by a single "Profile" link with the same underline animation

### Modal

- **Trigger:** Native `<dialog>` element
- **Container:** w-1/3, rounded-md, white background
- **Backdrop:** `backdrop:bg-slate-900/80` — dims the feed surface
- **Internal layout:** Flex column, gap-5, padding p-8
- **Result message:** h-5, text-red-700, appears above the submit button
- **Close:** Modal closes on successful submission via ref

### Status Badges

- **Shape:** rounded-md, p-1
- **Closed:** Background Success Green (#10b981), white text, bold, with X icon
- **Open:** Background Open Purple (#9333ea), white text, bold, with Check icon
- **Placement:** Top-right of the post header, ml-auto

### Engagement Indicators

- **Layout:** Horizontal row (flex justify-between) in the card footer
- **Engagement ratio:** Amber text (#f59e0b), Target icon — displays like/dislike ratio as percentage
- **Views:** Blue text (#3b82f6), TrendUp icon — number with k/M abbreviation
- **Likes:** Rose text (#f43f5e), ThumbsUp icon — number with k/M abbreviation
- **Metadata:** Nickname left (text-sm), date right (text-zinc-700 text-sm)

### Loading States

- **Page loading:** Centered CircleNotch icon (100px), black, animate-spin, on the current background
- **Submit loading:** Full-screen overlay (bg-white/75), centered CircleNotch icon (80px), z-50

### Chips / Tags / Hover Card

- **MyHoverCard:** Radix UI HoverCard, trigger is any element, content floats centered (w-1/2 mx-auto), bg-slate-800 with border border-black/40, rounded-md, p-4, white text. Arrow fill-zinc-900.

## Do's and Don'ts

### Do:

- **Do use shadow-md as the minimum card elevation.** Cards must feel lifted from the slate surface.
- **Do reserve color for functional meaning.** Green = resolved, Purple = open, Blue = action, Orange = register, Red = danger.
- **Do use the underline-scale animation for navigation links** — it's the system's signature micro-interaction.
- **Do keep content cards white on the slate-800 feed background** for maximum figure-ground clarity.
- **Do use brightness-90 for button hover states** — it's the consistent, predictable feedback pattern.

### Don't:

- **Don't add shadows to buttons.** Button state is communicated through background color and brightness, not elevation.
- **Don't use rounded corners larger than 8px** — the system is defined by subtle (rounded-md) curvature.
- **Don't mix input styles.** All text inputs use the underline (border-b-2) pattern — no bordered boxes.
- **Don't introduce a secondary font family** — Inter serves all roles via weight and size contrast.
- **Don't place accent colors on backgrounds** — the slate feed + white card pattern is the invariant surface relationship.
