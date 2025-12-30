import { API, adminEndpoints } from "../api";

class UserSelectionHistory {
  static fetchScdUsersById: any;
  static getUserSelectionResponse(id: string) {
    return API.get(adminEndpoints.api.useSelection.GET_USER_HISTORY(id));
  }
  static getUserHistoryByGidAndSystem(gid: string, systemName: string) {
    return API.get(
      adminEndpoints.api.useSelection.GET_USER_H_S(gid, systemName),
    );
  }
}

export default UserSelectionHistory;
