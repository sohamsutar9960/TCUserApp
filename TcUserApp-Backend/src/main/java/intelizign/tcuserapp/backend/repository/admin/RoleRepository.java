package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.dto.RoleResponse;
import intelizign.tcuserapp.backend.model.Role;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("SELECT new intelizign.tcuserapp.backend.dto.RoleResponse(rol.roleId, rol.roleName, grp.groupId, grp.groupName, "
            + "sys.systemId, sys.systemName, rol.uid, rol.description, rol.displayName, rol.isAssigned, rol.status) "
            + "FROM Role rol JOIN rol.group grp JOIN rol.system sys")
    List<RoleResponse> getAllRoleInformation();

    @Query("SELECT new intelizign.tcuserapp.backend.dto.RoleResponse(rol.roleId, rol.roleName, grp.groupId, grp.groupName, "
            + "sys.systemId, sys.systemName, rol.uid, rol.description, rol.displayName, rol.isAssigned, rol.status) "
            + "FROM Role rol JOIN rol.group grp JOIN rol.system sys WHERE rol.roleId = :roleId")
    RoleResponse getRoleById(Long roleId);

    @Query("SELECT new intelizign.tcuserapp.backend.dto.RoleResponse(rol.roleId, rol.roleName, grp.groupId, grp.groupName, "
            + "sys.systemId, sys.systemName, rol.uid, rol.description, rol.displayName, rol.isAssigned, rol.status) "
            + "FROM Role rol JOIN rol.group grp JOIN rol.system sys where sys.systemId = :systemId")
    List<RoleResponse> getAllRoleFromSystem(Long systemId);

    @Query("SELECT new intelizign.tcuserapp.backend.dto.RoleResponse(rol.roleId, rol.roleName, grp.groupId, grp.groupName, "
            + "sys.systemId, sys.systemName, rol.uid, rol.description, rol.displayName, rol.isAssigned, rol.status) "
            + "FROM Role rol JOIN rol.group grp JOIN rol.system sys where grp.groupId = :groupId")
    List<RoleResponse> getAllRoleFromGroup(Long groupId);

    @Query("SELECT role from Role role WHERE role.roleName LIKE %:roleName%")
    List<Role> getAllRolesFromRoleName(String roleName);

    default List<Role> findByAttributes(Role roleSearch) {
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
                .withStringMatcher(StringMatcher.CONTAINING);

        Example<Role> roleExample = Example.of(roleSearch, exampleMatcher);
        return findAll(roleExample);
    }
}
