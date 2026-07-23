const resolveApiBaseUrl = () => {
    const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const devFallback = "http://localhost:5000/api";
    const rawBaseUrl = configuredBaseUrl || (process.env.NODE_ENV === "production" ? "" : devFallback);

    if (!rawBaseUrl) {
        return null;
    }

    return rawBaseUrl.endsWith("/api")
        ? rawBaseUrl
        : `${rawBaseUrl.replace(/\/$/, "")}/api`;
};

const BASE_URL = resolveApiBaseUrl();

async function fetchAPI(endpoint, options = {}) {
    if (!BASE_URL) {
        const configError = new Error(
            "API URL not configured. Set NEXT_PUBLIC_API_URL in frontend environment variables."
        );
        configError.status = 500;
        throw configError;
    }

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    let response;

    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
        });
    } catch (error) {
        const networkError = new Error("Cannot connect to API server. Check NEXT_PUBLIC_API_URL and backend availability.");
        networkError.cause = error;
        networkError.status = 0;
        throw networkError;
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : {};

    if (!response.ok) {
        const error = new Error(data.message || "API Error");
        error.status = response.status;
        throw error;
    }

    return data;
}

export default fetchAPI;
