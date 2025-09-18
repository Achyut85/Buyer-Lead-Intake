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

    const SOURCE_MAP: Record<string, "Website" | "Referral" | "Walk_in" | "Call" | "Other"> = {
      Website: "Website",
      Referral: "Referral",
      "Walk-in": "Walk_in", // matches Prisma enum
      Call: "Call",
      Other: "Other",
    };

    const buyer = await prisma.buyer.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email ?? null,
        phone: validatedData.phone,
        city: validatedData.city,
        propertyType: validatedData.propertyType,
        bhk: validatedData.bhk ? bhkMap[validatedData.bhk] : null,
        purpose: validatedData.purpose,
        budgetMin: validatedData.budgetMin ?? null,
        budgetMax: validatedData.budgetMax ?? null,
        timeline: TIMELINE_MAP[validatedData.timeline] || validatedData.timeline,
        source: SOURCE_MAP[validatedData.source], // ✅ FIX HERE
        status: validatedData.status,
        notes: validatedData.notes ?? null,
        tags: validatedData.tags ?? [],
        ownerId,
      },
    });

    return NextResponse.json({ success: true, buyer }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: err.flatten() },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}





export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // page with safe default
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);

    // filters
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const status = searchParams.get("status");
    const timeline = searchParams.get("timeline");

    // build where clause
    const where: any = {};
    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;

    // count with filters
    let total = 0;
    try {
      total = await prisma.buyer.count({ where });
    } catch (err) {
      console.error("Prisma count error:", err);
    }

    // ✅ max 10 pages, dynamic rows per page
    const totalPages = Math.min(10, Math.max(Math.ceil(total / 10), 1));
    const limit = Math.ceil(total / totalPages) || 1; // rows per page
    const skip = (page - 1) * limit;

    // fetch rows with filters
    const buyers = await prisma.buyer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      buyers,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET /api/buyers error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
