// Debug script: see what Google actually returns for the form URL
const formId = '1HIbdBBWI7hKkJUIS'; // partial ID from screenshot - will be replaced

// Try multiple URL formats
const urls = [
  `https://docs.google.com/forms/d/${formId}/viewform`,
  `https://docs.google.com/forms/d/e/${formId}/viewform`,
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
};

async function testUrl(url) {
  console.log(`\n=== Testing: ${url} ===`);
  try {
    const res = await fetch(url, { headers, redirect: 'follow' });
    console.log(`Status: ${res.status}`);
    console.log(`Final URL: ${res.url}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    
    const html = await res.text();
    console.log(`HTML length: ${html.length}`);
    
    // Check for key markers
    const hasFBData = html.includes('FB_PUBLIC_LOAD_DATA_');
    const hasLogin = html.includes('accounts.google.com') || html.includes('ServiceLogin');
    const hasConsent = html.includes('consent.google.com');
    const hasFormTag = html.includes('<form');
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    
    console.log(`Has FB_PUBLIC_LOAD_DATA_: ${hasFBData}`);
    console.log(`Has login redirect: ${hasLogin}`);
    console.log(`Has consent page: ${hasConsent}`);
    console.log(`Has <form> tag: ${hasFormTag}`);
    console.log(`Page title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
    
    // Show first 2000 chars
    console.log(`\n--- First 2000 chars ---`);
    console.log(html.substring(0, 2000));
    
    // Look for any script data patterns
    const scriptVars = html.match(/var\s+(\w+)\s*=/g);
    if (scriptVars) {
      console.log(`\nScript variables found: ${scriptVars.slice(0, 10).join(', ')}`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

// Also test with a known public form
async function main() {
  // Test with user's form
  for (const url of urls) {
    await testUrl(url);
  }
}

main();
