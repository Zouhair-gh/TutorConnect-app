import axios from "axios";
import webSocketService from "./websocket.service";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

const TOKEN_KEY = "authToken";

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            if (process.env.NODE_ENV === "development") {
                console.log("Token added to request:", `Bearer ${token.substring(0, 10)}...`);
            }
        } else {
            console.warn("No token found in localStorage with key:", TOKEN_KEY);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        if (
            response.config.url.includes("/auth/login") ||
            response.config.url.includes("/auth/refresh")
        ) {
            const token = response.data?.token || response.data?.access_token;
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);

                setTimeout(() => {
                    webSocketService.connect(
                        () => {
                            if (process.env.NODE_ENV === "development") {
                                console.log("WebSocket connected successfully");
                            }
                        },
                        (error) => {
                            console.error("WebSocket connection error:", error);
                        }
                    );
                }, 500);
            }
        }
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        if (process.env.NODE_ENV === "development") {
            console.error("API Error:", {
                config: error.config,
                response: error.response,
                message: error.message,
            });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!originalRequest.url.includes("/auth/refresh")) {
                return axiosClient
                    .post("/auth/refresh", {}, { skipAuthRefresh: true })
                    .then((response) => {
                        const newToken = response.data.token;
                        if (newToken) {
                            localStorage.setItem(TOKEN_KEY, newToken);
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;

                            webSocketService.disconnect();
                            webSocketService.connect();

                            return axiosClient(originalRequest);
                        }
                        throw new Error("No token in refresh response");
                    })
                    .catch((refreshError) => {
                        console.error("Token refresh failed:", refreshError);
                        localStorage.removeItem(TOKEN_KEY);
                        webSocketService.disconnect();

                        if (window.location.pathname !== "/login") {
                            window.location.href = "/login";
                        }
                        return Promise.reject(refreshError);
                    });
            }
        }

        if (error.response?.status === 403) {
            console.error("403 Forbidden - Access denied");
        }

        if (!error.response) {
            console.error("Network Error:", error.message);
        }

        return Promise.reject(error);
    }
);

// Add a custom method for file uploads
axiosClient.upload = (url, formData, config = {}) => {
    return axiosClient.post(url, formData, {
        ...config,
        headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
        },
    });
};

// Add a custom method for downloads
axiosClient.download = (url, config = {}) => {
    return axiosClient.get(url, {
        ...config,
        responseType: "blob",
    });
};

export default axiosClient;
