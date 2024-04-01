import { NextResponse } from "next/server";

/**
 * This middleware is used to add headers with info to the request object
 * that can then be retrieved by server components.
 */
export function middleware(request: Request) {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);
    requestHeaders.set("x-origin", origin);
    requestHeaders.set("x-pathname", pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}
