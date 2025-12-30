import { API, managerEndpoints } from "../api";
import { CommonRequest } from "../models/ManagerAndGroupRoleApproverModel";

class TcManager {
  static getManagerAllRequests(gid: string) {
    return API.get(managerEndpoints.api.manager.GET_MANAGER_ALL_REQUESTS(gid));
  }
  static getRequestDetailsView(requestID: number) {
    return API.get(
      managerEndpoints.api.manager.GET_REQUEST_DETAILS_VIEW_BY_ID(requestID),
    );
  }
  static deleteAssignedRoleByManager(assignedRoleId: number) {
    return API.get(
      managerEndpoints.api.manager.DELETE_ASSIGNED_ROLE(assignedRoleId),
    );
  }
  static approveRequestByManager(request: CommonRequest) {
    return API.patch(managerEndpoints.api.manager.APPROVE_REQUEST, request);
  }
  static rejectRequestByManager(request: CommonRequest) {
    return API.patch(managerEndpoints.api.manager.REJECT_REQUEST, request);
  }
}

export default TcManager;
