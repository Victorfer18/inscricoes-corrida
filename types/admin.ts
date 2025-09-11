export interface AdminUser {
  id: string;
  email: string;
  nome: string;
  role: 'super_admin' | 'admin' | 'moderator';
  created_at?: string;
  updated_at?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminPermissions {
  can_edit_inscricoes: boolean;
  can_delete_inscricoes: boolean;
  can_export_data: boolean;
  can_manage_users: boolean;
  can_manage_lotes: boolean;
}

export const ROLE_PERMISSIONS: Record<AdminUser['role'], AdminPermissions> = {
  super_admin: {
    can_edit_inscricoes: true,
    can_delete_inscricoes: true,
    can_export_data: true,
    can_manage_users: true,
    can_manage_lotes: true,
  },
  admin: {
    can_edit_inscricoes: true,
    can_delete_inscricoes: false,
    can_export_data: true,
    can_manage_users: false,
    can_manage_lotes: true,
  },
  moderator: {
    can_edit_inscricoes: true,
    can_delete_inscricoes: false,
    can_export_data: false,
    can_manage_users: false,
    can_manage_lotes: false,
  },
};
