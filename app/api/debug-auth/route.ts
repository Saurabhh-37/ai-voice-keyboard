import { NextRequest, NextResponse } from "next/server";
import { getUserInfoFromRequest } from "@/lib/api-helpers";

// Debug endpoint to check Firebase Admin setup
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const hasToken = !!authHeader?.startsWith("Bearer ");
  const tokenPreview = authHeader?.substring(0, 50) || "none";
  
  // Check environment
  const hasFirebaseAdminEnv = !!process.env.FIREBASE_ADMIN_SDK;
  const firebaseAdminEnvLength = process.env.FIREBASE_ADMIN_SDK?.length || 0;
  const firebaseAdminEnvPreview = process.env.FIREBASE_ADMIN_SDK?.substring(0, 100) || "none";
  
  // Try to get user info
  const userInfo = await getUserInfoFromRequest(request);
  
  // Try to parse FIREBASE_ADMIN_SDK
  let parseError = null;
  let parsedSuccessfully = false;
  if (process.env.FIREBASE_ADMIN_SDK) {
    try {
      JSON.parse(process.env.FIREBASE_ADMIN_SDK);
      parsedSuccessfully = true;
    } catch (err: any) {
      parseError = err.message;
    }
  }
  
  return NextResponse.json({
    request: {
      hasAuthHeader: !!authHeader,
      hasToken,
      tokenPreview,
    },
    environment: {
      hasFirebaseAdminEnv,
      firebaseAdminEnvLength,
      firebaseAdminEnvPreview,
      parsedSuccessfully,
      parseError,
    },
    authentication: {
      userInfo,
      authenticated: !!userInfo,
    },
  }, { status: 200 });
}


