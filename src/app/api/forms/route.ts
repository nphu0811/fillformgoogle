import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth-helpers';

// GET /api/forms - List user's forms
export async function GET(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const forms = await prisma.form.findMany({
    where: { userId: user.id },
    include: {
      questions: { orderBy: { order: 'asc' } },
      fillJobs: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ forms });
}

// POST /api/forms - Create a form (after parsing)
export async function POST(request: NextRequest) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { googleFormUrl, googleFormId, title, description, questions } = await request.json();

    const form = await prisma.form.create({
      data: {
        userId: user.id,
        googleFormUrl,
        googleFormId,
        title,
        description,
        questions: {
          create: questions.map((q: any, i: number) => ({
            googleEntryId: q.entryId,
            title: q.title,
            type: q.type,
            required: q.required || false,
            options: JSON.stringify(q.options || []),
            sectionIndex: q.sectionIndex || 0,
            order: i,
          })),
        },
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    });

    return NextResponse.json({ form });
  } catch (error: any) {
    console.error('Create form error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo form' },
      { status: 500 }
    );
  }
}
