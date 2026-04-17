import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/'];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  const token = (await cookies()).get("jwt")?.value;

  console.log("token");

  if (!publicRoutes.includes(path) && !token) {
    console.log("redirecting..");

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${path}${search}`);
    loginUrl.searchParams.set('guard', 'proxy');
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - verify-email (your specific route)
     * - (the root path)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|verify-email|reset-password|f|$).*)',
  ],
}