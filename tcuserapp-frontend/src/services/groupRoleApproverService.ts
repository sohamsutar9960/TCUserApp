import { API, adminEndpoints } from "../api";
import { GroupRoleApprover } from "../models/groupRoleApproverModel";

class TcGroupRoleApprover {
  static findAllGroupRoleApprovers() {
    return API.get(
      adminEndpoints.api.groupRoleApprover.FIND_ALL_GROUPROLE_APPROVERS,
    );
  }

  static getSingleGroupRoleApprover(gid: string) {
    return API.get(
      adminEndpoints.api.groupRoleApprover.GET_SINGLE_GROUPROLE_APPROVER(gid),
    );
  }

  static saveGroupRoleApprover(groupRoleApprover: GroupRoleApprover) {
    return API.post(
      adminEndpoints.api.groupRoleApprover.SAVE_GROUPROLE_APPROVER,
      groupRoleApprover,
    );
  }

  static updateGroupRoleApprover(groupRoleApprover: GroupRoleApprover) {
    return API.put(
      adminEndpoints.api.groupRoleApprover.UPDATE_GROUPROLE_APPROVER,
      groupRoleApprover,
    );
  }

  static updateActivateDeactivateGroupRoleApprover(
    groupRoleApprover: GroupRoleApprover,
  ) {
    return API.post(
      adminEndpoints.api.groupRoleApprover
        .UPDATE_ACTIVATE_DEACTIVATE_ROUPROLE_APPROVER,
      groupRoleApprover,
    );
  }
  static searchGroupRoleApprover(searchFields: GroupRoleApprover) {
    return API.post(
      adminEndpoints.api.groupRoleApprover.SEARCH_GROUPROLE_APPROVER,
      searchFields,
    );
  }
}

export default TcGroupRoleApprover;
