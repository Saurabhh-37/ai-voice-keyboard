import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

// Initialize Firebase Admin (for server-side auth verification)
let firebaseAdmin: App | null = null;

if (typeof window === "undefined") {
  try {
    if (getApps().length === 0) {
      // For Railway deployment, use environment variables
      const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK;
      
      if (serviceAccountJson) {
        try {
          const serviceAccount = JSON.parse(serviceAccountJson);
          firebaseAdmin = initializeApp({
            credential: cert(serviceAccount),
          });
        } catch (parseError: any) {
          // Only log errors in production for debugging
          if (process.env.NODE_ENV === "production") {
            console.error("Error parsing Firebase Admin SDK:", parseError?.message || "Unknown error");
          }
        }
      }
    } else {
      firebaseAdmin = getApps()[0];
    }
  } catch (error) {
    // Log only in production
    if (process.env.NODE_ENV === "production") {
      console.error("Firebase Admin initialization error:", error instanceof Error ? error.message : "Unknown error");
    }
  }
}

// Helper to get user info from request (ID, email, name)
export async function getUserInfoFromRequest(
  request: NextRequest
): Promise<{ userId: string; email: string; name?: string } | null> {
  try {
    // Get the Firebase ID token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    if (!idToken) {
      return null;
    }

    // Verify the token using Firebase Admin
    if (firebaseAdmin) {
      try {
        const adminAuth = getAuth(firebaseAdmin);
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        return {
          userId: decodedToken.uid,
          email: decodedToken.email || "",
          name: decodedToken.name,
        };
      } catch (verifyError) {
        // Log only in production for debugging auth issues
        if (process.env.NODE_ENV === "production") {
          console.error("Error verifying Firebase token:", verifyError instanceof Error ? verifyError.message : "Unknown error");
        }
        return null;
      }
    }

    // Firebase Admin not initialized
    return null;
  } catch (error) {
    // Log only in production
    if (process.env.NODE_ENV === "production") {
      console.error("Error in getUserInfoFromRequest:", error instanceof Error ? error.message : "Unknown error");
    }
    return null;
  }
}

