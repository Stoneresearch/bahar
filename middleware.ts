import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: [
        '/', // Public home route
        '/sign-in',
        '/sign-out',
        '/favicon.ico', // Ensure favicon is accessible
    ],
});

// Middleware configuration
export const config = {
    matcher: [
        '/((?!.*\\..*|_next).*)', // Protect all routes except public ones
        '/admin/:path*', // Ensure admin routes are protected
        '/(api|trpc)(.*)', // Protect all API and TRPC routes
    ],
};