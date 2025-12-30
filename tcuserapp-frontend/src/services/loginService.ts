import { API, userEndpoints } from "../api";
import { UserDetails } from "../models/userLoginModel";

class TcLogin {
  static UserLogin(userDetails: UserDetails) {
    return API.post(userEndpoints.api.login.loginUser, userDetails);
  }
  static getSsoResponse() {
    return API.get(userEndpoints.api.getSsoResponse.getResponse);
  }
}

export default TcLogin;
