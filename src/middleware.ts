import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: ['/api/blog-posts', '/sign-in', '/sign-out'], // Add public routes here
});

// This is required for Next.js to recognize this file as a middleware
export const config = {
    matcher: ['/api/:path*', '/admin/:path*'], // Protect admin routes
};