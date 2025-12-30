export interface User {
  scdUserId: number;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  lineManager: string | null;
  sponsor: string;
  department: string;
  organization: string;
  organizationID: string | null;
  country: string;
  mobileNumber: string;
  userRequestSelfList: any | null;
  userRequestForAnotherList: any | null;
  costManagerSelfList: any | null;
  costManagerForAnotherList: any | null;
  gid: string;
}

export interface HistoryLog {
  historyId: number;
  creationDate: string;
  comments: string;
  historyLogActionMode: string;
  userRequest: any | null;
}

export interface AssignedRole {
  assignedRoleId: number;
  roleName: string;
  isAssigned: boolean;
  groupNamePath: string;
  groupName: string;
  systemName: string;
  assignedRole_Status: string;
  userRequest: any | null;
  deleted: boolean;
}

export interface Country {
  countryId: number;
  countryCode: string;
  countryName: string;
  userRequests: any | null;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  systems: any | null;
  userRequests: any | null;
}

export interface System {
  systemId: number;
  systemName: string;
  service: Service | null;
  groups: any | null;
  volumes: any | null;
  roles: any | null;
  userRequests: any | null;
}

export interface Volume {
  volumeId: number;
  volumeName: string;
  system: System | null;
  userRequests: any | null;
}

export interface UserHistory {
  userHistoryId: number;
  tcUserId: string;
  systemName: string;
  requestStatus: string;
  userStatus: string;
  neverLock: boolean;
  tcCreated: boolean;
  tcAccountType: string;
  userRequests: any | null;
  gid: string | null;
}

export interface Request {
  requestId: number;
  commentsForApprover: string;
  cancellationComment: string;
  reasonForCancellation: string;
  tcOSUserName: string;
  groupRoleApproverComments: string | null;
  costApproverComments: string | null;
  costApproverDate: string | null;
  groupRoleApproverDate: string | null;
  creationDate: string | null;
  userRequest_TypeOfRequest: string;
  accountDeactivate: string | null;
  requestStatus: string;
  ipClearance: string;
  tcAccountType: string;
  neverLock: boolean;
  assignedRoles: AssignedRole[];
  historyLogList: HistoryLog[];
  userRequestSelf: User;
  userRequestForAnother: User | null;
  costManagerSelf: User;
  costManagerForAnother: User | null;
  userHistory: UserHistory;
  country: Country;
  service: Service;
  system: System;
  volume: Volume;
  createdBy: User;
}

export interface MyRequest {
  openRequests: Request[];
  closeRequests: Request[];
}

export interface AllUserRequests {
  myRequests: MyRequest;
}
