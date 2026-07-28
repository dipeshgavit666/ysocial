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

function get<T>(url: string) {
  return apiClient.get(url) as unknown as Promise<T>;
}

function post<T>(url: string, body?: unknown) {
  return apiClient.post(url, body) as unknown as Promise<T>;
}

function patch<T>(url: string, body?: string) {
  return apiClient.patch(url, body) as unknown as Promise<T>;
}

export { get, post, patch };
