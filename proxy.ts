import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (
            (path.startsWith("/dashboard") ||
                path.startsWith("/post-job") ||
                path.startsWith("/my-jobs")) &&
            token?.role !== "poster"
        ) {
            return NextResponse.redirect(new URL("/jobs", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;

                if (
                    path.startsWith("/dashboard") ||
                    path.startsWith("/post-job") ||
                    path.startsWith("/my-jobs")
                ) {
                    return !!token;
                }

                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/post-job/:path*", "/my-jobs/:path*"],
};
