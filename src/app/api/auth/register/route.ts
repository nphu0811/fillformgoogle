import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateReferralCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email hoặc username đã tồn tại' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = generateReferralCode();

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: username,
        credits: 100, // Welcome bonus
        referralCode,
      },
    });

    // Create welcome transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: 100,
        type: 'WELCOME_BONUS',
        description: 'Bonus chào mừng thành viên mới',
      },
    });

    // Simple JWT-like token (in production use proper JWT)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })).toString('base64');

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        credits: user.credits,
        referralCode: user.referralCode,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
