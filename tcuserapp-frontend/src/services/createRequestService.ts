import { API, adminEndpoints } from "../api";
import { RequestObject } from "../models/stepperModel";

class TcUserRequest {
  static createUserRequest(userRequest: RequestObject) {
    return API.post(
      adminEndpoints.api.createRequest.CREATE_REQUEST_USER,
      userRequest,
    );
  }
}

export default TcUserRequest;
