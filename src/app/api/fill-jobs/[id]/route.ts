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
    const fillJob = await prisma.fillJob.findUnique({
      where: { id },
    });

    if (!fillJob) {
      return NextResponse.json({ error: 'Tiến trình không tồn tại' }, { status: 404 });
    }

    if (fillJob.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền xóa tiến trình này' }, { status: 403 });
    }

    // Delete related records manually to be safe
    await prisma.$transaction([
      prisma.fillResponse.deleteMany({ where: { fillJobId: id } }),
      prisma.answerConfig.deleteMany({ where: { fillJobId: id } }),
      prisma.transaction.deleteMany({ where: { fillJobId: id } }),
      prisma.fillJob.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa tiến trình' }, { status: 500 });
  }
}
