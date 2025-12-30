import { API, adminEndpoints } from "../api";
import Role from "../models/roleModel";

class TcRole {
  static createRole(role: Role) {
    return API.post(adminEndpoints.api.role.saveRole, role);
  }
  static updateRole(role: Role) {
    return API.put(adminEndpoints.api.role.updateRole, role);
  }
  static deleteRole(id: number) {
    return API.delete(adminEndpoints.api.role.deleteRole(id));
  }
  static findAllRoles() {
    return API.get(adminEndpoints.api.role.findAllRoles);
  }
  static searchRole(role: Role) {
    // const config = {
    //   params: role,
    // };
    // @ts-ignore
    return API.post(adminEndpoints.api.role.SEARCH_ROLE, role);
  }
}

export default TcRole;
