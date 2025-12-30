export interface User {
  scdUserId?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  lineManager?: string;
  sponsor?: string;
  department?: string;
  organization?: string | null;
  organizationID?: string;
  country?: string;
  mobileNumber?: string;
  userRequestSelfList?: any | null;
  userRequestForAnotherList?: any | null;
  costManagerSelfList?: any | null;
  costManagerForAnotherList?: any | null;
  gid?: string;
}

export interface AssignedRole {
  assignedRoleId?: number | undefined;
  roleName?: string;
  isAssigned?: boolean;
  groupNamePath?: string;
  groupName?: string;
  systemName?: string;
  assignedRole_Status?: string;
  userRequest?: any | null;
  deleted?: boolean;
}

export interface HistoryLog {
  historyId?: number;
  creationDate?: string;
  comments?: string;
  historyLogActionMode?: string;
  userRequest?: any | null;
}

export interface CommonRequest {
  requestId?: number | null;
  defaultGroup?: string;
  commentsForApprover?: string;
  cancellationComment?: string | null;
  reasonForCancellation?: string | null;
  tcOSUserName?: string;
  groupRoleApproverComments?: string | null;
  costApproverComments?: string | null;
  costApproverDate?: string | null;
  groupRoleApproverDate?: string | null;
  creationDate?: string | null;
  userRequest_TypeOfRequest?: string;
  accountDeactivate?: string | null;
  requestStatus?: string;
  ipClearance?: string;
  tcAccountType?: string;
  neverLock?: boolean;
  assignedRoles?: AssignedRole[];
  historyLogList?: HistoryLog[];
  userRequestSelf?: User;
  userRequestForAnother?: User;
  costManagerSelf?: User;
  costManagerForAnother?: any | null;
  userHistory?: {
    userHistoryId?: number;
    tcUserId?: string;
    systemName?: string;
    requestStatus?: string;
    userStatus?: string;
    neverLock?: boolean;
    tcCreated?: boolean;
    tcAccountType?: string;
    userRequests?: any | null;
    gid?: string | null;
  };
  country?: {
    countryId?: number;
    countryCode?: string;
    countryName?: string;
    userRequests?: any | null;
  };
  service?: {
    serviceId?: number;
    serviceName?: string;
    systems?: any | null;
    userRequests?: any | null;
  };
  system?: {
    systemId?: number;
    systemName?: string;
    service?: any | null;
    groups?: any | null;
    volumes?: any | null;
    roles?: any | null;
    tcConfiguration?: any | null;
    userRequests?: any | null;
  };
  volume?: {
    volumeId?: number;
    volumeName?: string;
    system?: any | null;
    userRequests?: any | null;
  };
  createdBy?: User;
}

export interface UserRequestResponse {
  openRequests?: CommonRequest[];
  approvedRequests?: CommonRequest[];
  rejectedRequests?: CommonRequest[];
  exportedRequests?: CommonRequest[];
}
