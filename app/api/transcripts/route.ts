import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserInfoFromRequest } from "@/lib/api-helpers";
import { syncUserToDatabase } from "@/lib/user-sync";

// GET /api/transcripts - Get all transcripts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    
    if (!userInfo) {
      return NextResponse.json({ 
        error: "Unauthorized"
      }, { status: 401 });
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
    if (process.env.NODE_ENV === "production") {
      console.error("Error fetching transcripts:", error instanceof Error ? error.message : "Unknown error");
    }
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
    if (process.env.NODE_ENV === "production") {
      console.error("Error creating transcript:", error instanceof Error ? error.message : "Unknown error");
    }
    return NextResponse.json(
      { error: "Failed to create transcript" },
      { status: 500 }
    );
  }
}

