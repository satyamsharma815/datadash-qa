
const { chromium } = require('playwright');

const SEEDS = [87, 88, 89, 90, 91, 92, 93, 94, 95, 96];
const BASE_URL = 'https://exam.sanand.workers.dev/tds-2025-01-ga2/pages/';

async function scrapeTableNumbers(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const numbers = await page.$$eval('table td', cells =>
    cells.map(cell => parseFloat(cell.innerText.trim())).filter(n => !isNaN(n))
  );
  return numbers.reduce((a, b) => a + b, 0);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    const url = `${BASE_URL}${seed}`;
    try {
      const sum = await scrapeTableNumbers(page, url);
      console.log(`Seed ${seed}: ${sum}`);
      grandTotal += sum;
    } catch (err) {
      console.error(`Error scraping seed ${seed}:`, err.message);
    }
  }

  console.log(`\nGrand Total (seeds 87–96): ${grandTotal}`);

  await browser.close();
})();
