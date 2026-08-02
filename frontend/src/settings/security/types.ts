export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "Deactivated" | "Locked";
  lastLogin: string;
}

export interface SecurityRoleItem {
  id: string;
  name: string;
  type: "System" | "Custom";
  colorBadge: string;
  assignedUsersCount: number;
  description: string;
}

export interface PermissionDefinition {
  id: string;
  module: string;
  action: "Create" | "Read" | "Update" | "Delete" | "Approve" | "Export" | "Analytics" | "AI";
  code: string;
}

export interface APIKeyItem {
  id: string;
  name: string;
  prefix: string;
  type: "Personal" | "System";
  scopes: string[];
  expiresAt: string;
}

export interface IPWhitelistItem {
  id: string;
  ipAddress: string;
  type: "Allowed" | "Blocked";
  description: string;
  addedAt: string;
}

export interface SecurityAuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  status: "Success" | "Failed" | "Warning";
}

export interface ActiveDeviceItem {
  id: string;
  deviceType: string;
  browser: string;
  platform: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}
