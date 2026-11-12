# franklx-skills

Skills for [Claude Code](https://claude.com/claude-code).

| skill | what it is for |
|---|---|
| [`recording-web-demos`](recording-web-demos/SKILL.md) | record a scripted walkthrough of any web UI as an mp4, with cursor, captions and a timed transcript (.srt / .vtt / .md) |
| [`presenting-web-demos`](presenting-web-demos/SKILL.md) | turn a walkthrough of any web UI into a slide deck: one claim per slide, real window screenshots of the running app, figures read off the app, built as a claude.ai Slides artifact (pptx / PDF) |

Install one by copying its folder into `~/.claude/skills/` (all projects) or `<project>/.claude/skills/` (one project):

```bash
git clone https://github.com/laxuankhanh1902/franklx-skills
cp -R franklx-skills/recording-web-demos ~/.claude/skills/
cp -R franklx-skills/presenting-web-demos ~/.claude/skills/
```
