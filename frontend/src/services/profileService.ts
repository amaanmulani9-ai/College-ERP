import { api } from "./authService";

export interface ProfileData {
  id: string;
  email: string;
  code: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  profile_photo: string | null;
  cover_photo: string | null;
  signature_image: string | null;
  gender: string;
  date_of_birth: string | null;
  blood_group: string;
  nationality: string;
  preferred_language: string;
  time_zone: string;
  biography: string;
  is_active: boolean;
  contact?: {
    primary_email: string;
    secondary_email: string;
    mobile_number: string;
    alternate_mobile: string;
    emergency_contact_name: string;
    emergency_contact_number: string;
  };
  addresses?: any[];
  preferences?: {
    theme: string;
    dark_mode: boolean;
    time_format: string;
    date_format: string;
    language: string;
  };
  completion?: {
    completion_percentage: number;
    is_complete: boolean;
    completed_count: number;
    total_fields: number;
    missing_fields: string[];
  };
}

export const profileService = {
  async getMyProfile() {
    const res = await api.get("/profiles/me/");
    return res.data;
  },

  async updateProfile(data: Partial<ProfileData>) {
    const res = await api.patch("/profiles/me/", data);
    return res.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/profiles/me/avatar/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async deleteAvatar() {
    const res = await api.delete("/profiles/me/avatar/");
    return res.data;
  },

  async getPreferences() {
    const res = await api.get("/profiles/me/preferences/");
    return res.data;
  },

  async updatePreferences(data: Record<string, any>) {
    const res = await api.patch("/profiles/me/preferences/", data);
    return res.data;
  },

  async getTimeline() {
    const res = await api.get("/profiles/me/timeline/");
    return res.data;
  },

  async getCompletion() {
    const res = await api.get("/profiles/me/completion/");
    return res.data;
  },

  async searchProfiles(query: string) {
    const res = await api.get(`/profiles/search/?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
