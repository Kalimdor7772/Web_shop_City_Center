"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/auth.service";

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    updateProfile: async () => ({ success: false }),
    verifySMS: () => ({ success: false }),
    completeOnboarding: () => ({ success: false }),
    logout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const applyUserUpdate = (incomingUser) => {
        setUser((prev) => {
            if (!prev) {
                return incomingUser;
            }

            return {
                ...prev,
                ...incomingUser,
                profile: incomingUser?.profile ?? prev.profile ?? {}
            };
        });
    };

    // Load user from backend on mount if token exists
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await authService.getMe();
                    if (response.success) {
                        setUser(response.data);
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    if (error?.status !== 401) {
                        console.error("Failed to fetch user:", error);
                    }
                    localStorage.removeItem("token");
                }
            }
            setIsInitialized(true);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response.success) {
                setUser(response.data);
                setIsAuthenticated(true);
                return { success: true, needsOnboarding: !response.data?.profile };
            }
            return { success: false, error: response.message || "Login failed" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success) {
                setUser(response.data);
                setIsAuthenticated(true);
                return { success: true, needsOnboarding: true };
            }
            return { success: false, error: response.message || "Registration failed" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authService.updateProfile(profileData);
            if (response.success) {
                applyUserUpdate(response.data);
                return { success: true, data: response.data };
            }
            return { success: false, error: response.message || "Profile update failed" };
        } catch (error) {
            return { success: false, error: error.message || "Profile update failed" };
        }
    };

    const verifySMS = (code) => {
        if (code !== "123456") {
            return { success: false, error: "Неверный код подтверждения" };
        }

        setUser((prev) => ({ ...prev, isVerified: true }));
        return { success: true };
    };

    const completeOnboarding = async (profileData) => {
        const nextProfile = { ...(user?.profile || {}), ...profileData };
        const result = await updateProfile({ profile: nextProfile });

        if (result.success) {
            applyUserUpdate({ profile: nextProfile });
        }

        return result;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isInitialized,
                login,
                register,
                updateProfile,
                verifySMS,
                completeOnboarding,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
