const DRAFT_ORDER_KEY = "draft_order";
const DRAFT_ORDER_PREFIX = "draft_order:";

const isBrowser = () => typeof window !== "undefined";

export const saveDraftOrder = (draftOrder) => {
    if (!isBrowser() || !draftOrder?.id) {
        return;
    }

    const serializedDraft = JSON.stringify(draftOrder);

    sessionStorage.setItem(DRAFT_ORDER_KEY, serializedDraft);
    sessionStorage.setItem(`${DRAFT_ORDER_PREFIX}${draftOrder.id}`, serializedDraft);
    localStorage.setItem(DRAFT_ORDER_KEY, serializedDraft);
    localStorage.setItem(`${DRAFT_ORDER_PREFIX}${draftOrder.id}`, serializedDraft);
};

export const getDraftOrder = (draftId) => {
    if (!isBrowser()) {
        return null;
    }

    const candidateKeys = draftId
        ? [`${DRAFT_ORDER_PREFIX}${draftId}`, DRAFT_ORDER_KEY]
        : [DRAFT_ORDER_KEY];

    for (const key of candidateKeys) {
        const rawDraft = sessionStorage.getItem(key) || localStorage.getItem(key);

        if (!rawDraft) {
            continue;
        }

        try {
            const parsedDraft = JSON.parse(rawDraft);
            if (!draftId || parsedDraft?.id === draftId) {
                return parsedDraft;
            }
        } catch (error) {
            console.warn("Failed to parse payment draft:", error);
        }
    }

    return null;
};

export const clearDraftOrder = (draftId) => {
    if (!isBrowser()) {
        return;
    }

    const candidateKeys = draftId
        ? [`${DRAFT_ORDER_PREFIX}${draftId}`, DRAFT_ORDER_KEY]
        : [DRAFT_ORDER_KEY];

    for (const key of candidateKeys) {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    }
};
