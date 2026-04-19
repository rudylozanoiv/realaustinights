// One-shot script to render /public/og-default.png (1200×630) using the
// headless Chromium that Playwright already has installed. Re-run only when
// the brand mark changes.
//
//   node scripts/generate-og.mjs
//
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '..', 'public', 'og-default.png');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Open+Sans:wght@500&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px;
    background: #FFFAF3;
    font-family: 'Montserrat', system-ui, sans-serif;
    position: relative;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 64px;
    box-sizing: border-box;
  }
  .bar-top, .bar-bottom {
    position: absolute; left: 0; right: 0; height: 12px;
  }
  .bar-top { top: 0; background: linear-gradient(90deg, #1B2A4A, #007A7A); }
  .bar-bottom { bottom: 0; background: #FF8C00; }
  h1 {
    font-size: 120px; font-weight: 900; color: #1B2A4A;
    margin: 0; letter-spacing: -0.02em; line-height: 1;
  }
  .real { color: #007A7A; }
  p {
    font-family: 'Open Sans', system-ui, sans-serif;
    font-size: 40px; font-weight: 500;
    color: #007A7A; margin: 28px 0 0;
  }
  .badge {
    position: absolute; bottom: 48px; right: 56px;
    color: #FF69B4; font-size: 64px;
    text-shadow: 0 2px 8px rgba(255,105,180,0.2);
  }
  .domain {
    position: absolute; bottom: 48px; left: 56px;
    font-size: 22px; font-weight: 700;
    color: #1B2A4A; opacity: 0.6;
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>
  <div class="bar-top"></div>
  <h1><span class="real">Real</span> AustiNights</h1>
  <p>Austin's nightlife, for real</p>
  <span class="domain">REALAUSTINIGHTS.COM</span>
  <span class="badge" aria-hidden="true">✝️</span>
  <div class="bar-bottom"></div>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Give the custom fonts a beat to settle after networkidle.
  await page.waitForTimeout(300);
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`OG image written → ${outPath}`);
} finally {
  await browser.close();
}
