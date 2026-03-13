import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/"];
const PROTECTED_PATHS = ["/sanctum", "/kingdom", "/bazaar", "/chronicle", "/grimoire"];
const AUTH_REDIRECT = "/kingdom";
const LOGIN_REDIRECT = "/";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const hasValidRefresh = refreshToken && !isTokenExpired(refreshToken)
    const hasValidAccess = accessToken && !isTokenExpired(accessToken)

    if (hasValidAccess && PUBLIC_PATHS.some(p => pathname === p)) {
        const mode = searchParams.get("mode");
        if (mode === "setup-password") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
    }

    if (!hasValidRefresh && PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL(LOGIN_REDIRECT, request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)",
    ],
};