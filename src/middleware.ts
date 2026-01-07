import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/history', '/settings'];
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const hasSession = request.cookies.has('sb-access-token') || 
                       request.cookies.getAll().some(c => c.name.includes('auth-token'));
    
    if (!hasSession) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (isAuthRoute) {
    const hasSession = request.cookies.getAll().some(c => c.name.includes('auth-token'));
    
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
