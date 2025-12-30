export interface Group {
  groupId?: number;
  groupName?: string | undefined;
  uid?: string | undefined;
  isRoot?: boolean;
  description?: string | undefined;
  displayName?: string | undefined;
  system?: {
    systemId: number;
  };
  parentGroup?: {
    groupId: number | undefined;
  };
  groupNamePath?: any;
  level?: any;
}

export default Group;

export interface GroupResponse {
  description: string | undefined;
  displayName: string | undefined;
  groupId: number;
  groupName: string | undefined;
  parentGroupName?: string | undefined;
  root: boolean;
  systemId: number;
  systemName: string | undefined;
  uid: string | undefined;
  id: string;
  name: string;
  subGroups?: SubGroup[];
  roles?: Role[];
  parentGroupId?: number;
  parentGroup?: {
    groupId: number;
  };
  system?: {
    systemId: number;
  };
  roleResponses?: any;
  groupNamePath?: any;
  level?: any;
}
interface Role {
  id: string;
  name: string;
}

interface SubGroup {
  id: string;
  name: string;
  roles: Role[];
}

export interface RoleResponse {
  roleId?: number;
  roleName?: string;
  groupId?: number;
  groupName?: string;
  systemId?: number;
  systemName?: string;
  uid?: string;
  description?: string;
  displayName?: string;
  status?: string;
  assigned?: boolean;
}
