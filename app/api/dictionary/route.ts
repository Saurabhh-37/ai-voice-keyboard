import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/api-helpers";

// GET /api/dictionary - Get all dictionary words for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: "" },
      update: {},
    });

    const words = await prisma.dictionaryWord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        phrase: true,
        correction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("Error fetching dictionary words:", error);
    return NextResponse.json(
      { error: "Failed to fetch dictionary words" },
      { status: 500 }
    );
  }
}

// POST /api/dictionary - Create a new dictionary word
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phrase, correction } = body;

    if (!phrase || typeof phrase !== "string" || !correction || typeof correction !== "string") {
      return NextResponse.json(
        { error: "Phrase and correction are required" },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: "" },
      update: {},
    });

    // Check if word already exists for this user
    const existing = await prisma.dictionaryWord.findUnique({
      where: {
        userId_phrase: {
          userId,
          phrase: phrase.trim(),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This phrase already exists in your dictionary" },
        { status: 409 }
      );
    }

    const word = await prisma.dictionaryWord.create({
      data: {
        phrase: phrase.trim(),
        correction: correction.trim(),
        userId,
      },
      select: {
        id: true,
        phrase: true,
        correction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(word, { status: 201 });
  } catch (error: any) {
    console.error("Error creating dictionary word:", error);
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This phrase already exists in your dictionary" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create dictionary word" },
      { status: 500 }
    );
  }
}

