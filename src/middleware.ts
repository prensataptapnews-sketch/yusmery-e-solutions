import { NextResponse } from "next/server"

export default function middleware(req: any) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-url', req.url)
    
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}
