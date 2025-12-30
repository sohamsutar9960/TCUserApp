package intelizign.tcuserapp.backend.itk.service;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.itk.dto.TCAllUserResponse;
import intelizign.tcuserapp.backend.itk.dto.TCLoginResponse;
import intelizign.tcuserapp.backend.itk.dto.TCUserGroupAndRoleResponse;
import intelizign.tcuserapp.backend.model.UserRequest;

import java.util.List;

public interface ITKService {

    TCLoginResponse teamcenterLogin(Long systemId) throws InvalidCredentialsException;

    TCUserGroupAndRoleResponse findUserGroupAndRole(String tcUserId, Boolean isTemplate, TCLoginResponse loginResponse);

    List<TCAllUserResponse> findAllTeamcenterUser(Long systemId, TCLoginResponse tcLoginResponse);

    void findAllGroupAndRole(String groupName, TCLoginResponse loginResponse);

    void updateUserStatus(String userId, String userStatus, TCLoginResponse loginResponse);

    void createOrUpdateTCUser(Long systemId, TCLoginResponse tcLoginResponse);

    void teamcenterUserCreation(Long systemId, UserRequest userRequest, TCLoginResponse tcLoginResponse);
}
