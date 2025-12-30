import { API, roleApproverEndpoints } from "../api";
import {
  AssignedRole,
  CommonRequest,
} from "../models/ManagerAndGroupRoleApproverModel";

class TcRoleApprover {
  static getGroupRoleApproverAllRequests() {
    return API.get(
      roleApproverEndpoints.api.roleApprover.GET_ROLEAPPROVER_ALL_REQUESTS,
    );
  }
  static getRequestDetailsView(requestID: number) {
    return API.get(
      roleApproverEndpoints.api.roleApprover.GET_REQUEST_DETAILS_VIEW_BY_ID(
        requestID,
      ),
    );
  }
  static deleteAssignedRoleByRoleApprover(assignedRoleId: number) {
    return API.get(
      roleApproverEndpoints.api.roleApprover.DELETE_ASSIGNED_ROLE(
        assignedRoleId,
      ),
    );
  }
  static approveRequestByRoleApprover(request: CommonRequest) {
    return API.patch(
      roleApproverEndpoints.api.roleApprover.APPROVE_REQUEST,
      request,
    );
  }
  static rejectRequestByRoleApprover(request: CommonRequest) {
    return API.patch(
      roleApproverEndpoints.api.roleApprover.REJECT_REQUEST,
      request,
    );
  }
  static searchRoles(roleName: string) {
    return API.get(
      roleApproverEndpoints.api.roleApprover.SEARCH_ROLES(roleName),
    );
  }
  static addAssignedRoles(requestID: number, assignedRoles: AssignedRole[]) {
    return API.post(
      roleApproverEndpoints.api.roleApprover.ADD_ASSIGNED_ROLES(requestID),
      assignedRoles,
    );
  }
}

export default TcRoleApprover;
