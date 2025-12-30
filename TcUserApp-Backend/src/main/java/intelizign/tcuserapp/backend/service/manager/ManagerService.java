package intelizign.tcuserapp.backend.service.manager;

import intelizign.tcuserapp.backend.dto.ManagerResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.model.UserRequest;

public interface ManagerService {

    UserRequestResponse approveUserRequestByManager(UserRequest userRequest);

    UserRequestResponse rejectUserRequestByManager(UserRequest userRequest);

    UserRequestResponse assignOrDeleteRole(Long assignedRoleId);

    ManagerResponse getAllRequestForManager(String gid);
}
