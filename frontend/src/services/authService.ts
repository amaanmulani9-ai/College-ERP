import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(data: Record<string, any>) {
    const res = await api.post("/auth/register/", data);
    if (res.data.tokens?.access) {
      localStorage.setItem("accessToken", res.data.tokens.access);
      localStorage.setItem("refreshToken", res.data.tokens.refresh);
    }
    return res.data;
  },

  async login(data: Record<string, any>) {
    const res = await api.post("/auth/login/", data);
    if (res.data.tokens?.access) {
      localStorage.setItem("accessToken", res.data.tokens.access);
      localStorage.setItem("refreshToken", res.data.tokens.refresh);
    }
    return res.data;
  },

  async logout() {
    const refresh = localStorage.getItem("refreshToken");
    try {
      await api.post("/auth/logout/", { refresh });
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  async getProfile() {
    const res = await api.get("/auth/profile/");
    return res.data;
  },

  async updateProfile(data: Record<string, any>) {
    const res = await api.patch("/auth/profile/", data);
    return res.data;
  },

  async changePassword(data: Record<string, any>) {
    const res = await api.post("/auth/change-password/", data);
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post("/auth/forgot-password/", { email });
    return res.data;
  },

  async resetPassword(data: Record<string, any>) {
    const res = await api.post("/auth/reset-password/", data);
    return res.data;
  },

  async verifyEmail(token: string) {
    const res = await api.post("/auth/verify-email/", { token });
    return res.data;
  },
};
