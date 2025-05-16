import axios from "axios";
import webSocketService from "./websocket.service";

// Create axios instance
const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// Key for storing token in localStorage
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
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // Handle successful WebSocket connection after login
        if (
            response.config.url.includes("/auth/login") ||
            response.config.url.includes("/auth/refresh")
        ) {
            const token = response.data?.token || response.data?.access_token;
            if (token) {
                // Store token if it exists in response
                localStorage.setItem(TOKEN_KEY, token);

                // Connect WebSocket after successful authentication
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
                }, 500); // Small delay to ensure token is stored
            }
        }
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        // Log error details in development
        if (process.env.NODE_ENV === "development") {
            console.error("API Error:", {
                config: error.config,
                response: error.response,
                message: error.message,
            });
        }

        // Handle 401 Unauthorized (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Attempt token refresh if this wasn't a refresh request
            if (!originalRequest.url.includes("/auth/refresh")) {
                return axiosClient
                    .post("/auth/refresh", {}, { skipAuthRefresh: true }) // Custom flag to prevent infinite loop
                    .then((response) => {
                        const newToken = response.data.token;
                        if (newToken) {
                            localStorage.setItem(TOKEN_KEY, newToken);
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;

                            // Reconnect WebSocket with new token
                            webSocketService.disconnect();
                            webSocketService.connect();

                            return axiosClient(originalRequest);
                        }
                        throw new Error("No token in refresh response");
                    })
                    .catch((refreshError) => {
                        // Refresh failed - logout user
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

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error("403 Forbidden - Access denied");
            // Optionally redirect to unauthorized page
            // window.location.href = "/unauthorized";
        }

        // Handle network errors
        if (!error.response) {
            console.error("Network Error:", error.message);
            // Optionally show network error notification
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