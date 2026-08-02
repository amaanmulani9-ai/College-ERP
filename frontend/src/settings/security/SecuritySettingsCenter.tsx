import React, { useState } from "react";
import { UserManagementPage } from "./UserManagementPage";
import { RoleManagementPage } from "./RoleManagementPage";
import { PermissionManagementPage } from "./PermissionManagementPage";
import { RBACMatrixPage } from "./RBACMatrixPage";
import { AuthenticationSettingsPage } from "./AuthenticationSettingsPage";
import { PasswordPolicyPage } from "./PasswordPolicyPage";
import { SessionPolicyPage } from "./SessionPolicyPage";
import { MFASettingsPage } from "./MFASettingsPage";
import { LoginSecurityPage } from "./LoginSecurityPage";
import { APIKeysPage } from "./APIKeysPage";
import { IPWhitelistPage } from "./IPWhitelistPage";
import { SecurityAuditPage } from "./SecurityAuditPage";
import { DeviceManagementPage } from "./DeviceManagementPage";

export const SecuritySettingsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "users"
    | "roles"
    | "permissions"
    | "matrix"
    | "auth"
    | "password"
    | "session"
    | "mfa"
    | "login"
    | "api-keys"
    | "ip-whitelist"
    | "audit"
    | "devices"
  >("users");

  const tabs = [
    { id: "users", label: "User Provisioning" },
    { id: "roles", label: "Roles & RBAC" },
    { id: "permissions", label: "Permissions Library" },
    { id: "matrix", label: "RBAC Matrix" },
    { id: "auth", label: "Authentication & SSO" },
    { id: "password", label: "Password Policy" },
    { id: "session", label: "Session Limits" },
    { id: "mfa", label: "MFA & 2FA" },
    { id: "login", label: "Lockout Rules" },
    { id: "api-keys", label: "API Keys" },
    { id: "ip-whitelist", label: "IP Whitelist" },
    { id: "audit", label: "Audit Logs" },
    { id: "devices", label: "Active Devices" },
  ];

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl font-semibold overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "bg-indigo-600 text-white font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic Sub-Page View */}
      {activeTab === "users" && <UserManagementPage />}
      {activeTab === "roles" && <RoleManagementPage />}
      {activeTab === "permissions" && <PermissionManagementPage />}
      {activeTab === "matrix" && <RBACMatrixPage />}
      {activeTab === "auth" && <AuthenticationSettingsPage />}
      {activeTab === "password" && <PasswordPolicyPage />}
      {activeTab === "session" && <SessionPolicyPage />}
      {activeTab === "mfa" && <MFASettingsPage />}
      {activeTab === "login" && <LoginSecurityPage />}
      {activeTab === "api-keys" && <APIKeysPage />}
      {activeTab === "ip-whitelist" && <IPWhitelistPage />}
      {activeTab === "audit" && <SecurityAuditPage />}
      {activeTab === "devices" && <DeviceManagementPage />}
    </div>
  );
};

export default SecuritySettingsCenter;
