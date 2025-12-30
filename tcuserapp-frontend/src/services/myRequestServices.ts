import { API, userEndpoints } from "../api";
// import { myRequestResponse } from "../models/myRequestModel";

class TcMyRequest {
  static getAllUserRequest(gid: string) {
    return API.get(userEndpoints.api.myUserRequest.ALL_USER_REQUESTS(gid));
  }
  static getMyRequest(gid: string) {
    return API.get(userEndpoints.api.myUserRequest.MY_REQUESTS(gid));
  }
  static getRequestById(requestID: number) {
    return API.get(
      userEndpoints.api.myUserRequest.GET_REQUEST_BY_ID(requestID),
    );
  }
  static cancelUserRequest(data: {
    requestId: number | null;
    cancellationComment: string;
    reasonForCancellation: string;
  }) {
    return API.post(userEndpoints.api.myUserRequest.CANCEL_USER_REQUESTS, data);
  }
  static changeManagerRequest(data: {
    requestId: number | null;
    costManagerForAnother: { gid: string };
  }) {
    return API.post(userEndpoints.api.myUserRequest.CHANGE_MANAGER, data);
  }
  static getSearchManager(gid: string) {
    return API.get(userEndpoints.api.myUserRequest.GET_SEARCH_MANAGER(gid));
  }
}

export default TcMyRequest;
