import { API, userEndpoints } from "../api";
import { UserRole } from "../models/tcUserRoleModel";

class TcUserRole {
  static createUserRole(userRole: UserRole) {
    return API.post(userEndpoints.api.userRole.saveUserRole, userRole);
  }
  static updateUserRole(userRole: UserRole) {
    return API.put(userEndpoints.api.userRole.updateUserRole, userRole);
  }
  static deleteUserRole(id: number) {
    return API.delete(userEndpoints.api.userRole.deleteUserRole(id));
  }
  static findAllUserRoles() {
    return API.get(userEndpoints.api.userRole.findAllUserRoles);
  }
}

export default TcUserRole;
