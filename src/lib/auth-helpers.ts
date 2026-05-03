import { NextRequest } from 'next/server';

// Helper to extract user from token
export function getUserFromToken(request: NextRequest): { id: string; email: string; role: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return { id: payload.id, email: payload.email, role: payload.role || 'USER' };
  } catch {
    return null;
  }
}
