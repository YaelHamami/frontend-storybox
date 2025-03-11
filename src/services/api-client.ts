import axios, { CanceledError } from "axios";

export { CanceledError }

const baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
    baseURL: baseURL,
});

// Attach token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                localStorage.setItem("accessToken", newAccessToken);
                apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login"; // Redirect to login
            }
        }

        return Promise.reject(error);
    }
);

// Function to refresh the access token
const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await axios.post(baseURL + "/auth/refresh", {
        refreshToken,
    });

    return response.data.accessToken;
};

export default apiClient;
