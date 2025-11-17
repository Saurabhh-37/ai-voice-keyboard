import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Cache to track recently synced users (prevents excessive DB queries)
// In production, use Redis or similar for distributed caching
const userSyncCache = new Map<string, number>();
const SYNC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Sync user data from Firebase to PostgreSQL database
 * This ensures the database has the latest user information
 * 
 * Optimized to reduce database queries:
 * - Caches recent syncs to avoid redundant queries
 * - Uses upsert where possible to reduce query count
 */
export async function syncUserToDatabase(
  userId: string,
  email: string,
  name?: string | null
): Promise<void> {
  try {
    // Check cache to avoid redundant syncs
    const cacheKey = userId;
    const lastSync = userSyncCache.get(cacheKey);
    const now = Date.now();
    
    // Skip if synced recently (within TTL)
    if (lastSync && (now - lastSync) < SYNC_CACHE_TTL) {
      return;
    }

    // Try upsert first (most efficient - single query)
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: email || undefined,
          name: name !== undefined ? name : undefined,
        },
        create: {
          id: userId,
          email: email || `temp-${userId}@placeholder.com`,
          name: name || null,
        },
      });
      
      // Update cache on success
      userSyncCache.set(cacheKey, now);
      return;
    } catch (upsertError) {
      // If upsert fails due to email conflict, handle gracefully
      if (upsertError instanceof Prisma.PrismaClientKnownRequestError) {
        if (upsertError.code === "P2002") {
          // Unique constraint violation - email might be taken
          // Try to update only name if user exists, or create with placeholder email
          try {
            const existingUser = await prisma.user.findUnique({
              where: { id: userId },
            });

            if (existingUser) {
              // User exists - just update name
              await prisma.user.update({
                where: { id: userId },
                data: {
                  name: name !== undefined ? name : undefined,
                },
              });
            } else {
              // User doesn't exist - create with placeholder email
              await prisma.user.create({
                data: {
                  id: userId,
                  email: `temp-${userId}@placeholder.com`,
                  name: name || null,
                },
              });
            }
            
            userSyncCache.set(cacheKey, now);
            return;
          } catch (fallbackError) {
            // Silently handle fallback errors
            if (process.env.NODE_ENV === "production") {
              console.error("Error in user sync fallback:", fallbackError instanceof Error ? fallbackError.message : "Unknown error");
            }
            return;
          }
        }
      }
      
      // Re-throw if it's not a P2002 error
      throw upsertError;
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

