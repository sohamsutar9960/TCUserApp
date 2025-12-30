interface Role {
  roleId?: number;
  roleName?: string | undefined;
  uid?: string | undefined;
  description?: string | undefined;
  displayName?: string | undefined;
  isAssigned?: boolean;
  status?: string | undefined;
  group?: {
    groupId?: number | undefined;
    groupName?: string | undefined;
  };
  system?: {
    systemId?: number | undefined;
    systemName?: string | undefined;
  };
}

export default Role;

export interface RoleResponse {
  roleId?: number;
  roleName?: string | undefined;
  groupId?: number;
  systemName?: string;
  systemId?: number;
  groupName?: string | undefined;
  uid?: string | undefined;
  description?: string | undefined;
  displayName?: string | undefined;
  status?: string | undefined;
  assigned?: boolean | undefined;
}
interface Role {
  roleName?: string;
  groupName?: string;
  systemName?: string;
}
