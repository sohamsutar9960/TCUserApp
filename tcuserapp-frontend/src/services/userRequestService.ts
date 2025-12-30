import { API, adminEndpoints } from "../api";
import { SearchFields } from "../components/molecules/dashboard/userRequestViewPage/userRequestViewPage";

class UserRequest {
  static allUserRequest() {
    return API.get(adminEndpoints.api.userRequest.FIND_ALL_USER_REQUEST);
  }
  static getRequestById(requestID: number) {
    return API.get(
      adminEndpoints.api.userRequest.GET_USER_REQUEST_BY_ID(requestID),
    );
  }
  static userRequestSearch(searchFields: SearchFields) {
    return API.post(
      adminEndpoints.api.userRequest.USER_REQUEST_SEARCH,
      searchFields,
    );
  }
}

export default UserRequest;
