import { chromium } from 'playwright';
import type { Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

interface SitemapEntry {
  url: string;
  name: string;
  depth: number;
  title: string;
}

const visitedUrls = new Set<string>();
const sitemap: SitemapEntry[] = [];

function sanitizeName(url: string): string {
  const parsed = new URL(url);
  let name = parsed.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  if (!name) name = 'home';
  return name;
}

async function scrollPage(page: Page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve(undefined);
        }
      }, 50);
    });
  });
  // scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function crawl(url: string, depth: number, page: Page) {
  if (visitedUrls.has(url) || depth > 3) return;
  visitedUrls.add(url);

  console.log(`Crawling: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await scrollPage(page);
    await page.waitForTimeout(1000); // wait for any animations after scroll

    const name = sanitizeName(url);
    const pageDir = path.join(SCREENSHOTS_DIR, name);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    const title = await page.title();
    sitemap.push({ url, name, depth, title });

    // Full page screenshot
    await page.screenshot({ path: path.join(pageDir, 'full.png'), fullPage: true });

    // Hero screenshot (just the viewport)
    await page.screenshot({ path: path.join(pageDir, 'hero.png'), fullPage: false });

    // Component screenshots (forms)
    const forms = await page.locator('form').all();
    for (let i = 0; i < forms.length; i++) {
      try {
        await forms[i].screenshot({ path: path.join(pageDir, `component-form-${i + 1}.png`) });
      } catch (e) {
        // Ignore if form is not visible
      }
    }

    // Extract internal links
    const links = await page.locator('a[href^="/"], a[href^="' + BASE_URL + '"]').all();
    const urlsToVisit = new Set<string>();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) {
        let fullUrl = href;
        if (href.startsWith('/')) {
          fullUrl = `${BASE_URL}${href}`;
        }
        // Remove hash and query params for crawling simplicity
        const cleanUrl = fullUrl.split('#')[0].split('?')[0];
        if (cleanUrl.startsWith(BASE_URL)) {
          urlsToVisit.add(cleanUrl);
        }
      }
    }

    // Crawl newly discovered links
    for (const nextUrl of urlsToVisit) {
      await crawl(nextUrl, depth + 1, page);
    }
  } catch (error: any) {
    console.error(`Failed to crawl ${url}: ${error.message}`);
  }
}

async function run() {
  console.log('Starting UX Audit Crawler...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  await crawl(BASE_URL, 0, page);

  // Write sitemap
  fs.writeFileSync(
    path.join(process.cwd(), 'sitemap.json'),
    JSON.stringify(sitemap, null, 2)
  );

  console.log('Crawling finished. Sitemap saved.');
  await browser.close();
}

run().catch(console.error);
