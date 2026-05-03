/**
 * Google Form Fill Engine
 * Generates responses based on ratio configurations and submits them to Google Forms.
 */

import { QuestionType, type ParsedQuestion } from './google-form-parser';
import { sleep } from './utils';
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AnswerRatio {
  questionEntryId: string;
  questionType: QuestionType;
  ratios: Record<string, number>; // option -> percentage (0-100)
  customTexts?: string[];          // for text-type questions
  options: string[];
  title: string;                   // title of the question
}

export interface FillConfig {
  formActionUrl: string;
  responseCount: number;
  answerRatios: AnswerRatio[];
  spreadEnabled: boolean;
  spreadIntervalMs: number; // milliseconds between responses
  aiEnabled?: boolean;
  systemPrompt?: string;
}

export interface FillResult {
  index: number;
  success: boolean;
  answers: Record<string, string | string[]>;
  error?: string;
  submittedAt: Date;
}

/**
 * Pick a random option based on weighted ratios
 */
function pickByRatio(options: string[], ratios: Record<string, number>): string {
  const totalWeight = Object.values(ratios).reduce((a, b) => a + b, 0);
  if (totalWeight === 0 && options.length > 0) {
    // Equal distribution if no ratios set
    return options[Math.floor(Math.random() * options.length)];
  }

  let random = Math.random() * totalWeight;
  for (const [option, weight] of Object.entries(ratios)) {
    random -= weight;
    if (random <= 0) return option;
  }
  return options[0] || '';
}

/**
 * Pick multiple options for checkbox questions based on ratios
 */
function pickMultipleByRatio(options: string[], ratios: Record<string, number>): string[] {
  const selected: string[] = [];
  for (const option of options) {
    const ratio = ratios[option] || 0;
    if (Math.random() * 100 < ratio) {
      selected.push(option);
    }
  }
  // Ensure at least one option is selected if required
  if (selected.length === 0 && options.length > 0) {
    selected.push(options[Math.floor(Math.random() * options.length)]);
  }
  return selected;
}

/**
 * Generate a random text response for open-ended questions
 */
function generateTextResponse(title: string, customTexts?: string[], options?: string[]): string {
  // If we have specific options for this question, pick one
  if (options && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }
  
  if (customTexts && customTexts.length > 0) {
    return customTexts[Math.floor(Math.random() * customTexts.length)];
  }

  const lowTitle = title.toLowerCase();
  
  // Smart generation based on title
  if (lowTitle.includes('tên') || lowTitle.includes('họ') || lowTitle.includes('name')) {
    const names = ['Nguyễn Văn Nam', 'Trần Thị Mai', 'Lê Hoàng Anh', 'Phạm Minh Đức', 'Ngô Thanh Huyền', 'Đặng Quốc Bảo', 'Hoàng Gia Huy', 'Vũ Tuyết Nhung'];
    return names[Math.floor(Math.random() * names.length)];
  }
  
  if (lowTitle.includes('email') || lowTitle.includes('thư điện tử')) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const prefix = Math.random().toString(36).substring(2, 10);
    return `${prefix}@${domains[Math.floor(Math.random() * domains.length)]}`;
  }
  
  if (lowTitle.includes('số điện thoại') || lowTitle.includes('phone') || lowTitle.includes('sđt')) {
    return '09' + Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  if (lowTitle.includes('tổ chức') || lowTitle.includes('công ty') || lowTitle.includes('organization')) {
    const orgs = ['Freelancer', 'Đại học Bách Khoa', 'Công ty TNHH Giải pháp AI', 'Tập đoàn Công nghệ', 'Sinh viên', 'Kinh doanh tự do'];
    return orgs[Math.floor(Math.random() * orgs.length)];
  }

  const defaults = [
    'Tuyệt vời', 'Rất hài lòng', 'Sẽ giới thiệu cho bạn bè', 'Dịch vụ chuyên nghiệp',
    'Cần cải thiện khâu gửi tin nhắn', 'Không có góp ý gì thêm', 'Hài lòng',
    'Cảm ơn ban tổ chức', 'Mong có thêm nhiều sự kiện như này', 'OK',
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

/**
 * Generate responses using AI
 * Model priority: gemini-2.0-flash → gemini-2.5-flash → gemini-pro
 */
async function generateAIResponses(
  questions: AnswerRatio[], 
  systemPrompt?: string
): Promise<Record<string, string | string[]>> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return {};

  const genAI = new GoogleGenerativeAI(apiKey);

  const questionList = questions.map(q => ({
    id: q.questionEntryId,
    title: q.options.length > 0 ? `${q.questionType}: ${q.options.join(', ')}` : q.questionType,
    type: q.questionType,
    options: q.options
  }));

  const prompt = `
    ${systemPrompt || "Bạn là một người tham gia khảo sát. Hãy trả lời các câu hỏi một cách tự nhiên và thực tế."}
    
    Dưới đây là danh sách các câu hỏi trong biểu mẫu (định dạng JSON):
    ${JSON.stringify(questionList, null, 2)}

    Yêu cầu:
    1. Trả về một đối tượng JSON duy nhất với key là ID câu hỏi và value là câu trả lời.
    2. Đối với câu hỏi trắc nghiệm (MULTIPLE_CHOICE, DROPDOWN, LINEAR_SCALE), chỉ chọn 1 giá trị từ danh sách options. Đảm bảo viết ĐÚNG CHÍNH TẢ và HOA/THƯỜNG như trong options.
    3. Đối với câu hỏi CHECKBOX, trả về một mảng chứa 1 hoặc nhiều giá trị từ options.
    4. Đối với câu hỏi TEXT (SHORT_TEXT, LONG_TEXT), hãy viết câu trả lời phù hợp, không quá dài.
    5. Nếu có câu hỏi yêu cầu Email, hãy tạo một email ngẫu nhiên.
    6. Chỉ trả về JSON, không giải thích gì thêm.
  `;

  // Updated model list with latest stable versions
  const modelNames = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash", 
  ];

  for (const modelName of modelNames) {
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        console.log(`Trying AI model: ${modelName}${retryCount > 0 ? ` (Retry ${retryCount})` : ''}`);
        
        // Use v1 for 1.5 models, v1beta for 2.0 models
        const apiVersion = modelName.includes('2.0') ? 'v1beta' : 'v1';
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        // Clean text in case model adds markdown formatting
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return parsed;
      } catch (error: any) {
        const isQuotaError = error.message?.includes('429') || error.message?.includes('Too Many Requests');
        
        if (isQuotaError && retryCount < maxRetries) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 2000; // 4s, 8s
          console.log(`AI Quota reached. Retrying in ${delay/1000}s...`);
          await sleep(delay);
          continue;
        }

        console.error(`Model ${modelName} failed:`, error.message);
        break; // Try next model
      }
    }
  }

  console.error("All AI models failed, falling back to random responses.");
  return {};
}

/**
 * Generate a single response's answers
 */
export async function generateResponse(
  answerRatios: AnswerRatio[],
  aiEnabled?: boolean,
  systemPrompt?: string
): Promise<Record<string, string | string[]>> {
  // If AI is enabled, try to get answers from AI first
  if (aiEnabled && process.env.GOOGLE_AI_API_KEY) {
    const aiAnswers = await generateAIResponses(answerRatios, systemPrompt);
    if (Object.keys(aiAnswers).length > 0) {
      return aiAnswers;
    }
  }

  const answers: Record<string, string | string[]> = {};

  for (const config of answerRatios) {
    const { questionEntryId, questionType, ratios, customTexts, options, title } = config;

    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.DROPDOWN:
      case QuestionType.LINEAR_SCALE:
        answers[questionEntryId] = pickByRatio(options, ratios);
        break;

      case QuestionType.CHECKBOX:
        answers[questionEntryId] = pickMultipleByRatio(options, ratios);
        break;

      case QuestionType.SHORT_TEXT:
      case QuestionType.LONG_TEXT:
        // For text questions, if there are predefined options (unusual but possible), pick one
        if (options && options.length > 0) {
          answers[questionEntryId] = options[Math.floor(Math.random() * options.length)];
        } else {
          answers[questionEntryId] = generateTextResponse(title, customTexts);
        }
        break;

      case QuestionType.DATE:
        // Generate a random date in the last year
        const now = new Date();
        const pastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        const randomDate = new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()));
        answers[questionEntryId] = `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')}`;
        break;

      case QuestionType.TIME:
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        answers[questionEntryId] = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        break;

      default:
        if (options && options.length > 0) {
          answers[questionEntryId] = pickByRatio(options, ratios);
        } else {
          answers[questionEntryId] = generateTextResponse(title, customTexts, options);
        }
    }
  }

  return answers;
}

/**
 * Submit a single response to Google Forms
 */
export async function submitResponse(
  formActionUrl: string,
  answers: Record<string, string | string[]>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Fetch the form page first to get the REAL fbzx and other hidden fields
    const viewUrl = formActionUrl.replace('/formResponse', '/viewform');
    const viewRes = await fetch(viewUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      }
    });
    const html = await viewRes.text();
    
    // Extract fbzx
    const fbzxMatch = html.match(/name="fbzx"\s+value="([^"]+)"/);
    const fbzx = fbzxMatch ? fbzxMatch[1] : '';
    
    // Extract other hidden fields
    const fvvMatch = html.match(/name="fvv"\s+value="([^"]+)"/);
    const fvv = fvvMatch ? fvvMatch[1] : '1';

    // Build form data as URLSearchParams
    const params = new URLSearchParams();

    for (const [entryId, value] of Object.entries(answers)) {
      // Ensure entry IDs have the proper format
      const key = entryId.startsWith('entry.') ? entryId : `entry.${entryId}`;
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, v);
        }
        // Add sentinel for checkboxes
        params.append(`${key}_sentinel`, '');
      } else {
        params.append(key, value as string);
      }
    }

    // Add hidden fields that Google Forms expects
    params.append('fvv', fvv);
    params.append('draftResponse', '%.@.[]]');
    params.append('pageHistory', '0');
    params.append('fbzx', fbzx || '0');

    console.log(`Submitting to: ${formActionUrl}`);
    console.log(`Params: ${params.toString().substring(0, 300)}...`);

    const response = await fetch(formActionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://docs.google.com',
        'Referer': viewUrl,
      },
      body: params.toString(),
      redirect: 'manual',
    });

    console.log(`Response Status: ${response.status}`);

    // Google Forms returns 200 with confirmation page on success, or 302 redirect
    if (response.status === 200 || response.status === 302) {
      return { success: true };
    }

    // Log the response body for debugging 400 errors
    const respBody = await response.text().catch(() => '');
    console.error(`Submission failed (${response.status}): ${respBody.substring(0, 200)}`);
    return { success: false, error: `HTTP ${response.status}` };
  } catch (error: any) {
    console.error("Submission Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Execute a fill job - generate and submit multiple responses
 */
export async function executeFillJob(
  config: FillConfig,
  onProgress?: (result: FillResult) => void
): Promise<FillResult[]> {
  const results: FillResult[] = [];

  for (let i = 0; i < config.responseCount; i++) {
    const answers = await generateResponse(
      config.answerRatios, 
      config.aiEnabled, 
      config.systemPrompt
    );

    const { success, error } = await submitResponse(config.formActionUrl, answers);

    const result: FillResult = {
      index: i,
      success,
      answers,
      error,
      submittedAt: new Date(),
    };

    results.push(result);

    if (onProgress) {
      onProgress(result);
    }

    // Wait between responses if spread is enabled
    if (config.spreadEnabled && config.spreadIntervalMs > 0 && i < config.responseCount - 1) {
      // Add some randomness to the interval (±20%)
      const jitter = config.spreadIntervalMs * 0.2;
      const waitTime = config.spreadIntervalMs + (Math.random() - 0.5) * 2 * jitter;
      await sleep(Math.max(100, waitTime));
    } else if (i < config.responseCount - 1) {
      // Minimal delay even without spread to avoid rate limiting
      await sleep(200 + Math.random() * 300);
    }
  }

  return results;
}
