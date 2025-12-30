package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.model.Group;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {

/*	@Query("SELECT new intelizign.tcuserapp.backend.dto.GroupResponse(grp.groupId, grp.groupName, grp.uid, grp.isRoot, "
			+ "grp.description, grp.displayName, sys.systemId, sys.systemName, parentGrp.groupId, parentGrp.groupName) "
			+ "FROM Group grp JOIN grp.system sys JOIN grp.parentGroup parentGrp ORDER BY grp.groupId")
	public List<GroupResponse> getAllGroupInformation();

    @Query("SELECT new intelizign.tcuserapp.backend.dto.GroupResponse(grp.groupId, grp.groupName, grp.uid, grp.isRoot, "
            + "grp.description, grp.displayName, sys.systemId, sys.systemName, parentGrp.groupId, parentGrp.groupName) "
            + "FROM Group grp JOIN grp.system sys JOIN grp.parentGroup parentGrp WHERE grp.groupId =:groupId")
    public GroupResponse getGroupById(Long groupId);*/

    @Query("SELECT grp FROM Group grp WHERE grp.system.systemId = :systemId")
    public List<Group> getGroupsForSystem(Long systemId);

    @Query("SELECT grp FROM Group grp WHERE grp.system.systemId = :systemId "
            + "and grp.groupName like %:groupName% ORDER BY grp.groupId")
    public List<Group> getFilteredGroupsForSystem(Long systemId, String groupName);

    /*@Query("SELECT grp FROM Group grp WHERE grp.system.systemId =:systemId ORDER BY grp.groupId")
    public List<Group> getAllGroupRoles(Long systemId);*/

    default List<Group> findByAttributes(Group searchGroup) {

        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
                .withStringMatcher(StringMatcher.CONTAINING);

        Example<Group> groupExample = Example.of(searchGroup, exampleMatcher);
        return findAll(groupExample);
    }

}
