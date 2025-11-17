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
      
      console.log("🔍 Checking FIREBASE_ADMIN_SDK...");
      console.log("FIREBASE_ADMIN_SDK exists:", !!serviceAccountJson);
      console.log("FIREBASE_ADMIN_SDK length:", serviceAccountJson?.length || 0);
      console.log("FIREBASE_ADMIN_SDK starts with:", serviceAccountJson?.substring(0, 50) || "none");
      
      if (serviceAccountJson) {
        try {
          // Try to parse the JSON
          const serviceAccount = JSON.parse(serviceAccountJson);
          console.log("✅ JSON parsed successfully");
          console.log("Project ID:", serviceAccount.project_id);
          
          firebaseAdmin = initializeApp({
            credential: cert(serviceAccount),
          });
          console.log("✅ Firebase Admin initialized successfully");
        } catch (parseError: any) {
          console.error("❌ Error parsing Firebase Admin SDK:", parseError?.message || parseError);
          console.error("Parse error details:", parseError);
          console.error("FIREBASE_ADMIN_SDK first 200 chars:", serviceAccountJson?.substring(0, 200));
          console.error("FIREBASE_ADMIN_SDK last 100 chars:", serviceAccountJson?.substring(Math.max(0, serviceAccountJson.length - 100)));
        }
      } else {
        console.warn("⚠️ FIREBASE_ADMIN_SDK not set. Server-side auth verification disabled.");
        console.warn("Add FIREBASE_ADMIN_SDK to your .env.local file.");
      }
    } else {
      firebaseAdmin = getApps()[0];
      console.log("✅ Firebase Admin already initialized");
    }
  } catch (error: any) {
    console.error("❌ Firebase Admin initialization error:", error?.message || error);
    console.error("Full error:", error);
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
      console.warn("⚠️ No authorization header found in request");
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    if (!idToken) {
      console.warn("⚠️ No token found in Authorization header");
      return null;
    }

    // Verify the token using Firebase Admin
    if (firebaseAdmin) {
      try {
        const adminAuth = getAuth(firebaseAdmin);
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        console.log("✅ Token verified successfully for user:", decodedToken.uid);
        return {
          userId: decodedToken.uid,
          email: decodedToken.email || "",
          name: decodedToken.name,
        };
      } catch (verifyError: any) {
        console.error("❌ Error verifying Firebase token:", verifyError?.message || verifyError);
        console.error("Token preview:", idToken.substring(0, 20) + "...");
        return null;
      }
    }

    // If Firebase Admin is not set up, log warning
    console.warn("⚠️ Firebase Admin not initialized. Cannot verify token.");
    console.warn("FIREBASE_ADMIN_SDK:", process.env.FIREBASE_ADMIN_SDK ? "Set" : "Not set");
    return null;
  } catch (error) {
    console.error("❌ Error in getUserInfoFromRequest:", error);
    return null;
  }
}

