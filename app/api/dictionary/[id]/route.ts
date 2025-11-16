import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/api-helpers";

// PUT /api/dictionary/[id] - Update a dictionary word
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
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
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Dictionary word not found" },
        { status: 404 }
      );
    }

    // Check if the new phrase conflicts with another entry
    const conflict = await prisma.dictionaryWord.findFirst({
      where: {
        userId,
        phrase: phrase.trim(),
        NOT: { id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "This phrase already exists in your dictionary" },
        { status: 409 }
      );
    }

    const updated = await prisma.dictionaryWord.update({
      where: { id },
      data: {
        phrase: phrase.trim(),
        correction: correction.trim(),
      },
      select: {
        id: true,
        phrase: true,
        correction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating dictionary word:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Dictionary word not found" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This phrase already exists in your dictionary" },
        { status: 409 }
      );
    }

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
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Verify ownership before deleting
    const word = await prisma.dictionaryWord.findFirst({
      where: { id, userId },
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
  } catch (error: any) {
    console.error("Error deleting dictionary word:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Dictionary word not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete dictionary word" },
      { status: 500 }
    );
  }
}

