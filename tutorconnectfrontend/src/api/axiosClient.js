// In your axiosClient.js - Ensure consistent token usage

import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// IMPORTANT: Check your login component to make sure you're storing the token with this key
const TOKEN_KEY = "authToken";

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Token added to request:", `Bearer ${token.substring(0, 10)}...`);
        } else {
            console.warn("No token found in localStorage with key:", TOKEN_KEY);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error Response:", error.response);

        if (error.response?.status === 403) {
            console.error("403 Forbidden - Access denied");
            // Optionally redirect to login if needed
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;