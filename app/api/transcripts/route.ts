import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncUserToDatabase } from "@/lib/user-sync";

// Helper to get user info from request (ID, email, name)
async function getUserInfoFromRequest(
  request: NextRequest
): Promise<{ userId: string; email: string; name?: string } | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    // Import Firebase Admin dynamically
    const { getAuth } = await import("firebase-admin/auth");
    const { getApps } = await import("firebase-admin/app");
    
    if (getApps().length === 0) {
      return null;
    }

    const adminAuth = getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    return {
      userId: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// GET /api/transcripts - Get all transcripts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database
    await syncUserToDatabase(userInfo.userId, userInfo.email, userInfo.name);

    const transcripts = await prisma.transcription.findMany({
      where: { userId: userInfo.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(transcripts);
  } catch (error) {
    console.error("Error fetching transcripts:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcripts" },
      { status: 500 }
    );
  }
}

// POST /api/transcripts - Create a new transcript
export async function POST(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Sync user to database
    await syncUserToDatabase(userInfo.userId, userInfo.email, userInfo.name);

    const transcript = await prisma.transcription.create({
      data: {
        text,
        userId: userInfo.userId,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(transcript, { status: 201 });
  } catch (error) {
    console.error("Error creating transcript:", error);
    return NextResponse.json(
      { error: "Failed to create transcript" },
      { status: 500 }
    );
  }
}

