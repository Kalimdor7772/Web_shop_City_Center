
/**
 * AI Analytics Service (In-Memory)
 * Tracks performance of the AI Seller.
 * Note: Data resets on server restart. For production, use a Database (Postgres/Mongo).
 */

// Singleton store
global.aiStats = global.aiStats || {
    totalMessages: 0,
    conversions: 0,
    intents: {},
    recommendationsGiven: 0,
    recentLogs: [] // Keep last 50
};

export const Analytics = {
    // 1. Log a User Message & Intent
    logIntent: (intentType) => {
        global.aiStats.totalMessages++;
        global.aiStats.intents[intentType] = (global.aiStats.intents[intentType] || 0) + 1;
    },

    // 2. Log a Recommendation served
    logRecommendation: (count) => {
        global.aiStats.recommendationsGiven += count;
    },

    // 3. Log a Conversion (User added item to cart)
    // Heuristic: If we recommended X recently and user bought it? 
    // For V1, we just track "Product Added" events triggered by AI interactions if possible,
    // or just raw cart adds if we assume AI influence.
    // Let's rely on the API calling this when "product_added" event flows through.
    logConversion: () => {
        global.aiStats.conversions++;
    },

    // 4. Add to Activity Feed
    logActivity: (entry) => {
        // entry: { type: 'user'|'ai'|'system', text, timestamp }
        const log = { ...entry, id: Date.now(), timestamp: new Date().toISOString() };
        global.aiStats.recentLogs.unshift(log);
        if (global.aiStats.recentLogs.length > 50) {
            global.aiStats.recentLogs.pop();
        }
    },

    // 5. Get Stats for Dashboard
    getStats: () => {
        return { ...global.aiStats };
    }
};
