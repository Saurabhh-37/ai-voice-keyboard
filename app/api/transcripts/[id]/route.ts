import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserInfoFromRequest } from "@/lib/api-helpers";

// GET /api/transcripts/[id] - Get a single transcript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInfo = await getUserInfoFromRequest(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const transcript = await prisma.transcription.findFirst({
      where: {
        id,
        userId: userInfo.userId, // Ensure user owns this transcript
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}

// DELETE /api/transcripts/[id] - Delete a transcript
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
    const transcript = await prisma.transcription.findFirst({
      where: { id, userId: userInfo.userId },
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    await prisma.transcription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transcript:", error);
    return NextResponse.json(
      { error: "Failed to delete transcript" },
      { status: 500 }
    );
  }
}

