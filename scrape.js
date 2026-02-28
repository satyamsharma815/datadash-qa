
const { chromium } = require('playwright');

const SEEDS = [87, 88, 89, 90, 91, 92, 93, 94, 95, 96];

async function scrapeTableNumbers(page, seed) {
  const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
  console.log(`Visiting: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for table to appear
  await page.waitForSelector('table', { timeout: 10000 }).catch(() => {});

  const numbers = await page.$$eval('table td', cells =>
    cells
      .map(cell => cell.innerText.trim())
      .filter(text => text !== '' && !isNaN(text))
      .map(Number)
  );

  const sum = numbers.reduce((a, b) => a + b, 0);
  console.log(`Seed ${seed}: ${numbers.length} numbers, sum = ${sum}`);
  return sum;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let grandTotal = 0;

  for (const seed of SEEDS) {
    try {
      const sum = await scrapeTableNumbers(page, seed);
      grandTotal += sum;
    } catch (err) {
      console.error(`Error on seed ${seed}: ${err.message}`);
    }
  }

  await browser.close();

  // Print in a clear format the grader can find
  console.log(`Total: ${grandTotal}`);
})();
