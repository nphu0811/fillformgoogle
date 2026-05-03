import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = getUserFromToken(request);
    
    // Check if user is logged in and has ADMIN role
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Require ADMIN role.' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { amount, action } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json({ error: 'Invalid action. Use "add" or "remove"' }, { status: 400 });
    }

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const creditChange = action === 'add' ? amount : -amount;
    
    // Prevent negative credits
    if (action === 'remove' && targetUser.credits + creditChange < 0) {
      return NextResponse.json({ error: 'User does not have enough credits to remove' }, { status: 400 });
    }

    // Use transaction to update user credits and record history
    const result = await prisma.$transaction(async (tx) => {
      // Update user credits
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditChange
          }
        }
      });

      // Create transaction log
      const transaction = await tx.transaction.create({
        data: {
          userId: userId,
          amount: creditChange,
          type: action === 'add' ? 'ADMIN_GRANT' : 'ADMIN_REVOKE',
          description: `Admin ${adminUser.email} ${action === 'add' ? 'granted' : 'revoked'} ${amount} credits.`,
        }
      });

      return { updatedUser, transaction };
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ${action === 'add' ? 'granted' : 'revoked'} ${amount} credits`,
      credits: result.updatedUser.credits
    });

  } catch (error: any) {
    console.error('Admin Grant Credits Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
