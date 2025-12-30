package intelizign.tcuserapp.backend.repository.admin;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import intelizign.tcuserapp.backend.dto.UserRoleResponse;
import intelizign.tcuserapp.backend.model.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

	@Query("SELECT new intelizign.tcuserapp.backend.dto.UserRoleResponse(ures.roleId, ures.roleName) "
			+ "FROM UserRole ures")
	public List<UserRoleResponse> getAllUserRoleInformation();

	@Query("SELECT new intelizign.tcuserapp.backend.dto.UserRoleResponse(ures.roleId, ures.roleName) "
			+ "FROM UserRole ures WHERE ures.roleId = :roleId")
	public UserRoleResponse getUserRoleById(Long roleId);

	public Optional<UserRole> findByRoleName(String roleName);

}
