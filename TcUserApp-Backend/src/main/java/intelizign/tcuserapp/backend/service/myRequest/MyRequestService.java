package intelizign.tcuserapp.backend.service.myRequest;

import intelizign.tcuserapp.backend.dto.MyRequestResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.model.UserRequest;

public interface MyRequestService {

    UserRequestResponse getUserRequestByID(Long requestId);

    UserRequestResponse cancelUserRequest(UserRequest userRequest);

    MyRequestResponse createdByMeUserRequest(String gid);

    MyRequestResponse createdForMeUserRequest(String gid);

    UserRequestResponse changeManagerForUserRequest(UserRequest userRequest);
}
