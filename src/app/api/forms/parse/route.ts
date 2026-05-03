import { NextRequest, NextResponse } from 'next/server';
import { parseGoogleForm, parseGoogleFormFromHtml, extractFormId } from '@/lib/google-form-parser';

// POST /api/forms/parse - Parse a Google Form URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleFormUrl, html: clientHtml } = body;

    if (!googleFormUrl) {
      return NextResponse.json(
        { error: 'Google Form URL là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!googleFormUrl.includes('docs.google.com/forms')) {
      return NextResponse.json(
        { error: 'URL không phải Google Form hợp lệ' },
        { status: 400 }
      );
    }

    let parsedForm;

    if (clientHtml) {
      // Client sent the HTML (fetched from browser where user is logged in)
      console.log('[Form Parser] Using client-provided HTML');
      const formId = extractFormId(googleFormUrl);
      if (!formId) {
        return NextResponse.json(
          { error: 'Không thể trích xuất Form ID từ URL' },
          { status: 400 }
        );
      }
      parsedForm = parseGoogleFormFromHtml(clientHtml, googleFormUrl, formId);
    } else {
      // Try server-side fetch first
      try {
        parsedForm = await parseGoogleForm(googleFormUrl);
      } catch (serverError: any) {
        // If server-side fails, tell client to retry with client-side fetch
        if (serverError.message.includes('đăng nhập') || serverError.message.includes('login')) {
          return NextResponse.json(
            { error: serverError.message, requireClientFetch: true },
            { status: 403 }
          );
        }
        throw serverError;
      }
    }

    return NextResponse.json({
      form: parsedForm,
    });
  } catch (error: any) {
    console.error('Parse form error:', error);
    return NextResponse.json(
      { error: error.message || 'Không thể phân tích Google Form' },
      { status: 500 }
    );
  }
}
