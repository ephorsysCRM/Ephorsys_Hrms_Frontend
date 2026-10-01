import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5506/api/v1",

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

// =====================================================
// ACCESS TOKEN
// =====================================================

let accessToken = null;

// =====================================================
// SET ACCESS TOKEN
// =====================================================

export const setAccessToken = (token) => {
    accessToken = token;
};

// =====================================================
// CLEAR ACCESS TOKEN
// =====================================================

export const clearAccessToken = () => {
    accessToken = null;
};

// =====================================================
// GET ACCESS TOKEN
// =====================================================

export const getAccessToken = () => {
    return accessToken;
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;