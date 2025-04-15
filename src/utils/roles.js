export const ROLES = {
  ADMIN: 'administrador',
  SUPERVISOR: 'supervisor',
  OPERATOR: 'operario'
};

export const PERMISSIONS = {
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_REPORTS: 'view_reports',
  MANAGE_CAMERAS: 'manage_cameras',
  VIEW_CAMERAS: 'view_cameras',
  // Agrega más permisos según necesites
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_CAMERAS,
    PERMISSIONS.VIEW_CAMERAS,
  ],
  [ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_CAMERAS,
    PERMISSIONS.VIEW_CAMERAS,
  ],
  [ROLES.OPERATOR]: [
    PERMISSIONS.VIEW_CAMERAS,
  ],
};