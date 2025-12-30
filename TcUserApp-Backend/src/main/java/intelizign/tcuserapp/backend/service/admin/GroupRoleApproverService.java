package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.model.GroupRoleApprover;

public interface GroupRoleApproverService {

	List<GroupRoleApprover> findAllGroupRoleApprover();

	GroupRoleApprover findBygID(String gid);

	GroupRoleApprover saveGroupRoleApprover(GroupRoleApprover groupRoleApprover);

	GroupRoleApprover updateGroupRoleApprover(GroupRoleApprover groupRoleApprover);

	GroupRoleApprover updateIsActive(GroupRoleApprover groupRoleApprover);

	List<GroupRoleApprover> getGroupRoleApproverSearch(GroupRoleApprover groupRoleApproverSearch);

}
