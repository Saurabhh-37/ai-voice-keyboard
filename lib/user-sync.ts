import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Sync user data from Firebase to PostgreSQL database
 * This ensures the database has the latest user information
 */
export async function syncUserToDatabase(
  userId: string,
  email: string,
  name?: string | null
): Promise<void> {
  try {
    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      // User exists - update only if email doesn't conflict
      // Check if email is already taken by another user
      if (email) {
        const emailUser = await prisma.user.findUnique({
          where: { email },
        });

        // If email is taken by a different user, don't update email
        if (emailUser && emailUser.id !== userId) {
          // Update only name to avoid email conflict
          await prisma.user.update({
            where: { id: userId },
            data: {
              name: name !== undefined ? name : undefined,
            },
          });
          return;
        }
      }

      // Safe to update email
      await prisma.user.update({
        where: { id: userId },
        data: {
          email: email || existingUser.email,
          name: name !== undefined ? name : undefined,
        },
      });
    } else {
      // User doesn't exist - create new user
      // Check if email is already taken
      if (email) {
        const emailUser = await prisma.user.findUnique({
          where: { email },
        });

        if (emailUser) {
          // Create user with placeholder email to avoid conflict
          await prisma.user.create({
            data: {
              id: userId,
              email: `temp-${userId}@placeholder.com`,
              name: name || null,
            },
          });
          return;
        }
      }

      // Safe to create with email
      await prisma.user.create({
        data: {
          id: userId,
          email: email || `temp-${userId}@placeholder.com`,
          name: name || null,
        },
      });
    }
  } catch (error) {
    // Handle Prisma unique constraint errors gracefully
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint violation - silently handle
        return;
      }
    }
    // Log only in production for debugging
    if (process.env.NODE_ENV === "production") {
      console.error("Error syncing user to database:", error instanceof Error ? error.message : "Unknown error");
    }
    // Don't throw - this is a background sync operation
  }
}

