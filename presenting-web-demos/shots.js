// Screenshots of a running web app, for slides: the whole window — nav, header and all — with the
// card a slide is about scrolled up to sit just under the header. One PNG per shot, at 2x.
//   node shots.js <spec.json> <outdir>
// The spec:
//   {
//     "server":   { "cmd": "npm", "args": ["run", "preview"], "ready": "(http://localhost:\\d+)" },  // or
//     "url":      "http://localhost:4173",
//     "viewport": { "width": 1440, "height": 820 },           // optional; ~16:9 fills a slide
//     "shots": [
//       { "name": "overview", "go": "#/overview" },                  // the page as it opens
//       { "name": "plan", "go": "#/plan", "sel": "#plan" },          // that card under the header
//       { "name": "chart", "go": "#/plan", "sel": "#chart", "crop": true }  // the card alone
//     ]
//   }
// `go` is a path or a hash appended to the base URL; `sel` a Playwright selector; `wait` a selector
// to wait for first. `crop` is for a detail too small to read in the window; the default keeps the
// app's chrome, because a demo of a web UI is a demo of where things are as much as what they say.
// Playwright must be resolvable (NODE_PATH or a local install).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const [SPEC, OUT] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(SPEC, 'utf8'));

function start(server) {
  return new Promise((resolve, reject) => {
    const child = spawn(server.cmd, server.args || [], { cwd: server.cwd || process.cwd() });
    let out = '';
    const read = c => {
      out += c;
      const m = out.match(new RegExp(server.ready));
      if (m) resolve({ child, url: m[1] });
    };
    child.stdout.on('data', read);
    child.stderr.on('data', read);
    child.on('exit', code => reject(new Error('server exited ' + code)));
  });
}

// Scroll so the element's top sits just below whatever sticky or fixed bar covers the top edge.
async function underHeader(page, el) {
  await el.evaluate(e => e.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => {
    let bar = 0;
    for (const e of document.querySelectorAll('body *')) {
      const p = getComputedStyle(e).position;
      if (p !== 'sticky' && p !== 'fixed') continue;
      const r = e.getBoundingClientRect();
      if (r.top <= 1 && r.width > innerWidth / 2 && r.bottom < innerHeight / 2) bar = Math.max(bar, r.bottom);
    }
    window.scrollBy(0, -(bar + 16));
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const s = spec.server ? await start(spec.server) : { url: spec.url };
  const browser = await chromium.launch();
  const page = await (await browser.newContext({
    viewport: spec.viewport || { width: 1440, height: 820 }, deviceScaleFactor: 2, colorScheme: 'light',
  })).newPage();
  try {
    for (const shot of spec.shots) {
      await page.goto(s.url.replace(/\/$/, '') + (shot.go || ''));
      if (shot.wait) await page.waitForSelector(shot.wait, { timeout: 20000 });
      await page.waitForTimeout(shot.settle || 1200);
      const file = path.join(OUT, shot.name + '.png');
      if (shot.sel) {
        const el = page.locator(shot.sel).first();
        if (!(await el.count())) { console.log('missing ' + shot.name); continue; }
        if (shot.crop) {
          await el.scrollIntoViewIfNeeded();
          await el.screenshot({ path: file });
        } else {
          await underHeader(page, el);
          await page.waitForTimeout(400);
          await page.screenshot({ path: file });
        }
      } else {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: file });
      }
      console.log('shot ' + shot.name);
    }
  } finally {
    await browser.close();
    if (s.child) s.child.kill();
  }
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
