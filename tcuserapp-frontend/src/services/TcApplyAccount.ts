// TcApplyAccount.ts

import { API } from "../api";
import adminApiConfig from "../api/adminConfig";
import { UserRequest } from "../models/userRequestModel";

class TcApplyAccount {
  static saveUserRequest(userRequest: UserRequest) {
    return API.post(
      adminApiConfig.api.applyAccount.SAVE_USER_REQUEST,
      userRequest,
    );
  }
}

export default TcApplyAccount;
