import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("@controle-mais:token")?.value;

  const isPublicRoute =
    request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/sign-up";

  if (!token) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
