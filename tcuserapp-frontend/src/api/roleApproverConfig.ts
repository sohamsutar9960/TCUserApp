const roleApproverApiConfig = {
  serverBaseURL: "http://localhost:8080",
  api: {
    roleApprover: {
      GET_ROLEAPPROVER_ALL_REQUESTS: `/izn/roleApprover/allRequest`,
      GET_REQUEST_DETAILS_VIEW_BY_ID: (requestID: number) =>
        `/izn/getRequest/${requestID}`,
      DELETE_ASSIGNED_ROLE: (assignedRoleId: number) =>
        `/izn/roleApprover/delete/${assignedRoleId}`,
      APPROVE_REQUEST: "/izn/roleApprover/approved",
      REJECT_REQUEST: "/izn/roleApprover/rejected",
      SEARCH_ROLES: (roleName: string) =>
        `/izn/roleApprover/search/${roleName}`,
      ADD_ASSIGNED_ROLES: (requestID: number) =>
        `/izn/roleApprover/assign/${requestID}`,
    },
  },
};

export default roleApproverApiConfig;
