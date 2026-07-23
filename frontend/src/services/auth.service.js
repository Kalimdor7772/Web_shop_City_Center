import fetchAPI from './api';

export const login = async (email, password) => {
    return await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = async (userData) => {
    return await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const getMe = async () => {
    return await fetchAPI('/auth/me');
};

export const updateProfile = async (profileData) => {
    return await fetchAPI('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
};

export const logout = async () => {
    try {
        await fetchAPI('/auth/logout', {
            method: 'POST',
        });
    } catch {
        // Continue local cleanup even if backend logout fails.
    }

    localStorage.removeItem('pending_order');
    localStorage.removeItem('draft_order');
    localStorage.removeItem('wishlistItems');
    localStorage.removeItem('ai_chat_history');
    localStorage.removeItem('ai_preferences');
    sessionStorage.removeItem('draft_order');
};
