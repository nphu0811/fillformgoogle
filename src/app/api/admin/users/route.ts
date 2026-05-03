import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    
    // Check if user is logged in and has ADMIN role
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Require ADMIN role.' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    // Fetch users with search
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query } },
          { username: { contains: query } },
          { name: { contains: query } }
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        credits: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Admin Fetch Users Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
