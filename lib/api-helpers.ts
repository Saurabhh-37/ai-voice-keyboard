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
        } catch (error) {
          console.error("Error parsing Firebase Admin SDK:", error);
        }
      } else {
        console.warn("FIREBASE_ADMIN_SDK not set. Server-side auth verification will not work.");
      }
    } else {
      firebaseAdmin = getApps()[0];
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

/**
 * Get user ID from request using Firebase ID token
 * Returns null if token is invalid or missing
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // Get the Firebase ID token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    // Verify the token using Firebase Admin
    if (firebaseAdmin) {
      const adminAuth = getAuth(firebaseAdmin);
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      return decodedToken.uid;
    }

    // If Firebase Admin is not set up, return null
    // In development, you might want to allow this, but in production it should fail
    console.warn("Firebase Admin not initialized. Cannot verify token.");
    return null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
