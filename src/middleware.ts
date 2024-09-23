import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: ["/", "/api/public"], // Hier können Sie öffentliche Routen definieren
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'], // Matcher für die Middleware
};