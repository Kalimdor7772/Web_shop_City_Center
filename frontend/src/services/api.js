const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE_URL = rawBaseUrl.endsWith('/api')
    ? rawBaseUrl
    : `${rawBaseUrl.replace(/\/$/, '')}/api`;

async function fetchAPI(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (error) {
        const networkError = new Error(
            'Не удалось подключиться к серверу. Запусти backend на http://localhost:5000 и попробуй снова.'
        );
        networkError.cause = error;
        networkError.status = 0;
        throw networkError;
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : {};

    if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }

        const error = new Error(data.message || 'API Error');
        error.status = response.status;
        throw error;
    }

    return data;
}

export default fetchAPI;
