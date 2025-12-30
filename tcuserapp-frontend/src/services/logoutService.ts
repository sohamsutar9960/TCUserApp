import { API, userEndpoints } from "../api";

class TcLogout {
  static UserLogout() {
    return API.post(userEndpoints.api.logout.logoutUser);
  }
}

export default TcLogout;
