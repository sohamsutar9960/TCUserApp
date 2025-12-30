import { API, adminEndpoints } from "../api";
import { SCDUser } from "../models/ScdUserModel";

class TcScdUser {
  static createScdUser(scdUser: SCDUser) {
    return API.post(adminEndpoints.api.scdUser.saveScdUser, scdUser);
  }
  static updateScdUser(scdUser: SCDUser) {
    return API.put(adminEndpoints.api.scdUser.updateScdUser, scdUser);
  }
  static deleteScdUser(id: number) {
    return API.delete(adminEndpoints.api.scdUser.deleteScdUser(id));
  }
  static findAllScdUsers() {
    return API.get(adminEndpoints.api.scdUser.findAllScdUsers);
  }
  static getSingleScdUser(gid: string) {
    return API.get(adminEndpoints.api.scdUser.getOneScdUser(gid));
  }
  static fetchScdUsersById(gid: string) {
    return API.get(adminEndpoints.api.scdUser.GET_SCD_USERS_BY_ID(gid));
  }
  static searchScdUser(searchFields: SCDUser) {
    return API.post(adminEndpoints.api.scdUser.SEARCH_SCD_USER, searchFields);
  }
}

export default TcScdUser;
