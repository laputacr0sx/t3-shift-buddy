import { authMiddleware } from '@clerk/nextjs';

import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    afterAuth(auth, req) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return NextResponse.redirect(new URL('/', req.url));
            // return redirectToSignIn({ returnBackUrl: req.url });
        }
        // If the user is logged in and trying to access a protected route, allow them to access route
        if (auth.userId && !auth.isPublicRoute) {
            return NextResponse.next();
        }
        // Allow users visiting public routes to access them
        return NextResponse.next();
    },
    publicRoutes: [
        '/(api|trpc)(.*)',
        '/'
        // '/((?!.+\\.[\\w]+$|_next).*)',
        // '/api/webhooks(.*)'
    ]
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
};
