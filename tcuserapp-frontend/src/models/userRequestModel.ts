export interface AssignedRole {
  roleName: string;
  isAssigned: boolean;
  groupNamePath: string;
  groupName: string;
  systemName: string;
  assignedRole_Status: string;
  isDeleted: boolean;
}

export interface UserHistory {
  gID: string;
  tcUserId: string;
  systemName: string;
  requestStatus: string;
  userStatus: string;
  neverLock: boolean;
  tcCreated: boolean;
  tcAccountType: string;
}

export interface Country {
  countryId: number;
}

export interface Service {
  serviceId: number;
}

export interface System {
  systemId: number;
}

export interface Volume {
  volumeId: number;
}

export interface User {
  userId: number;
}

export interface UserRequest {
  commentsForApprover: string;
  tcOSUserName: string;
  userRequest_TypeOfRequest: string;
  requestStatus: string;
  ipClearance: string;
  neverLock: boolean;
  tcAccountType: string;
  userRequestSelf: {
    gid: string;
  };
  costManagerSelf: {
    gid: string;
  };
  assignedRoles: AssignedRole[];
  userHistory: UserHistory;
  country: Country;
  service: Service;
  system: System;
  volume: Volume;
  user: User;
}
