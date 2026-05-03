import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserFromToken } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { questionTitle, questionType, options } = await request.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Chưa cấu hình API Key AI' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Bạn là một trợ lý giúp tạo dữ liệu mẫu cho khảo sát.
      Câu hỏi: "${questionTitle}"
      Loại câu hỏi: ${questionType}
      ${options ? `Các lựa chọn: ${options.join(', ')}` : ''}

      Hãy tạo ra 10 câu trả lời mẫu khác nhau, tự nhiên, giống người thật viết nhất có thể.
      Mỗi câu trả lời trên một dòng. Không đánh số, không giải thích gì thêm.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const suggestions = text.split('\n').filter(t => t.trim());

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('AI Suggest Error:', error);
    return NextResponse.json({ error: 'Lỗi khi gọi AI' }, { status: 500 });
  }
}
