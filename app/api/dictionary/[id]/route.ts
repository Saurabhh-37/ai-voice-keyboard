import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserInfoFromRequest } from "@/lib/api-helpers";

// PUT /api/dictionary/[id] - Update a dictionary word
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { phrase, correction } = body;

    if (!phrase || typeof phrase !== "string" || !correction || typeof correction !== "string") {
      return NextResponse.json(
        { error: "Phrase and correction are required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.dictionaryWord.findFirst({
      where: { id, userId: userInfo.userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Dictionary word not found" },
        { status: 404 }
      );
    }

    // If phrase changed, check for conflicts
    if (phrase !== existing.phrase) {
      const conflict = await prisma.dictionaryWord.findUnique({
        where: {
          userId_phrase: {
            userId: userInfo.userId,
            phrase,
          },
        },
      });

      if (conflict && conflict.id !== id) {
        return NextResponse.json(
          { error: "A dictionary word with this phrase already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.dictionaryWord.update({
      where: { id },
      data: { phrase, correction },
      select: {
        id: true,
        phrase: true,
        correction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating dictionary word:", error);
    return NextResponse.json(
      { error: "Failed to update dictionary word" },
      { status: 500 }
    );
  }
}

// DELETE /api/dictionary/[id] - Delete a dictionary word
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Verify ownership before deleting
    const word = await prisma.dictionaryWord.findFirst({
      where: { id, userId: userInfo.userId },
    });

    if (!word) {
      return NextResponse.json(
        { error: "Dictionary word not found" },
        { status: 404 }
      );
    }

    await prisma.dictionaryWord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dictionary word:", error);
    return NextResponse.json(
      { error: "Failed to delete dictionary word" },
      { status: 500 }
    );
  }
}

