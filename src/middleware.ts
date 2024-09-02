import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    //NOTE - Determine public paths
    const isPublicPath = path === "/signup" || path === "/verifyemail" || path === "/login"

    //NOTE - determine user is logged in cause has token => then
    const token = request.cookies.get("token")?.value || ""

    //NOTE - restrict user from hitting public paths
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/userprofile', request.url))
    }

    //NOTE - 
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }


}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/signup",
        "/verifyemail",
        "/login",
        "/userprofile",
        "/logout",
    ]
}