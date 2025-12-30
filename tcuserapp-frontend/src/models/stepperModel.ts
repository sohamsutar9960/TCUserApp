export interface Service {
  serviceId: number;
}

export interface System {
  systemId: number;
  systemName: string;
}

export interface UserRequestSelf {
  DisplayName: any;
  gid: any;
}

export interface UserRequestForAnother {
  DisplayName: any;
  gid: any;
}

export interface UserHistory {
  userHistoryId?: any;
  neverLock: boolean;
  tcAccountType: string;
  tcUserId?: string;
  systemName?: string;
  requestStatus?: string;
  userStatus?: string;
  tcCreated?: boolean;
  gid: string;
}

export interface costManagerSelf {
  DisplayName: any;
  gid: any;
}

export interface costManagerForAnother {
  DisplayName: any;
  gid: any;
}

export interface AssignedRole {
  roleName: string;
  isAssigned: boolean;
  groupNamePath: string;
  groupName: string;
  systemName: string;
  assignedRole_Status: string;
  deleted: boolean;
}

export interface Volume {
  volumeName: string;
  volumeId: number;
}

export interface Country {
  countryId: number;
  countryCode: string;
}

export interface RequestObject {
  service: Service;
  system: System;
  userRequestSelf: any;
  userRequestForAnother: any;
  commentsForApprover: string;
  userRequest_TypeOfRequest:
    | "New_User_Account"
    | "Change_Existing_Account"
    | "BU_Admin";
  userHistory: UserHistory;
  accountDeactivate: "DeactivateAccount" | null;
  costManagerSelf: any;
  costManagerForAnother: any;
  assignedRoles: AssignedRole[];
  volume: Volume;
  country: Country;
  defaultGroup: string;
  ipClearance: string;
  tcOSUserName: string;
  neverLock: boolean;
  requestLicensingLevel: "Author" | "Occasional_Author";
}
