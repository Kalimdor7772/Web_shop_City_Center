import fetchAPI from './api';

const getAuthToken = (response) => response?.data?.token || response?.token || null;

export const login = async (email, password) => {
  const response = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = response?.data?.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return response;
};

export const register = async (userData) => {
    const response = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    const token = response?.data?.token;

    if (token) {
        localStorage.setItem("token", token);
    }

    return response;
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

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('pending_order');
    localStorage.removeItem('draft_order');
    localStorage.removeItem('wishlistItems');
    localStorage.removeItem('ai_chat_history');
    localStorage.removeItem('ai_preferences');
    sessionStorage.removeItem('draft_order');
};
