import { NextResponse } from "next/server";

const resolveApiBaseUrl = () => {
    const serverBaseUrl = process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
    const devFallback = "http://localhost:5000/api";
    const rawBaseUrl = serverBaseUrl || (process.env.NODE_ENV === "production" ? "" : devFallback);

    if (!rawBaseUrl) {
        return null;
    }

    return rawBaseUrl.endsWith("/api")
        ? rawBaseUrl
        : `${rawBaseUrl.replace(/\/$/, "")}/api`;
};

export async function POST(request) {
    try {
        const apiBaseUrl = resolveApiBaseUrl();

        if (!apiBaseUrl) {
            return NextResponse.json(
                {
                    reply: "Assistant backend is not configured. Set API_URL in server environment variables.",
                    text: "Assistant backend is not configured. Set API_URL in server environment variables.",
                    emotion: "thinking",
                    suggestions: [],
                    recommendations: [],
                    actions: [],
                },
                { status: 500 }
            );
        }

        const body = await request.json();
        const authHeader = request.headers.get("authorization");
        const response = await fetch(`${apiBaseUrl}/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await response.json() : {};
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("AI proxy error:", error);

        return NextResponse.json(
            {
                reply: "Assistant is temporarily unavailable. Please try again in a minute.",
                text: "Assistant is temporarily unavailable. Please try again in a minute.",
                emotion: "thinking",
                suggestions: [],
                recommendations: [],
                actions: [],
            },
            { status: 503 }
        );
    }
}
