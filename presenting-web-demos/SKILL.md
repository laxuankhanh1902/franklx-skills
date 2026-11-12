---
name: presenting-web-demos
description: Use when asked for a demo, walkthrough or tour of a web app as a presentation or slide deck rather than a video — one idea per slide, real screenshots of the running app, figures read off the app, built as a claude.ai Slides artifact (downloadable as pptx or PDF).
---

# Presenting web demos

## Overview
A demo deck is **a storyboard of claims**, each slide one claim with the evidence beside it: a
short headline that is the takeaway, two or three lines or big figures on the left, an **element
screenshot from the real app** on the right, and speaker notes for whoever presents.

Why not a video: a captioned screen recording can only be watched at its own pace, cannot be
skimmed or forwarded slide by slide, and buries the point in motion. A deck is read in a minute
and discussed slide by slide. Prefer this skill whenever the audience reads rather than watches.
(`recording-web-demos` is still the tool when a video is explicitly asked for.)

`shots.js` (beside this file) takes the screenshots. The deck itself is a claude.ai **Slides**
artifact, so nobody needs a third-party tool to open it, and it downloads as `.pptx` or PDF.

## Workflow
1. **Storyboard first, in text.** Pick the 4–5 questions the audience brings, then one slide per
   claim under them — typically 15–20 slides: cover · the questions · how it works · one slide per
   answer · close with how to try it. Each slide = headline claim + the card that proves it.
   Headlines are outcomes ("Three failures every green dashboard missed"), never page names.
2. **Read every figure off the app or its data** (an API answer, a report file, the page text) in
   a script, and write the slide from that output. Never type a number from memory: data moves
   between runs, and a remembered figure becomes a false claim. Re-check names of things too
   (cluster shape, file contents) against the source before quoting them.
3. **Screenshot the whole window, nav and header included** — it is a demo of a web UI, and the
   audience should see where in the app each claim lives. Write a spec and run
   `NODE_PATH=<dir with playwright> node ~/.claude/skills/presenting-web-demos/shots.js spec.json out/`.
   `sel` scrolls that element to sit just under the sticky header; the shot is the 1440×820
   viewport at 2x, light theme. `crop: true` shoots the element alone — the exception, for a
   detail too small to read in a full window.
4. **Look at every shot before using it**: tile them (`ffmpeg … xstack`) and read the image.
   Check for cut-off text, an empty state, a wrong tab, and two shots that came out identical
   (same byte size is the tell: the scroll did not happen).
5. **Build the deck** (below), one slide per file, a few slides per publish.
6. **Report** the link, say it is private until shared from the page's Share menu, and that it
   downloads as pptx/PDF. Do not verify the deck unless asked.

## Spec for shots.js
```json
{ "server": { "cmd": "npm", "args": ["run", "preview", "--", "--port", "0"], "ready": "(http://localhost:\\d+)" },
  "shots": [
    { "name": "overview", "go": "", "wait": "nav" },
    { "name": "plan", "go": "#/plan", "sel": "#plan" },
    { "name": "plan-detail", "go": "#/plan", "sel": "#plan .total", "crop": true } ] }
```
`url` instead of `server` for an app already running. The server is killed at the end.

## Building the Slides artifact
- `Artifact` `action: "quickstart"`, `intent: "slides"` → it names the Slides type; publish with
  its `type_url` and a `title`, then follow the instructions that result returns (file layout,
  allowed inline styles, the `deck.json` shape). Those instructions win over anything here.
- Upload all screenshots in one call: `action: "publish"`, `url`, `asset: true`, `file_paths`
  (≤25). Use each returned `/_blob/<id>` verbatim in `<img src>`, `object-fit:contain`, inside a
  framed box of a contrasting background.
- Publish `deck.json` + the cover first, then about three slides per publish.

## Layout that works (1920×1080)
- Padding 112–128px; footer row at the bottom with the deck name and slide number.
- Eyebrow label (24px, uppercase, accent) → headline (60px, ≤ 2 lines) → body row:
  left column 464px of text or 2–4 big figures (64px number + 24px caption), gap 48, right
  column the window shot in a framed box (padding 11, img 1130×643 — the 1440×820 window's
  aspect).
- A slide with no shot (a statement, a forecast's reasoning, a config file) is fine: big text,
  or the file in a dark mono block.
- Cover and close on a dark ground in the brand's colour; content slides on a light neutral.
- One sans for text and one mono for commands/code (e.g. IBM Plex Sans + JetBrains Mono).
- Text ≥ 24px everywhere. `<aside>` at the end of each slide carries the speaker notes.

## Rules that keep a deck honest
- Every figure on a slide is in the screenshot beside it or in the data you printed.
- Say what the tool could **not** see where it applies; never round a gap into a pass.
- Secrets, tokens and customer names never reach a shot or a slide — use demo/fixture data.
- One idea per slide. If a slide needs two screenshots, it is two slides.

## Common mistakes
| symptom | fix |
|---|---|
| the section sits under the header or half off-screen | give the shot a `sel`; shots.js scrolls it just below the sticky header |
| text too small to read on the slide | point `sel` at a smaller section, or `crop: true` for that one detail |
| reviewer asks "where in the app is this?" | the shot was an element crop — retake it as a whole window |
| a figure on the slide disagrees with the shot | the data was re-run after the shot — retake shots and re-read figures from the same run |
| publish refused / image blank | `src` must be the exact `/_blob/<id>` from the upload result |
| the person cannot open the link | artifacts start private; they share it from the page's Share menu |
