// apiConfig.ts

const adminApiConfig = {
  serverBaseURL: "http://localhost:8080",
  api: {
    service: {
      findAllService: "/izn/admin/service/findAllService",
      saveService: "/izn/admin/service/saveService",
      updateService: "/izn/admin/service/updateService",
      deleteService: (id: number) => `/izn/admin/service/deleteService/${id}`,
      findServiceByID: (serviceId: number) =>
        `/izn/admin/system/getSystem/service/${serviceId}`,
    },
    system: {
      findAllSystem: "/izn/admin/system/findAllSystem",
      saveSystem: "/izn/admin/system/saveSystem",
      updateSystem: "/izn/admin/system/updateSystem",
      deleteSystem: (id: number) => `/izn/admin/system/deleteSystem/${id}`,
      findSystemByID: (systemId: number) =>
        `/izn/admin/system/getSystem/service/${systemId}`,
    },
    volume: {
      findAllVolumes: "/izn/admin/volume/findAllVolume",
      saveVolume: "/izn/admin/volume/saveVolume",
      updateVolume: "/izn/admin/volume/updateVolume",
      deleteVolume: (id: number) => `/izn/admin/volume/deleteVolume/${id}`,
      findVolumeById: (systemId: number) =>
        `/izn/admin/volume/getVolume/system/${systemId}`,
    },
    group: {
      findAllGroups: "/izn/admin/group/findAllGroup",
      saveGroup: "/izn/admin/group/saveGroup",
      updateGroup: "/izn/admin/group/updateGroup",
      SEARCH_GROUP: "/izn/admin/group/getGroup/search",
      deleteGroup: (id: number) => `/izn/admin/group/deleteGroup/${id}`,
      findAllGroupsBySystemID: (systemId: number) =>
        `/izn/admin/group/getGroup/system/${systemId}`,
      IMPORT_GROUP: (groupName: string, systemId: number) =>
        `/itk/allGroup/${groupName}/${systemId}`,
      findAllSelectedGroupsByTcUserIdID: (systemId: number, tcUserId: string) =>
        `/itk/getUserGroupAndRole/${systemId}/${tcUserId}/false`,
      getTemplateUser: (systemId: number, tcUserId: string) =>
        `/itk/getUserGroupAndRole/${systemId}/${tcUserId}/true`,
    },
    role: {
      findAllRoles: "/izn/admin/role/findAllRole",
      saveRole: "/izn/admin/role/saveRole",
      updateRole: "/izn/admin/role/updateRole",
      deleteRole: (id: number) => `/izn/admin/role/deleteRole/${id}`,
      SEARCH_ROLE: "/izn/admin/role/getRole/search",
    },
    tcConfig: {
      findAllTcConfig: "/izn/admin/tcConfig/findAllTCConfig",
      saveTCConfig: "/izn/admin/tcConfig/saveTCConfig",
      updateTCConfig: "/izn/admin/tcConfig/updateTCConfig",
      deleteTCConfig: (id: number) =>
        `/izn/admin/tcConfig/deleteTCConfig/${id}`,
    },
    country: {
      findAllCountries: "/izn/admin/country/findAllCountry",
      saveCountry: "/izn/admin/country/saveCountry",
      updateCountry: "/izn/admin/country/updateCountry",
      deleteCountry: (id: number) => `/izn/admin/country/deleteCountry/${id}`,
      searchCountry: "/izn/admin/country/getCountry/search",
      IMPORT_COUNTRY: "/izn/admin/country/getCountry/import",
    },
    useSelection: {
      GET_USER_HISTORY: (userSelectId: string) =>
        `/izn/admin/userHistory/getUserHistory/user/${userSelectId}`,
      FIND_ALL_GROUPS: "/izn/admin/group/findAllGroup",
      GET_ROLES_BY_GROUP: "/izn/admin/role/getRole/group/",
      GET_USER_H_S: (gid: string, systemName: string) =>
        `/izn/admin/userHistory/getUserHistory/user/${gid}/${systemName}`,
    },
    scdUser: {
      findAllScdUsers: "/izn/admin/scdUser/findAllSCDUser",
      getOneScdUser: (gid: string) => `/izn/admin/scdUser/getSCDUser/${gid}`,
      saveScdUser: "/izn/admin/scdUser/saveSCDUser",
      updateScdUser: "/izn/admin/scdUser/updateSCDUser",
      deleteScdUser: (id: number) => `/izn/admin/scdUser/deleteSCDUser/${id}`,
      GET_SCD_USERS_BY_ID: (gid: string) => `/izn/admin/api/scd/${gid}`,
      SEARCH_SCD_USER: "/izn/admin/scdUser/getSCDUser/search",
    },
    groupRoleApprover: {
      FIND_ALL_GROUPROLE_APPROVERS:
        "/izn/admin/groupApprover/findAllGroupRoleApprover",
      GET_SINGLE_GROUPROLE_APPROVER: (gid: string) =>
        `/izn/admin/groupApprover/getGroupRoleApprover/${gid}`,
      SAVE_GROUPROLE_APPROVER: "/izn/admin/groupApprover/saveGroupRoleApprover",
      UPDATE_GROUPROLE_APPROVER:
        "/izn/admin/groupApprover/updateGroupRoleApprover",
      UPDATE_ACTIVATE_DEACTIVATE_ROUPROLE_APPROVER:
        "/izn/admin/groupApprover/updateIsActive",
      SEARCH_GROUPROLE_APPROVER:
        "/izn/admin/groupApprover/getGroupRoleApprover/search",
    },
    tcUser: {
      FIND_ALL_TCUSER: "/izn/admin/userHistory/findAllUserHistory",
      SAVE_TC_USER: "/izn/admin/userHistory/saveUserHistory",
      UPDATE_TC_USER: "/izn/admin/userHistory/updateUserHistory",
      DELETE_TC_USER: (id: number) =>
        `/izn/admin/userHistory/deleteUserHistory/${id}`,
      GET_TC_USER: (systemId: number) => `/itk/tcUser/create/${systemId}`,
      SEARCH_TC_USER_HISTORY: "izn/admin/userHistory/getUserHistory/search",
    },
    applyAccount: {
      SAVE_USER_REQUEST: "/izn/admin/userRequest/saveUserRequest",
    },
    userRequest: {
      FIND_ALL_USER_REQUEST: "/izn/admin/userRequest/findAllUserRequest",
      GET_USER_REQUEST_BY_ID: (requestID: number) =>
        `/izn/getRequest/${requestID}`,
      USER_REQUEST_SEARCH: "izn/admin/userRequest/search",
    },
    createRequest: {
      CREATE_REQUEST_USER: "/izn/admin/userRequest/saveUserRequest",
    },
    TcUserInventoryService: {
      GET_DATA_BY_SYSTEMID: (systemId: number) => `/itk/tcUser/${systemId}`,
      CHANGE_USER_INEVENTORY_USER: (
        systemId: number,
        UserId: string,
        status: number
      ) => `/itk/tcUser/${UserId}/${systemId}/${status}`,
    },
  },
};

export default adminApiConfig;
