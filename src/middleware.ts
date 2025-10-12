import { NextRequest, NextResponse } from "next/server";

// Auth middleware: No page is accessible without being logged in, except the login page (/).
// Also prevent authenticated users from seeing the login page.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read token from cookies (must be set on login from client)
  const token = req.cookies.get("auth_token")?.value;
  console.log('Toke: ',token)

  const isLoginPage = pathname === "/";

  // If user is authenticated and tries to access login page, redirect to default dashboard page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/formateurs", req.url));
  }

  // If not authenticated:
  // - Allow only the login page ("/")
  // - Block any other route (non-static, non-API due to matcher) by redirecting to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals, public assets, images, favicon and API routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|assets).*)",
  ],
};