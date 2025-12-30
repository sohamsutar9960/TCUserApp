package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.GroupResponse;
import intelizign.tcuserapp.backend.dto.GroupRoleResponse;
import intelizign.tcuserapp.backend.dto.RoleResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Group;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.repository.admin.GroupRepository;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.service.admin.GroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    GroupResponse groupResponse;

    private final Logger logger = LoggerFactory.getLogger(GroupServiceImpl.class);

    @Override
    public List<GroupResponse> getAllGroups() {
        try {
            List<Group> groupListInDB = groupRepository.findAll();
            return groupListInDB.stream()
                    .map((groupInDB) -> new GroupResponse(groupInDB.getGroupId(),
                            groupInDB.getGroupName(), groupInDB.getGroupNamePath(), groupInDB.getUid(),
                            groupInDB.getIsRoot(), groupInDB.getDescription(), groupInDB.getDisplayName(),
                            groupInDB.getLevel(), groupInDB.getSystem().getSystemId(),
                            groupInDB.getSystem().getSystemName(),
                            groupInDB.getParentGroup() != null ? groupInDB.getParentGroup().getGroupId() : null,
                            groupInDB.getParentGroup() != null ? groupInDB.getParentGroup().getGroupName() : null)).toList();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupResponse addGroup(Group group) {
        try {
            System systemInDB = systemRepository.findById(group.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + group.getSystem().getSystemId()));
            group.setSystem(systemInDB);

            if (!group.getIsRoot()) {
                Group parentGroupInDB = groupRepository.findById(group.getParentGroup().getGroupId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "No parent group found with groupId " + group.getParentGroup().getGroupId()));
                group.setParentGroup(parentGroupInDB);
            } else {
                group.setParentGroup(null);
            }

            Group savedGroup = groupRepository.save(group);
            groupResponse.setGroupId(savedGroup.getGroupId());
            groupResponse.setDescription(savedGroup.getDescription());
            groupResponse.setGroupNamePath(savedGroup.getGroupNamePath());
            groupResponse.setDisplayName(savedGroup.getDisplayName());
            groupResponse.setGroupName(savedGroup.getGroupName());
            groupResponse.setRoot(savedGroup.getIsRoot());
            groupResponse.setUid(savedGroup.getUid());
            groupResponse.setLevel(savedGroup.getLevel());

            if (!group.getIsRoot()) {
                groupResponse.setParentGroupId(savedGroup.getParentGroup().getGroupId());
                groupResponse.setParentGroupName(savedGroup.getParentGroup().getGroupName());
            }

            groupResponse.setSystemId(savedGroup.getSystem().getSystemId());
            groupResponse.setSystemName(savedGroup.getSystem().getSystemName());
            return groupResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupResponse updateGroup(Group group) {
        try {
            System system = systemRepository.findById(group.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + group.getSystem().getSystemId()));

            Group existingGroup = groupRepository.findById(group.getGroupId()).orElseThrow(
                    () -> new ResourceNotFoundException("No group found with groupId " + group.getGroupId()));

            if (!group.getIsRoot()) {
                Group parentGroupInDB = groupRepository.findById(group.getParentGroup().getGroupId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "No parent group found with groupId " + group.getParentGroup().getGroupId()));
                existingGroup.setParentGroup(parentGroupInDB);
            } else {
                group.setParentGroup(null);
            }

            existingGroup.setDescription(group.getDescription());
            existingGroup.setDisplayName(group.getDisplayName());
            existingGroup.setGroupId(group.getGroupId());
            existingGroup.setGroupName(group.getGroupName());
            existingGroup.setGroupNamePath(group.getGroupNamePath());
            existingGroup.setLevel(group.getLevel());
            existingGroup.setIsRoot(group.getIsRoot());
            existingGroup.setSystem(system);
            existingGroup.setUid(group.getUid());

            Group savedGroup = groupRepository.save(existingGroup);

            groupResponse.setGroupId(savedGroup.getGroupId());
            groupResponse.setDescription(savedGroup.getDescription());
            groupResponse.setDisplayName(savedGroup.getDisplayName());
            groupResponse.setGroupName(savedGroup.getGroupName());
            groupResponse.setRoot(savedGroup.getIsRoot());
            groupResponse.setUid(savedGroup.getUid());
            groupResponse.setGroupNamePath(savedGroup.getGroupNamePath());
            groupResponse.setLevel(savedGroup.getLevel());

            if (!group.getIsRoot()) {
                groupResponse.setParentGroupId(savedGroup.getParentGroup().getGroupId());
                groupResponse.setParentGroupName(savedGroup.getParentGroup().getGroupName());
            }

            groupResponse.setSystemId(savedGroup.getSystem().getSystemId());
            groupResponse.setSystemName(savedGroup.getSystem().getSystemName());
            return groupResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteGroup(Long groupId) {
        try {
            groupRepository.deleteById(groupId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByGroupId(Long groupId) {
        try {
            return groupRepository.findById(groupId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<GroupRoleResponse> getGroupsForSystem(Long systemId) {
        try {
            if (systemRepository.findById(systemId).isPresent()) {
                List<Group> groupListInDB = groupRepository.getGroupsForSystem(systemId);
                return groupListInDB.stream().map(group -> new GroupRoleResponse(
                        group.getGroupId(), group.getGroupName(), group.getGroupNamePath(), group.getUid(), group.getIsRoot(),
                        group.getDescription(), group.getDisplayName(), group.getLevel(), group.getSystem().getSystemId(),
                        group.getSystem().getSystemName(), group.getParentGroup() != null ? group.getParentGroup().getGroupId() : null,
                        group.getParentGroup() != null ? group.getParentGroup().getGroupName() : null,
                        group.getRoles().stream()
                                .map(grpRole -> new RoleResponse(grpRole.getRoleId(), grpRole.getRoleName(),
                                        grpRole.getGroup().getGroupId(), grpRole.getGroup().getGroupName(),
                                        grpRole.getSystem().getSystemId(), grpRole.getSystem().getSystemName(),
                                        grpRole.getUid(), grpRole.getDescription(), grpRole.getDisplayName(),
                                        grpRole.getIsAssigned(), grpRole.getStatus()))
                                .collect(Collectors.toList()))).collect(Collectors.toList());
            }
            throw new ResourceNotFoundException("No system found with systemId " + systemId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<GroupRoleResponse> getFilteredGroupsForSystem(Long systemId, String groupName) {
        try {
            if (systemRepository.findById(systemId).isPresent()) {
                List<Group> groupListInDB = groupRepository.getFilteredGroupsForSystem(systemId, groupName);

                return groupListInDB.stream().map(group -> new GroupRoleResponse(
                        group.getGroupId(), group.getGroupName(), group.getGroupNamePath(), group.getUid(), group.getIsRoot(),
                        group.getDescription(), group.getDisplayName(), group.getLevel(), group.getSystem().getSystemId(),
                        group.getSystem().getSystemName(), group.getParentGroup() != null ? group.getParentGroup().getGroupId() : null,
                        group.getParentGroup() != null ? group.getParentGroup().getGroupName() : null,
                        group.getRoles().stream()
                                .map(grpRole -> new RoleResponse(grpRole.getRoleId(), grpRole.getRoleName(),
                                        grpRole.getGroup().getGroupId(), grpRole.getGroup().getGroupName(),
                                        grpRole.getSystem().getSystemId(), grpRole.getSystem().getSystemName(),
                                        grpRole.getUid(), grpRole.getDescription(), grpRole.getDisplayName(),
                                        grpRole.getIsAssigned(), grpRole.getStatus()))
                                .collect(Collectors.toList()))).collect(Collectors.toList());
            }
            throw new ResourceNotFoundException("No system found with systemId " + systemId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<GroupResponse> getSearchedGroups(Group searchGroup) {
        try {
            List<Group> groupList = groupRepository.findByAttributes(searchGroup);
            return groupList.stream()
                    .map(group -> new GroupResponse(group.getGroupId(), group.getGroupName(), group.getGroupNamePath(),
                            group.getUid(), group.getIsRoot(), group.getDescription(), group.getDisplayName(), group.getLevel(),
                            group.getSystem().getSystemId(), group.getSystem().getSystemName(),
                            group.getParentGroup() != null ? group.getParentGroup().getGroupId() : null,
                            group.getParentGroup() != null ? group.getParentGroup().getGroupName() : ""))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    /*@Override
    public List<GroupRoleResponse> getAllGroupRoles(Long systemId) {

        try {
            if (systemRepository.findById(systemId).isPresent()) {
                List<Group> groupList = groupRepository.getAllGroupRoles(systemId);

                List<GroupRoleResponse> groupRoleResponses = groupList.stream().map(group -> new GroupRoleResponse(
                                group.getGroupId(), group.getGroupName(), group.getUid(), group.getIsRoot(),
                                group.getDescription(), group.getDisplayName(), group.getSystem().getSystemId(),
                                group.getSystem().getSystemName(), group.getParentGroup().getGroupId(),
                                group.getParentGroup().getGroupName(),
                                group.getRoles().stream()
                                        .map(grpRole -> new RoleResponse(grpRole.getRoleId(), grpRole.getRoleName(),
                                                grpRole.getGroup().getGroupId(), grpRole.getGroup().getGroupName(),
                                                grpRole.getSystem().getSystemId(), grpRole.getSystem().getSystemName(),
                                                grpRole.getUid(), grpRole.getDescription(), grpRole.getDisplayName(),
                                                grpRole.isAssigned(), grpRole.getStatus()))
                                        .collect(Collectors.toList())))
                        .collect(Collectors.toList());
                return groupRoleResponses;
            }
            logger.error("No system found with systemId " + systemId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }*/
}
