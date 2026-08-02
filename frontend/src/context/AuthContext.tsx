import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, tokenStorage } from "../services/authService";

export interface UserProfile {
  id: number | string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  tenant?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  tenant: string | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email?: string; password?: string; rememberMe?: boolean }) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getProfile: () => Promise<UserProfile | null>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  getRoleRedirectPath: (role?: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getRoleRedirectPath = (role?: string): string => {
  const normalized = (role || "").toLowerCase();
  if (normalized.includes("super admin")) return "/dashboard";
  if (normalized.includes("college admin") || normalized.includes("admin")) return "/dashboard";
  if (normalized.includes("principal")) return "/dashboard";
  if (normalized.includes("hod")) return "/dashboard";
  if (normalized.includes("teacher") || normalized.includes("faculty")) return "/dashboard";
  if (normalized.includes("student")) return "/dashboard";
  if (normalized.includes("parent")) return "/dashboard";
  if (normalized.includes("accountant") || normalized.includes("finance")) return "/dashboard";
  if (normalized.includes("librarian") || normalized.includes("library")) return "/library";
  if (normalized.includes("warden") || normalized.includes("hostel")) return "/hostel";
  if (normalized.includes("placement")) return "/dashboard";
  if (normalized.includes("staff")) return "/dashboard";
  return "/dashboard";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const roles = user?.roles || (user?.role ? [user.role] : []);
  const permissions = user?.permissions || [];
  const tenant = user?.tenant || null;
  const isAuthenticated = !!user && !!tokenStorage.getAccessToken();

  // Restore Session on Mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          tokenStorage.clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for unauthorized events dispatched by axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials: { email?: string; password?: string; rememberMe?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      let profile: UserProfile;
      if (res.user) {
        profile = res.user;
      } else {
        profile = await authService.getProfile();
      }
      setUser(profile);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    await authService.refreshToken();
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const getProfile = async () => {
    const profile = await authService.getProfile();
    setUser(profile);
    return profile;
  };

  const hasRole = (roleReq: string | string[]) => {
    if (!user) return false;
    const required = Array.isArray(roleReq) ? roleReq : [roleReq];
    return required.some((r) => roles.map((x) => x.toLowerCase()).includes(r.toLowerCase()));
  };

  const hasPermission = (permissionReq: string) => {
    if (!user) return false;
    if (permissions.includes("all_permissions")) return true;
    return permissions.includes(permissionReq);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        roles,
        permissions,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
        getProfile,
        hasRole,
        hasPermission,
        getRoleRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
