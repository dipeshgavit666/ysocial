import axios from "axios";

const apiCliet = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiCliet.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export { apiCliet };
