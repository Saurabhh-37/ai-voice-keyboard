import { prisma } from "@/lib/db";

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
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: email || "",
        name: name || null,
      },
      update: {
        email: email || undefined,
        name: name !== undefined ? name : undefined,
      },
    });
  } catch (error) {
    console.error("Error syncing user to database:", error);
    // Don't throw - this is a background sync operation
  }
}

