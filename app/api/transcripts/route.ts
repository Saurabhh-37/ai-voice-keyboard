import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/api-helpers";

// GET /api/transcripts - Get all transcripts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: "" }, // Email will be updated from Firebase
      update: {},
    });

    const transcripts = await prisma.transcription.findMany({
      where: { userId },
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
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
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

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: "" },
      update: {},
    });

    const transcript = await prisma.transcription.create({
      data: {
        text,
        userId,
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

