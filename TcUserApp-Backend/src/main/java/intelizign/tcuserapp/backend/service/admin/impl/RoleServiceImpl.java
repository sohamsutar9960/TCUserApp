package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.RoleResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Group;
import intelizign.tcuserapp.backend.model.Role;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.repository.admin.GroupRepository;
import intelizign.tcuserapp.backend.repository.admin.RoleRepository;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.service.admin.RoleService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    RoleResponse roleResponse;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(RoleServiceImpl.class);

    @Override
    public List<RoleResponse> getAllRoles() {
        try {
            return roleRepository.getAllRoleInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public RoleResponse addRole(Role role) {
        try {
            Group group = groupRepository.findById(role.getGroup().getGroupId()).orElseThrow(
                    () -> new ResourceNotFoundException("No group found with groupId " + role.getGroup().getGroupId()));

            System system = systemRepository.findById(role.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + role.getSystem().getSystemId()));

            role.setSystem(system);
            role.setGroup(group);

            Role savedRole = roleRepository.save(role);

            modelMapper.getConfiguration().setAmbiguityIgnored(true);
            modelMapper.map(savedRole, roleResponse);

            roleResponse.setGroupId(savedRole.getGroup().getGroupId());
            roleResponse.setGroupName(savedRole.getGroup().getGroupName());
            return roleResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public RoleResponse updateRole(Role role) {
        try {
            Group group = groupRepository.findById(role.getGroup().getGroupId()).orElseThrow(
                    () -> new ResourceNotFoundException("No group found with groupId " + role.getGroup().getGroupId()));

            System system = systemRepository.findById(role.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + role.getSystem().getSystemId()));

            Role existingRole = roleRepository.findById(role.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("No role found with roleId " + role.getRoleId()));

            existingRole.setSystem(system);
            existingRole.setGroup(group);

            existingRole.setIsAssigned(role.getIsAssigned());
            existingRole.setDescription(role.getDescription());
            existingRole.setDisplayName(role.getDisplayName());

            existingRole.setRoleName(role.getRoleName());
            existingRole.setStatus(role.getStatus());
            existingRole.setUid(role.getUid());

            Role savedRole = roleRepository.save(existingRole);

            modelMapper.getConfiguration().setAmbiguityIgnored(true);
            modelMapper.map(savedRole, roleResponse);

            roleResponse.setGroupId(savedRole.getGroup().getGroupId());
            roleResponse.setGroupName(savedRole.getGroup().getGroupName());
            return roleResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteRole(Long roleId) {
        try {
            roleRepository.deleteById(roleId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByRoleId(Long roleId) {
        try {
            return roleRepository.findById(roleId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<RoleResponse> getAllRolesFromSystem(Long systemId) {
        try {
            systemRepository.findById(systemId)
                    .orElseThrow(() -> new ResourceNotFoundException("No system found with systemId " + systemId));

            return roleRepository.getAllRoleFromSystem(systemId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<RoleResponse> getAllRolesFromGroup(Long groupId) {
        try {
            groupRepository.findById(groupId)
                    .orElseThrow(() -> new ResourceNotFoundException("No group found with groupId " + groupId));

            return roleRepository.getAllRoleFromGroup(groupId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<RoleResponse> getAllRoleSearch(Role roleSearch) {
        try {
            List<Role> roleList = roleRepository.findByAttributes(roleSearch);
            return roleList.stream()
                    .map(role -> new RoleResponse(role.getRoleId(), role.getRoleName(), role.getGroup().getGroupId(),
                            role.getGroup().getGroupName(), role.getSystem().getSystemId(),
                            role.getSystem().getSystemName(), role.getUid(), role.getDescription(),
                            role.getDisplayName(), role.getIsAssigned(), role.getStatus()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
