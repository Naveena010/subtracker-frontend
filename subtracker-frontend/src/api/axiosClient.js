import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token to every outgoing request, if present
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('subtracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so every screen can read err.message / err.fieldErrors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const normalized = new Error(data?.message || 'Something went wrong. Please try again.');
    // Validation errors come back as a flat { field: "message" } map, no "message" key
    normalized.fieldErrors = data && !data.message ? data : null;
    normalized.status = error.response?.status;

    if (normalized.status === 401) {
      localStorage.removeItem('subtracker_token');
      localStorage.removeItem('subtracker_role');
    }

    return Promise.reject(normalized);
  }
);

export default axiosClient;
