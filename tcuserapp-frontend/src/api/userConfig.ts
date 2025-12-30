const userApiConfig = {
  serverBaseURL: "http://localhost:8080",
  api: {
    user: {
      findAllUsers: "/izn/register/findAllUser",
      saveUser: "/izn/register/saveUser",
      updateUser: "/izn/register/updateUser",
      deleteUser: (userId: number) => `/izn/register/deleteUser/${userId}`,
      SEARCH_USER: "/izn/register/getUser/search",
    },
    userRole: {
      findAllUserRoles: "/izn/register/findAllUserRole",
      saveUserRole: "/izn/register/saveUserRole",
      updateUserRole: "/izn/register/updateUserRole",
      deleteUserRole: (roleId: number) =>
        `/izn/register/deleteUserRole/${roleId}`,
    },
    myUserRequest: {
      MY_REQUESTS: (gid: string) => `/izn/getRequest/createdByMe/${gid}`,
      ALL_USER_REQUESTS: (gid: string) => `/izn/getRequest/createdForMe/${gid}`,
      OPENED_USER_REQUEST: (requestID: string) =>
        `/izn/all/getRequest/${requestID}`,
      CLOSED_USER_REQUESTS: (gid: string) =>
        `/izn/all/getRequest/closedUserRequest/${gid}`,
      CANCEL_USER_REQUESTS: "/izn/getRequest/cancelUserRequest",
      CHANGE_MANAGER: "/izn/getRequest/changeManager",
      GET_REQUEST_BY_ID: (requestID: number) => `/izn/getRequest/${requestID}`,
      GET_SEARCH_MANAGER: (gid: string) => `/izn/admin/api/scd/${gid}`,
    },

    login: {
      loginUser: "/doLogin",
    },
    logout: {
      logoutUser: "/logout",
    },
    getSsoResponse: {
      getResponse: "/api/user",
    },
  },
};

export default userApiConfig;
