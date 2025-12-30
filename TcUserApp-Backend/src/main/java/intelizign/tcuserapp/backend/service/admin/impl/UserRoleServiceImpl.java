package intelizign.tcuserapp.backend.service.admin.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import intelizign.tcuserapp.backend.dto.UserRoleResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.UserRole;
import intelizign.tcuserapp.backend.repository.admin.UserRoleRepository;
import intelizign.tcuserapp.backend.service.admin.UserRoleService;

@Service
public class UserRoleServiceImpl implements UserRoleService {

    @Autowired
    UserRoleRepository userRoleRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRoleResponse userRoleResponse;

    private final Logger logger = LoggerFactory.getLogger(UserRoleServiceImpl.class);

    @Override
    public List<UserRoleResponse> getAllUserRoles() {

        try {
            return userRoleRepository.getAllUserRoleInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRoleResponse addUserRole(UserRole userRole) {

        try {
            UserRole savedUserRole = userRoleRepository.save(userRole);
            modelMapper.map(savedUserRole, userRoleResponse);
            return userRoleResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRoleResponse updateUserRole(UserRole userRole) {

        try {
            UserRole existingUserRole = userRoleRepository.findById(userRole.getRoleId()).orElseThrow(
                    () -> new ResourceNotFoundException("No userrole found with roleId " + userRole.getRoleId()));
            existingUserRole.setRoleName(userRole.getRoleName());

            UserRole updatedUserRole = userRoleRepository.save(existingUserRole);
            modelMapper.map(updatedUserRole, userRoleResponse);
            return userRoleResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteUserRole(Long userRoleId) {

        try {
            userRoleRepository.deleteById(userRoleId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByUserRoleId(Long userRoleId) {
        try {
            return userRoleRepository.findById(userRoleId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }
}
