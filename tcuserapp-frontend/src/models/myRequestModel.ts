export interface myRequestResponse {
  gid: string | undefined;
  commentsForApprover?: string | undefined;
  tcOSUserName: string | undefined;
  userRequest_TypeOfRequest: string | undefined;
  requestStatus: string | undefined;
  ipClearance: string | undefined;
  neverLock: boolean;
  tcAccountType: string | undefined;
  userRequestSelf: {
    gid: string | undefined;
  };
  costManagerSelf: {
    gid: string | undefined;
  };
  assignedRoles: [
    {
      roleName: string | undefined;
      isAssigned: boolean;
      groupNamePath: string | undefined;
      groupName: string | undefined;
      systemName: string | undefined;
      assignedRole_Status: string | undefined;
      isDeleted: boolean;
    },
  ];
  userHistory: {
    gID: string | undefined;
    tcUserId: string | undefined;
    systemName: string | undefined;
    requestStatus: string | undefined;
    userStatus: string | undefined;
    neverLock: boolean;
    tcCreated: boolean;
    tcAccountType: string | undefined;
  };
  country: {
    countryId: number;
  };
  service: {
    serviceId: number;
  };
  system: {
    systemId: number;
  };
  volume: {
    volumeId: number;
  };
  user: {
    userId: number;
  };
}
