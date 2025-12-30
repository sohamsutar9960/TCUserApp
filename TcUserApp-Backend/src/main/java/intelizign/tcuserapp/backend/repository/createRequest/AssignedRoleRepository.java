package intelizign.tcuserapp.backend.repository.createRequest;

import intelizign.tcuserapp.backend.dto.AssignedRoleResponse;
import intelizign.tcuserapp.backend.model.AssignedRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssignedRoleRepository extends JpaRepository<AssignedRole, Long> {

	@Query("SELECT new intelizign.tcuserapp.backend.dto.AssignedRoleResponse(assRolRes.assignedRoleId, assRolRes.roleName, "
			+ "assRolRes.isAssigned, assRolRes.groupNamePath, assRolRes.groupName, assRolRes.systemName, "
			+ "assRolRes.assignedRole_Status, assRolRes.isDeleted, userReq.requestId) "
			+ "FROM AssignedRole assRolRes JOIN assRolRes.userRequest userReq "
			+ "WHERE userReq.requestId = :requestId")
	List<AssignedRoleResponse> getAssignedRolesListForRequestId(Long requestId);

}
