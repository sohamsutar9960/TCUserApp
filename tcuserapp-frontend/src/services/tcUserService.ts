import { API, adminEndpoints } from "../api";
import { TcUserModel, searchFields } from "../models/tcUserModel";

class TcUserService {
  static createTcUser(tcuser: TcUserModel) {
    return API.post(adminEndpoints.api.tcUser.SAVE_TC_USER, tcuser);
  }
  static updateTcUser(tcuser: TcUserModel) {
    return API.put(adminEndpoints.api.tcUser.UPDATE_TC_USER, tcuser);
  }
  static deleteTcUser(id: number) {
    return API.delete(adminEndpoints.api.tcUser.DELETE_TC_USER(id));
  }
  static findAllTcUser() {
    return API.get(adminEndpoints.api.tcUser.FIND_ALL_TCUSER);
  }
  static getAllTcUserBySelect(systemId: number) {
    return API.get(adminEndpoints.api.tcUser.GET_TC_USER(systemId));
  }
  static searchUserHistory(searchFields: searchFields) {
    return API.post(
      adminEndpoints.api.tcUser.SEARCH_TC_USER_HISTORY,
      searchFields,
    );
  }
}

export default TcUserService;
