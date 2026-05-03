/**
 * Google Form Parser
 * Fetches a Google Form and extracts all questions, options, and metadata.
 * Works by parsing the FB_PUBLIC_LOAD_DATA_ variable embedded in the HTML.
 */

export interface ParsedQuestion {
  entryId: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
  sectionIndex: number;
  order: number;
  rows?: string[];     // For grid questions
  columns?: string[];  // For grid questions
}

export interface ParsedForm {
  title: string;
  description: string;
  formId: string;
  formActionUrl: string;
  questions: ParsedQuestion[];
}

export enum QuestionType {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
  LINEAR_SCALE = 'LINEAR_SCALE',
  MULTIPLE_CHOICE_GRID = 'MULTIPLE_CHOICE_GRID',
  CHECKBOX_GRID = 'CHECKBOX_GRID',
  DATE = 'DATE',
  TIME = 'TIME',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

// Google's internal type IDs mapped to our enum
const GOOGLE_TYPE_MAP: Record<number, QuestionType> = {
  0: QuestionType.SHORT_TEXT,
  1: QuestionType.LONG_TEXT,
  2: QuestionType.MULTIPLE_CHOICE,
  3: QuestionType.DROPDOWN,
  4: QuestionType.CHECKBOX,
  5: QuestionType.LINEAR_SCALE,
  7: QuestionType.MULTIPLE_CHOICE_GRID,
  8: QuestionType.CHECKBOX_GRID,
  9: QuestionType.DATE,
  10: QuestionType.TIME,
  13: QuestionType.FILE_UPLOAD,
};

/**
 * Extract the Google Form ID from various URL formats
 */
export function extractFormId(url: string): string | null {
  const patterns = [
    /\/forms\/d\/e\/([\w-]+)/,
    /\/forms\/d\/([\w-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * Normalize a Google Form URL to the viewform URL
 */
function normalizeFormUrl(url: string): string {
  const id = extractFormId(url);
  if (!id) throw new Error('Invalid Google Form URL');

  // Check if the URL contains /e/ (public form)
  if (url.includes('/forms/d/e/')) {
    return `https://docs.google.com/forms/d/e/${id}/viewform`;
  }
  return `https://docs.google.com/forms/d/${id}/viewform`;
}

/**
 * Extract form data from HTML string (shared between server-side and client-side flows)
 */
function extractFormDataFromHtml(html: string): any[] {
  // Debug: log what we received
  const pageTitle = html.match(/<title>(.*?)<\/title>/)?.[1] || 'unknown';
  const hasLogin = html.includes('accounts.google.com') || html.includes('ServiceLogin');
  const hasConsent = html.includes('consent.google.com');
  console.log(`[Form Parser] HTML length: ${html.length}, title: "${pageTitle}", hasLogin: ${hasLogin}, hasConsent: ${hasConsent}`);

  // Try multiple patterns to extract form data
  let dataMatch = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);\s*<\/script>/s);
  
  if (!dataMatch) {
    dataMatch = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?)\s*;\s*\n/s);
  }

  if (!dataMatch) {
    dataMatch = html.match(/var\s+FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?)\s*;/s);
  }

  if (!dataMatch) {
    if (hasLogin) {
      throw new Error('Form yêu cầu đăng nhập Google. Hãy đảm bảo form được đặt ở chế độ công khai (Anyone with the link can view).');
    }
    if (hasConsent) {
      throw new Error('Google yêu cầu xác nhận cookie consent. Vui lòng thử lại.');
    }
    console.error('[Form Parser] Could not find FB_PUBLIC_LOAD_DATA_. HTML snippet:', html.substring(0, 500));
    throw new Error('Không tìm thấy dữ liệu form trong HTML. Form có thể ở chế độ riêng tư hoặc URL không hợp lệ.');
  }

  try {
    return JSON.parse(dataMatch[1]);
  } catch {
    throw new Error('Failed to parse form data JSON');
  }
}

/**
 * Build ParsedForm from raw formData array
 */
function buildParsedForm(formData: any[], formUrl: string, formId: string): ParsedForm {
  const title = formData[1]?.[8] || formData[3] || 'Untitled Form';
  const description = formData[1]?.[0] || '';

  const formActionUrl = formUrl.includes('/forms/d/e/')
    ? `https://docs.google.com/forms/d/e/${formId}/formResponse`
    : `https://docs.google.com/forms/d/${formId}/formResponse`;

  const questionGroups = formData[1]?.[1] || [];
  const questions: ParsedQuestion[] = [];
  let order = 0;

  for (const group of questionGroups) {
    if (!group || !group[4]) continue;

    for (const field of group[4]) {
      if (!field) continue;

      const questionTitle = group[1] || '';
      const typeId = field[3] as number;
      const entryId = field[0]?.toString() || '';
      const required = group[4]?.[0]?.[2] === 1;

      const questionType = GOOGLE_TYPE_MAP[typeId] || QuestionType.SHORT_TEXT;

      let options: string[] = [];
      let rows: string[] = [];
      let columns: string[] = [];

      if (field[1]) {
        for (const opt of field[1]) {
          if (opt && opt[0]) {
            options.push(opt[0]);
          }
        }
      }

      if (typeId === 5 && field[1]) {
        options = [];
        const low = field[3] || 1;
        const high = field[1]?.length || 5;
        for (let i = low; i <= high; i++) {
          options.push(i.toString());
        }
      }

      if ((typeId === 7 || typeId === 8) && group[4]) {
        rows = group[4].map((r: any) => r?.[3]?.[0] || '').filter(Boolean);
        if (field[1]) {
          columns = field[1].map((c: any) => c?.[0] || '').filter(Boolean);
        }
      }

      questions.push({
        entryId: `entry.${entryId}`,
        title: questionTitle,
        type: questionType,
        required,
        options,
        sectionIndex: 0,
        order: order++,
        ...(rows.length > 0 && { rows }),
        ...(columns.length > 0 && { columns }),
      });
    }
  }

  return { title, description, formId, formActionUrl, questions };
}

/**
 * Parse a Google Form from raw HTML string (for client-side fetched HTML)
 */
export function parseGoogleFormFromHtml(html: string, formUrl: string, formId: string): ParsedForm {
  const formData = extractFormDataFromHtml(html);
  return buildParsedForm(formData, formUrl, formId);
}

/**
 * Fetch and parse a Google Form (server-side)
 */
export async function parseGoogleForm(formUrl: string): Promise<ParsedForm> {
  const normalizedUrl = normalizeFormUrl(formUrl);
  const formId = extractFormId(formUrl);
  if (!formId) throw new Error('Could not extract form ID');

  const browserHeaders: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
  };

  let response = await fetch(normalizedUrl, {
    headers: browserHeaders,
    redirect: 'follow',
  });

  // If we get a 401/403, try again with Google consent bypass parameters
  if (response.status === 401 || response.status === 403) {
    const consentUrl = new URL(normalizedUrl);
    consentUrl.searchParams.set('hl', 'en');
    const retryHeaders = {
      ...browserHeaders,
      'Cookie': 'CONSENT=YES+; NID=; SOCS=CAISEwgDEgk2ODE2NDcyNjQaAmVuIAEaBgiA_LyuBg',
    };
    response = await fetch(consentUrl.toString(), {
      headers: retryHeaders,
      redirect: 'follow',
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch form: HTTP ${response.status}`);
  }

  const html = await response.text();
  const formData = extractFormDataFromHtml(html);
  return buildParsedForm(formData, formUrl, formId);
}
