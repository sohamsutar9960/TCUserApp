package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.UserRoleResponse;
import intelizign.tcuserapp.backend.model.UserRole;

public interface UserRoleService {

	List<UserRoleResponse> getAllUserRoles();

	UserRoleResponse addUserRole(UserRole userRole);

	UserRoleResponse updateUserRole(UserRole userRole);

	void deleteUserRole(Long userRoleId);

	boolean findByUserRoleId(Long userRoleId);

}
