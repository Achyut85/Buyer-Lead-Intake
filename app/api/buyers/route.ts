import { NextRequest, NextResponse } from "next/server";
import { createBuyerSchema } from "@/app/utils/validation";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// POST: Add buyer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createBuyerSchema.parse(body);

    const ownerId = "550e8400-e29b-41d4-a716-446655440000"; // replace with session/auth

    const bhkMap: Record<string, "One" | "Two" | "Three" | "Four" | "Studio"> = {
      "1": "One",
      "2": "Two",
      "3": "Three",
      "4": "Four",
      Studio: "Studio",
    };

    const TIMELINE_MAP: Record<
      string,
      "ZERO_TO_THREE_MONTHS" | "THREE_TO_SIX_MONTHS" | "MORE_THAN_SIX_MONTHS" | "EXPLORING"
    > = {
      "0-3m": "ZERO_TO_THREE_MONTHS",
      "3-6m": "THREE_TO_SIX_MONTHS",
      ">6m": "MORE_THAN_SIX_MONTHS",
      Exploring: "EXPLORING",
    };

    const buyer = await prisma.buyer.create({
      data: {
        ...validatedData,
        ownerId,
        bhk: validatedData.bhk ? bhkMap[validatedData.bhk] : null,
        timeline: TIMELINE_MAP[validatedData.timeline] || validatedData.timeline,
        budgetMin: validatedData.budgetMin ?? null,
        budgetMax: validatedData.budgetMax ?? null,
        notes: validatedData.notes ?? null,
        tags: validatedData.tags ?? [],
      },
    });

    return NextResponse.json({ success: true, buyer }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}



// GET: Fetch buyers with pagination (concurrency safe)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination: page number and limit
    const page = Math.min(Math.max(parseInt(searchParams.get("page") || "1"), 1), 20); // 1-20 pages max
    const limit = 10; // rows per page
    const skip = (page - 1) * limit;

    // Concurrency control: use transaction for consistent count + fetch
    const [total, buyers] = await prisma.$transaction([
      prisma.buyer.count(),
      prisma.buyer.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const totalPages = Math.min(Math.ceil(total / limit), 20); // max 20 pages

    return NextResponse.json({
      success: true,
      buyers,
      total,
      totalPages,
      page,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
