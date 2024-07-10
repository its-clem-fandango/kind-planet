import { PrismaClient } from "@prisma/client";

//Typescript doesn't have prisma, so we're creating a type assertion for the global object
const globalForPrisma = global as unknown as { prisma: PrismaClient };

//Check if there's a prisma instance on the global object, if there is, use it. If not, create a new instance with query logging enabled
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// If in production, we dont need to worry about hot reloading
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* NOTES: 
In development, Next.js uses hot reloading, which can cause your code to be re-executed multiple times.
Without this "if" check, you might create multiple Prisma instances, which is inefficient and can cause issues.
By attaching the instance to the global object in development, you ensure you're always using the same instance, even across hot reloads.
In production, this step is skipped because you don't need to worry about hot reloading.

Your .env files (.env.local for development and .env.production for production) are used
to set environment variables, but they don't directly affect how this code works. 
The NODE_ENV variable is typically set by your deployment process or start scripts, 
not by these .env files. This setup will work correctly with your environment configuration. 
In development, it will create a singleton Prisma instance, and in production, 
it will create a new instance each time the server starts (which is fine because there's no hot reloading in production). */
