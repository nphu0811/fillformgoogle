import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth-helpers';
import { executeFillJob, type AnswerRatio } from '@/lib/fill-engine';
import { QuestionType } from '@/lib/google-form-parser';

// POST /api/fill-jobs - Create and start a fill job
export async function POST(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { formId, responseCount, answerConfigs, spreadEnabled, spreadInterval, useFullAI } = await request.json();

    // Validate
    if (!formId || !responseCount || !answerConfigs) {
      return NextResponse.json(
        { error: 'Thiếu thông tin cần thiết' },
        { status: 400 }
      );
    }

    // Check user credits
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || dbUser.credits < responseCount) {
      return NextResponse.json(
        { error: `Không đủ credit. Cần ${responseCount}, hiện có ${dbUser?.credits || 0}` },
        { status: 400 }
      );
    }

    // Get form with questions
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form không tồn tại' }, { status: 404 });
    }

    // Create fill job
    const fillJob = await prisma.fillJob.create({
      data: {
        formId,
        userId: user.id,
        responseCount,
        spreadEnabled: spreadEnabled || false,
        spreadInterval: spreadInterval || null,
        status: 'RUNNING',
        startedAt: new Date(),
        answerConfigs: {
          create: answerConfigs.map((config: any) => ({
            questionId: config.questionId,
            ratios: JSON.stringify(config.ratios || {}),
            customData: config.customTexts ? JSON.stringify(config.customTexts) : null,
          })),
        },
      },
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: responseCount } },
    });

    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: -responseCount,
        type: 'FILL_DEBIT',
        description: `Điền form: ${form.title} (${responseCount} responses)`,
        fillJobId: fillJob.id,
      },
    });

    // Build form action URL
    const formActionUrl = form.googleFormUrl.includes('/forms/d/e/')
      ? `https://docs.google.com/forms/d/e/${form.googleFormId}/formResponse`
      : `https://docs.google.com/forms/d/${form.googleFormId}/formResponse`;

    // Build answer ratios for engine
    const answerRatioConfigs: AnswerRatio[] = answerConfigs.map((config: any) => {
      const question = form.questions.find(q => q.id === config.questionId);
      return {
        questionEntryId: question?.googleEntryId || '',
        questionType: (question?.type || 'SHORT_TEXT') as QuestionType,
        ratios: config.ratios || {},
        customTexts: config.customTexts,
        options: question?.options ? JSON.parse(question.options) : [],
        title: question?.title || '',
      };
    });

    // Execute fill job (async - don't await in production, use job queue)
    executeFillJob(
      {
        formActionUrl,
        responseCount,
        answerRatios: answerRatioConfigs,
        spreadEnabled: spreadEnabled || false,
        spreadIntervalMs: (spreadInterval || 5) * 1000,
        aiEnabled: useFullAI !== undefined ? useFullAI : !!process.env.GOOGLE_AI_API_KEY,
        systemPrompt: "Bạn là một người tham gia khảo sát thực tế. Hãy tạo dữ liệu mẫu cực kỳ đa dạng: tên người Việt Nam khác nhau, địa chỉ email ảo khác nhau (vd: phu@gmail.com, hung99@yahoo.com...), và các ý kiến đóng góp mang tính xây dựng, tự nhiên, không trùng lặp.",
      },
      async (result) => {
        // Save each response
        await prisma.fillResponse.create({
          data: {
            fillJobId: fillJob.id,
            responseIndex: result.index,
            answers: JSON.stringify(result.answers),
            status: result.success ? 'SUBMITTED' : 'FAILED',
          },
        });

        // Update completed count
        await prisma.fillJob.update({
          where: { id: fillJob.id },
          data: {
            completedCount: { increment: 1 },
          },
        });
      }
    ).then(async (results) => {
      const successCount = results.filter(r => r.success).length;
      await prisma.fillJob.update({
        where: { id: fillJob.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          completedCount: successCount,
        },
      });
    }).catch(async (error) => {
      await prisma.fillJob.update({
        where: { id: fillJob.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
    });

    return NextResponse.json({
      fillJob: {
        id: fillJob.id,
        status: 'RUNNING',
        responseCount,
      },
    });
  } catch (error: any) {
    console.error('Fill job error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo fill job' },
      { status: 500 }
    );
  }
}

// GET /api/fill-jobs - List user's fill jobs
export async function GET(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const fillJobs = await prisma.fillJob.findMany({
    where: { userId: user.id },
    include: {
      form: { select: { title: true, googleFormUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ fillJobs });
}
