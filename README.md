# franklx-skills

Skills for [Claude Code](https://claude.com/claude-code).

| skill | what it is for |
|---|---|
| [`recording-web-demos`](recording-web-demos/SKILL.md) | record a scripted walkthrough of any web UI as an mp4, with cursor, captions and a timed transcript (.srt / .vtt / .md) |
| [`presenting-web-demos`](presenting-web-demos/SKILL.md) | turn a walkthrough of any web UI into a slide deck: one claim per slide, real window screenshots of the running app, figures read off the app, built as a claude.ai Slides artifact (pptx / PDF) |

Install as plugins from this repo's marketplace (Claude Code 2.1.275 or later):

```
/plugin install recording-web-demos --marketplace laxuankhanh1902/franklx-skills
/plugin install presenting-web-demos --marketplace laxuankhanh1902/franklx-skills
```

Or copy a skill's folder into `~/.claude/skills/` (all projects) or `<project>/.claude/skills/` (one project):

```bash
git clone https://github.com/laxuankhanh1902/franklx-skills
cp -R franklx-skills/recording-web-demos ~/.claude/skills/
cp -R franklx-skills/presenting-web-demos ~/.claude/skills/
```
