import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth-helpers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if form belongs to user
    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form không tồn tại' }, { status: 404 });
    }

    if (form.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền xóa form này' }, { status: 403 });
    }

    // Delete all related data manually to avoid constraint issues
    await prisma.$transaction([
      prisma.fillResponse.deleteMany({ where: { fillJob: { formId: id } } }),
      prisma.answerConfig.deleteMany({ where: { fillJob: { formId: id } } }),
      prisma.transaction.deleteMany({ where: { fillJob: { formId: id } } }),
      prisma.fillJob.deleteMany({ where: { formId: id } }),
      prisma.question.deleteMany({ where: { formId: id } }),
      prisma.form.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete form error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa form' }, { status: 500 });
  }
}
