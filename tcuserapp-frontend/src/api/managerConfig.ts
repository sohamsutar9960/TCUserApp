const managerApiConfig = {
  serverBaseURL: "http://localhost:8080",
  api: {
    manager: {
      GET_MANAGER_ALL_REQUESTS: (gid: string) =>
        `/izn/manager/allRequest/${gid}`,
      GET_REQUEST_DETAILS_VIEW_BY_ID: (requestID: number) =>
        `/izn/getRequest/${requestID}`,
      DELETE_ASSIGNED_ROLE: (assignedRoleId: number) =>
        `/izn/manager/delete/${assignedRoleId}`,
      APPROVE_REQUEST: "/izn/manager/approved",
      REJECT_REQUEST: "/izn/manager/rejected",
    },
  },
};

export default managerApiConfig;
