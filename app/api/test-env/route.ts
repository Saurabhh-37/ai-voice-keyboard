import { NextResponse } from "next/server";

// Test endpoint to check if environment variables are loaded
export async function GET() {
  const hasFirebaseAdmin = !!process.env.FIREBASE_ADMIN_SDK;
  const length = process.env.FIREBASE_ADMIN_SDK?.length || 0;
  const startsWith = process.env.FIREBASE_ADMIN_SDK?.substring(0, 100) || "none";
  
  // Try to parse
  let parseError = null;
  let parsed = false;
  if (process.env.FIREBASE_ADMIN_SDK) {
    try {
      JSON.parse(process.env.FIREBASE_ADMIN_SDK);
      parsed = true;
    } catch (err: any) {
      parseError = err.message;
    }
  }
  
  return NextResponse.json({
    hasFirebaseAdmin,
    length,
    startsWith,
    parsed,
    parseError,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes("FIREBASE") || k.includes("DATABASE")),
  });
}


