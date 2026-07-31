import { api } from "./authService";

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  action: string;
  is_active: boolean;
  is_system: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  tenant_schema: string;
  is_active: boolean;
  is_system: boolean;
  priority: number;
  permissions_count: number;
  permissions?: PermissionItem[];
}

export const rbacService = {
  async getRoles() {
    const res = await api.get("/rbac/roles/");
    return res.data;
  },

  async getRole(id: string) {
    const res = await api.get(`/rbac/roles/${id}/`);
    return res.data;
  },

  async createRole(data: Partial<RoleItem>) {
    const res = await api.post("/rbac/roles/", data);
    return res.data;
  },

  async cloneRole(id: string, newName: string, newDescription?: string) {
    const res = await api.post(`/rbac/roles/${id}/clone/`, {
      new_name: newName,
      new_description: newDescription,
    });
    return res.data;
  },

  async disableRole(id: string) {
    const res = await api.post(`/rbac/roles/${id}/disable/`);
    return res.data;
  },

  async getPermissions() {
    const res = await api.get("/rbac/permissions/");
    return res.data;
  },

  async assignPermissionToRole(roleId: string, permissionId: string) {
    const res = await api.post(`/rbac/roles/${roleId}/assign-permission/`, {
      permission_id: permissionId,
    });
    return res.data;
  },

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const res = await api.post(`/rbac/roles/${roleId}/remove-permission/`, {
      permission_id: permissionId,
    });
    return res.data;
  },

  async assignRoleToUser(userId: string, roleId: string) {
    const res = await api.post(`/rbac/users/${userId}/roles/`, {
      role_id: roleId,
    });
    return res.data;
  },

  async removeRoleFromUser(userId: string, roleId: string) {
    const res = await api.delete(`/rbac/users/${userId}/roles/`, {
      data: { role_id: roleId },
    });
    return res.data;
  },

  async getPermissionMatrix() {
    const res = await api.get("/rbac/matrix/permissions/");
    return res.data;
  },

  async getRoleMatrix() {
    const res = await api.get("/rbac/matrix/roles/");
    return res.data;
  },
};
