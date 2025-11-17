import { NextRequest, NextResponse } from "next/server";
import { getUserInfoFromRequest } from "@/lib/api-helpers";

// Test endpoint to debug authentication
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const hasToken = !!authHeader?.startsWith("Bearer ");
  
  const userInfo = await getUserInfoFromRequest(request);
  
  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    hasToken,
    tokenPreview: authHeader?.substring(0, 30) || "none",
    userInfo,
    firebaseAdminInitialized: process.env.FIREBASE_ADMIN_SDK ? "Yes" : "No",
  });
}


