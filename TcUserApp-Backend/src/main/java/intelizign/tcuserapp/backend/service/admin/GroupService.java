package intelizign.tcuserapp.backend.service.admin;

import intelizign.tcuserapp.backend.dto.GroupResponse;
import intelizign.tcuserapp.backend.dto.GroupRoleResponse;
import intelizign.tcuserapp.backend.model.Group;

import java.util.List;

public interface GroupService {

    List<GroupResponse> getAllGroups();

    GroupResponse addGroup(Group group);

    GroupResponse updateGroup(Group group);

    void deleteGroup(Long groupId);

    boolean findByGroupId(Long groupId);

    List<GroupRoleResponse> getGroupsForSystem(Long systemId);

    List<GroupRoleResponse> getFilteredGroupsForSystem(Long systemId, String groupName);

    List<GroupResponse> getSearchedGroups(Group group);

    //List<GroupRoleResponse> getAllGroupRoles(Long systemId);

}
