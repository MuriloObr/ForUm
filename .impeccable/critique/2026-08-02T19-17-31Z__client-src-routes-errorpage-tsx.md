---
target: the error pages
total_score: 12
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-08-02T19-17-31Z
slug: client-src-routes-errorpage-tsx
---
# ForUm Error Pages — Design Critique

**Target:** `client/src/routes/ErrorPage.tsx` + `client/src/components/Error.tsx`
**Method:** dual-agent (A: design review · B: detector + browser evidence)
**Detector:** clean (0 findings on all three files); browser visualization skipped (no browser tool exposed)

## Design Health Score — 12/40 (Poor)

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 2 | Message shows, but raw English error.message leaks and there is no retry/loading feedback |
| 2 | Match System / Real World | 1 | Mixed PT/EN ("Oops!", "Not Found", "Request failed with status code 500") on a Portuguese app |
| 3 | User Control and Freedom | 1 | Only exit is home; ErrorPage wipes all nav chrome; no back/retry |
| 4 | Consistency and Standards | 1 | Violates DESIGN.md on every axis: no slate/card, blue CTA ≠ emerald action, off-scale text-4xl, h-screen vs h-screen-d; two unrelated error surfaces |
| 5 | Error Prevention | 1 | 401 demands login with no login affordance; parseInt(postID) NaN degrades to generic error |
| 6 | Recognition Rather Than Recall | 2 | Familiar centered layout; nothing to recall — that's all it has |
| 7 | Flexibility and Efficiency | 1 | Single dead-end CTA; keyboard path broken (button-wrapped link) |
| 8 | Aesthetic and Minimalist Design | 1 | Flat black-on-near-white, no card/icon/brand; extra raw second line of noise |
| 9 | Error Recovery | 1 | Copy matrix good; recovery absent — no retry, no login, raw strings |
| 10 | Help and Documentation | 1 | No guidance at all; barely applicable |
| **Total** | | **12/40** | **Poor** |

## Design Specificity Verdict

**Start here — this fails.** The error page is the canonical first-day React tutorial: "Oops! 404", raw status in the headline, near-white void, blue "Go Back to Home Page" button. It is the only surface in the app that abandons the slate tabletop — at exactly the moment the user is most lost. `Error.tsx` has genuinely product-aware copy (401/404/500/network mappings, locked by tests) but no product presentation or recovery. It reads as a scaffold, not a shipped surface.

**Deterministic scan:** Detector returned 0 findings (validated as a real run). Static rules (broken images, empty links, placeholders) don't apply to these files. The detector missed — and a review would too — the nested interactive element and the contrast failure below.

**Browser visualization:** SKIPPED — no browser automation tool exposed in this session. Contrast/semantics computed from source + WCAG math.

## Overall Impression

The one part that is written *for ForUm's users* is the copy matrix; everything around it is un-designed. The moment of maximum distress (a dead page) is where ForUm's identity vanishes, the CTA is keyboard-broken, and raw English internals leak under the hand-written Portuguese. Biggest opportunity: pour the conversation-table system into the fallbacks and give every error a way out.

## What's Working

1. **State→copy matrix in Error.tsx:6-18** is real product thinking — distinct human PT lines for 401/404/500/network/generic, locked in by tests.
2. **Inline rendering keeps chrome alive** — Error returns inside the routed layout (App.tsx:64, Profile.tsx:48, PostPage.tsx:132), so Header/search/nav persist during data failures.
3. **Single-CTA restraint on ErrorPage** — the calm recovery skeleton exists and is tested.

## Priority Issues

**[P0] The error page is a design-system orphan.** What: ErrorPage.tsx:8-17 renders black text on near-white with `rounded bg-blue-500` button, text-4xl, h-screen — violating slate-800 surface, white rounded-md card, one-color-rule (blue is login/links; emerald is action), and the type scale all at once. Why: maximum distress = moment identity vanishes; looks like a different website. Fix: slate-800 full-bleed, white rounded-md card, PT headline with status, emerald/outlined CTA with hover:brightness-90, Inter scale, brand mark present. Suggested command: **shape**

**[P1] `<button>` wrapping `<Link>` is invalid and keyboard-broken.** What: ErrorPage.tsx:15-17 (and :28-30) nest `<a>` inside `<button>` with no onClick. Why: WCAG 4.1.2 — Enter on the focused button does nothing; double tab stop, dead click-zone from p-3. Sam can't recover. Fix: render `<Link>` styled as a button, or `<button onClick={() => navigate('/')}>`. Suggested command: **harden**

**[P1] Raw technical English leaks under friendly copy.** What: Error.tsx:27-31 dumps error.message ("Request failed with status code 500"); ErrorPage.tsx:13,26 dump data.message/Error.message raw. Why: undercuts the crafted copy, exposes internals, reads as shipped debug. Fix: delete the raw line, or gate behind import.meta.env.DEV. Suggested command: **distill**

**[P1] Error.tsx offers zero recovery.** What: no retry, no login, no home link — a dead feed with a dead end; a 401 says "você precisa estar logado" with no way in. Why: heuristic #9 is the reason this surface exists; a dead end turns a transient failure into a session-killer. Fix: contextual action — retry (invalidate query), "Entrar" for 401, "Voltar ao início" otherwise. Suggested command: **adapt**

**[P2] ErrorPage wipes all chrome.** What: errorElement replaces the whole route element including Header (main.tsx:23-76); only nav is one home link. Why: users lose search/profile/posts — the tools to self-rescue. Fix: render Header inside ErrorPage or offer back + home. Suggested command: **layout**

**[P2] No semantic status/announcement, no designed focus.** What: Error.tsx:25-32 is a div of spans — no heading, no role="alert"/aria-live; ErrorPage CTA lacks focus-visible design (index.css has none). Why: screen readers get a flat unannounced error; keyboard users get no visible cue on a stress surface. Fix: h1+p, role="alert", explicit focus-visible ring, aria-label on CTA. Suggested command: **harden**

**[P3] Mixed-language copy and duplicated render branches.** What: English "Go Back to Home Page"/"Oops!"/"Not Found" in a PT app; ErrorPage.tsx:6-32 duplicates identical markup in two branches. Fix: localize all copy; collapse to one render path keyed on isRouteErrorResponse. Suggested command: **clarify**

**[P3] Fragile, context-dependent layout.** What: Error.tsx:25 h-5/6 depends on parent height; ErrorPage uses h-screen (100vh) not h-screen-d (100dvh) — mobile URL-bar clipping. Fix: min-h/flex-basis on layout parent; adopt h-screen-d. Suggested command: **layout**

## Contrast (from Assessment B, WCAG math)

- **`bg-blue-500` / white text ≈ 3.68:1** — fails WCAG AA (needs 4.5:1) for normal-size label text on both CTA buttons (ErrorPage.tsx:15,28).
- **`:root` color #fafafa background with rgba(255,255,255,0.87) default text** (index.css:10-12) is a white-on-white hazard — only saved because components set text-black explicitly; inherited-color spots (ErrorPage.tsx:13) render invisible; color-scheme light dark makes native controls dark in a light UI.

## Persona Red Flags

- **Jordan (first-timer, mistyped URL):** sees English on a PT app, a cliché line, no explanation, on a blank near-white void with one dead-end button. Browser Back saves them, not the page. A broken-looking surface makes the forum feel unmaintained.
- **Sam (screen reader + keyboard):** hears a flat div of spans — no heading, no alert. Tabs to the CTA, presses Enter: nothing happens (button has no onClick; nested link unfocusable). The page's only recovery is inaccessible by design.
- **Riley (stress-tester):** hits three inconsistent error styles — route-level ErrorPage (chrome wipe, English), data-level Error (no action, raw message), and modal/Form.ResField red text on login — that look unrelated. A 401 demands login with no login button; a transient 500 forces a manual refresh.

## Minor Observations

- ErrorPage.test.tsx:91-94 asserts the anchor href, documenting the invalid nesting as intended.
- parseInt(postID) on /user/abc → NaN → generic data error instead of a clean 404 (PostPage.tsx:24-25).
- Error.tsx:28 renders '' (empty) when error.message is falsy — a branch that intentionally blanks.
- Four error-presentation styles coexist (Error, ErrorPage, modal text-red-700, Form.ResField red text).
- 404 duplication: "Oops! 404" already contains the code, then "Not Found" restates it.
- index.css:10 sets color-scheme light dark, but the error surface is an always-bright island under a dark header.

## Questions to Consider

1. If the conversation table is the north star, where is the table on the error page? Why does ForUm vanish at the moment users are most lost?
2. "Go Back to Home Page" — whose language is that? The one string read in distress is the least localized.
3. Does a 401 deserve an error at all — or a sign-in gate that turns a dead end into a conversion moment?
4. Was the raw error.message leak a debugging scaffold shipped as truth?
5. Should a fallback be allowed to change the product's surface (background), or should the layout own it?
