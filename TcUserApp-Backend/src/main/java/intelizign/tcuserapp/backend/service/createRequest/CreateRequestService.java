package intelizign.tcuserapp.backend.service.createRequest;

import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.model.UserRequest;

import java.util.List;

public interface CreateRequestService {

    List<UserRequestResponse> getAllUserRequest();

    UserRequestResponse createUserRequest(UserRequest userRequest);

    List<UserRequestResponse> getSearchedUserRequest(UserRequest userRequestSearch);

}
