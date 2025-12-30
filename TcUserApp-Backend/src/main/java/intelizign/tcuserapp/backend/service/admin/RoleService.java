package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.RoleResponse;
import intelizign.tcuserapp.backend.model.Role;

public interface RoleService {

	List<RoleResponse> getAllRoles();

	RoleResponse addRole(Role role);

	RoleResponse updateRole(Role role);

	void deleteRole(Long roleId);

	boolean findByRoleId(Long roleId);

	List<RoleResponse> getAllRolesFromSystem(Long systemId);

	List<RoleResponse> getAllRolesFromGroup(Long groupId);
	
	List<RoleResponse> getAllRoleSearch(Role role);
}
