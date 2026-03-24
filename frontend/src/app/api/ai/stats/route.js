
import { NextResponse } from 'next/server';
import { Analytics } from "@/lib/aiAnalytics";

export async function GET() {
    try {
        const stats = Analytics.getStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
