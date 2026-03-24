const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseUrl = rawBaseUrl.endsWith("/api")
    ? rawBaseUrl
    : `${rawBaseUrl.replace(/\/$/, "")}/api`;

async function fetchAI(type, payload) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await fetch(`${baseUrl}/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ type, payload })
        });

        if (!response.ok) {
            throw new Error("AI Backend Error");
        }

        return await response.json();
    } catch (error) {
        console.error("AI Fetch Error:", error);
        return {
            text: "Связь с ассистентом временно нестабильна, но я скоро вернусь.",
            emotion: "thinking",
            recommendations: [],
            actions: []
        };
    }
}

export const sendUserMessage = async (message, preferences, cartState) => {
    return await fetchAI("user_message", { message, preferences, cartState });
};

export const notifyProductAdded = async (product, cartState, preferences) => {
    return await fetchAI("product_added", { product, cartState, preferences });
};

export const notifyCartCleared = async () => {
    return await fetchAI("cart_cleared", {});
};

export const detectIntent = () => ({ type: "handled_by_server" });
export const getRecommendations = () => [];
export const generateSellerReply = () => ({ text: "...", emotion: "thinking" });
