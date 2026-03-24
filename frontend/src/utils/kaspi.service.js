/**
 * Mock Kaspi Payment Service
 * Simulates external API interactions for Kaspi Pay
 */

const KASPI_MOCK_DELAY = 1000; // 1 second network simulated delay
const TRANSACTIONS_KEY = 'mock_kaspi_transactions';

const loadTransactions = () => {
    if (typeof window === 'undefined') {
        return {};
    }

    const rawTransactions =
        sessionStorage.getItem(TRANSACTIONS_KEY) ||
        localStorage.getItem(TRANSACTIONS_KEY) ||
        '{}';

    try {
        return JSON.parse(rawTransactions);
    } catch (error) {
        console.warn('Failed to parse mock Kaspi transactions:', error);
        return {};
    }
};

const saveTransactions = (transactions) => {
    if (typeof window === 'undefined') {
        return;
    }

    const serializedTransactions = JSON.stringify(transactions);
    sessionStorage.setItem(TRANSACTIONS_KEY, serializedTransactions);
    localStorage.setItem(TRANSACTIONS_KEY, serializedTransactions);
};

export const kaspiService = {
    /**
     * Creates a mock payment transaction
     * @param {string} orderId - Internal Order ID
     * @param {number} amount - Total amount to pay
     * @returns {Promise<{paymentId: string, redirectUrl: string}>}
     */
    createPayment: async (orderId, amount) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, KASPI_MOCK_DELAY));

        const paymentId = `ksp_${Math.random().toString(36).substr(2, 9)}`;

        // In a real app, this would be a redirect to https://kaspi.kz/...
        // Here we redirect to our internal mock page
        const redirectUrl = `/payment/kaspi?id=${paymentId}&amount=${amount}&ref=${orderId}`;

        // Store mock transaction state in sessionStorage (acting as "Database")
        const transaction = {
            id: paymentId,
            orderId,
            amount,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        // We use sessionStorage to persist this "server side" state for the duration of the session
        const transactions = loadTransactions();
        transactions[paymentId] = transaction;
        saveTransactions(transactions);

        return {
            paymentId,
            redirectUrl
        };
    },

    /**
     * Checks the status of a payment
     * @param {string} paymentId 
     * @returns {Promise<{status: 'PENDING' | 'SUCCESS' | 'FAILED'}>}
     */
    checkPaymentStatus: async (paymentId) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const transactions = loadTransactions();
        const transaction = transactions[paymentId];

        if (!transaction) {
            throw new Error('Payment not found');
        }

        return { status: transaction.status };
    },

    /**
     * FORCE UPDATE status (For Mock UI buttons only)
     * This wouldn't exist in a real client SDK
     */
    updatePaymentStatus: (paymentId, status) => {
        const transactions = loadTransactions();
        if (transactions[paymentId]) {
            transactions[paymentId].status = status;
            saveTransactions(transactions);
            return true;
        }
        return false;
    },

    getTransaction: (paymentId) => {
        const transactions = loadTransactions();
        return transactions[paymentId] || null;
    }
};
