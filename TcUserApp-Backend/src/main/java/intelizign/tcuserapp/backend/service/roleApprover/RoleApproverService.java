package intelizign.tcuserapp.backend.service.roleApprover;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.dto.RoleApproverResponse;
import intelizign.tcuserapp.backend.dto.RoleApproverSearchResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.model.AssignedRole;
import intelizign.tcuserapp.backend.model.UserRequest;

import java.util.List;

public interface RoleApproverService {

    UserRequestResponse approvedByRoleApprover(UserRequest userRequest) throws InvalidCredentialsException;

    UserRequestResponse rejectedByRoleApprover(UserRequest userRequest);

    UserRequestResponse assignOrDeleteRole(Long assignedRoleId);

    RoleApproverResponse getAllRequestForRoleApprover();

    List<RoleApproverSearchResponse> getAllRolesFromRoleName(String roleName);

    UserRequestResponse assignRoleToExistingRequest(Long requestId, List<AssignedRole> assignedRoleList);
}
