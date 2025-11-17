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
          console.warn(`⚠️ Email ${email} already exists for user ${emailUser.id}, skipping email update for user ${userId}`);
          // Update only name
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
          console.warn(`⚠️ Email ${email} already exists for user ${emailUser.id}, creating user ${userId} without email`);
          // Create user without email to avoid conflict
          await prisma.user.create({
            data: {
              id: userId,
              email: `temp-${userId}@placeholder.com`, // Temporary email to satisfy unique constraint
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
        console.warn(`⚠️ Unique constraint violation in syncUserToDatabase for user ${userId}:`, error.meta);
        // Don't throw - this is a background sync operation
        return;
      }
    }
    console.error("Error syncing user to database:", error);
    // Don't throw - this is a background sync operation
  }
}

