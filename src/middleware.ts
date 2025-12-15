import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublic = path === '/' || path === '/signup' || path.startsWith('/verify') || path.startsWith('/auth/callback') || path.startsWith('/_next') || path.startsWith('/favicon.ico') || path.startsWith('/api') || path.startsWith('/images');

    if (!token && !isPublic) {
        // If not authenticated and trying to access a protected route, redirect to login
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && path === '/') {
        // If authenticated and trying to access login, redirect to home
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
