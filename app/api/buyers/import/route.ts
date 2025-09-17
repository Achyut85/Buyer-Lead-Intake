import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { validateCsvBuyer } from "@/app/utils/validation";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const text = await file.text();

        const records = parse(text, { columns: true, skip_empty_lines: true, trim: true });

        if (records.length > 200) {
            return NextResponse.json({ error: "CSV exceeds maximum allowed rows (200)" }, { status: 400 });
        }

        const errors: { row: number; message: string }[] = [];
        const validData: any[] = [];

        const bhkMap: Record<string, "One" | "Two" | "Three" | "Four" | "Studio"> = {
            "1": "One",
            "2": "Two",
            "3": "Three",
            "4": "Four",
            "Studio": "Studio",
        };

        const TIMELINE_MAP: Record<string, "ZERO_TO_THREE_MONTHS" | "THREE_TO_SIX_MONTHS" | "MORE_THAN_SIX_MONTHS" | "EXPLORING"> = {
            "0-3m": "ZERO_TO_THREE_MONTHS",
            "3-6m": "THREE_TO_SIX_MONTHS",
            ">6m": "MORE_THAN_SIX_MONTHS",
            Exploring: "EXPLORING",
        };

        const SOURCE_MAP: Record<string, "Website" | "Referral" | "Walk_in" | "Call" | "Other"> = {
            Website: "Website",
            Referral: "Referral",
            "Walk-in": "Walk_in",
            Call: "Call",
            Other: "Other",
        };

        records.forEach((row: any, index: number) => {
            const result = validateCsvBuyer(row);

            if (!result.success) {
                errors.push({ row: index + 1, message: result.error.issues.map(e => e.message).join(", ") });
            } else {
                const data = result.data;
                const bhk = data.bhk ? bhkMap[data.bhk] : null;
                const timeline = TIMELINE_MAP[data.timeline];
                const source = SOURCE_MAP[data.source];

                if (!timeline) errors.push({ row: index + 1, message: `Invalid timeline: ${data.timeline}` });
                if (!source) errors.push({ row: index + 1, message: `Invalid source: ${data.source}` });

                if (timeline && source) {
                    validData.push({
                        ...data,
                        bhk,
                        timeline,
                        source,
                        tags: data.tags || [],
                        ownerId: "550e8400-e29b-41d4-a716-446655440000",
                    });
                }
            }
        });

        if (validData.length > 0) {
            await prisma.$transaction(validData.map(buyer => prisma.buyer.create({ data: buyer })));
        }

        return NextResponse.json({ inserted: validData.length, errors });
    } catch (err) {
        console.error("CSV Import Error:", err);
        return NextResponse.json({ error: "Failed to import CSV" }, { status: 500 });
    }
}
