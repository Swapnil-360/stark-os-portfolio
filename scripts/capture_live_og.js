const puppeteer = require('puppeteer-core');
const path = require('path');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  console.log('Launching Edge from:', edgePath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    console.log('Navigating to https://www.mrswapnil.me/...');
    await page.goto('https://www.mrswapnil.me/', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait 5 seconds for sci-fi animations and hero portrait to fully render
    await new Promise(r => setTimeout(r, 5000));

    // Hide any tooltips or popups if present
    await page.addStyleTag({
      content: `
        /* Ensure crisp rendering */
        ::-webkit-scrollbar { display: none !important; }
      `
    });

    const out1920 = path.join(__dirname, '..', 'public', 'live_hero_1080p.png');
    await page.screenshot({ path: out1920, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log('Saved 1080p hero screenshot to:', out1920);

    // Also set viewport to 1200x630 for perfect OpenGraph preview
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 2000));
    const out1200 = path.join(__dirname, '..', 'public', 'og-image.png');
    await page.screenshot({ path: out1200, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log('Saved 1200x630 OG screenshot to:', out1200);

  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
  }
}

capture();
