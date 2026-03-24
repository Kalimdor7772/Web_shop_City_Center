import { NextResponse } from "next/server";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const apiBaseUrl = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, "")}/api`;

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch(`${apiBaseUrl}/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("AI proxy error:", error);

        return NextResponse.json(
            {
                reply: "Помощник временно недоступен. Попробуйте еще раз через минуту.",
                text: "Помощник временно недоступен. Попробуйте еще раз через минуту.",
                emotion: "thinking",
                suggestions: [],
                recommendations: [],
                actions: [],
            },
            { status: 503 }
        );
    }
}
