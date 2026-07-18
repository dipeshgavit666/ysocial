import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export { apiClient };
