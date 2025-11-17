import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/api-helpers";

// GET /api/settings - Get user settings
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

    // Get or create settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        autoPunctuation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.userSettings.create({
        data: {
          userId,
          autoPunctuation: false,
        },
        select: {
          id: true,
          userId: true,
          autoPunctuation: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { autoPunctuation } = body;

    if (typeof autoPunctuation !== "boolean") {
      return NextResponse.json(
        { error: "autoPunctuation must be a boolean" },
        { status: 400 }
      );
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email: "" },
      update: {},
    });

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        autoPunctuation,
      },
      update: {
        autoPunctuation,
      },
      select: {
        id: true,
        userId: true,
        autoPunctuation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

