package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.User;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRoleRepository;
import intelizign.tcuserapp.backend.service.admin.UserService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserResponse userResponse;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public List<UserResponse> getAllUsers() {
        List<UserResponse> userResponseList = null;
        try {
            userResponseList = userRepository.getAllUserInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return userResponseList;
    }

    @Override
    public UserResponse addUser(User user) {
        try {
            userRoleRepository.findById(user.getUserRole().getRoleId()).orElseThrow(() -> new ResourceNotFoundException(
                    "No UserRole found with roleId " + user.getUserRole().getRoleId()));

            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                throw new DuplicateResourceException("Duplicate UserName found.");
            }

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);

            User savedUser = userRepository.save(user);
            modelMapper.map(savedUser, userResponse);
            return userResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserResponse updateUser(User user) {
        try {
            User existingUser = userRepository.findById(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("No user found with userId " + user.getUserId()));

            userRoleRepository.findById(user.getUserRole().getRoleId()).orElseThrow(() -> new ResourceNotFoundException(
                    "No UserRole found with roleId " + user.getUserRole().getRoleId()));

            Optional<User> userInDB = userRepository.findByUsername(user.getUsername());
            if (userInDB.isPresent()) {
                if (!userInDB.get().getGID().equals(user.getGID()))
                    throw new DuplicateResourceException("Duplicate UserName found.");
            }

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            existingUser.setPassword(encodedPassword);

            existingUser.setCountry(user.getCountry());
            existingUser.setDepartment(user.getDepartment());
            existingUser.setDisplayName(user.getDisplayName());
            existingUser.setEmail(user.getEmail());
            existingUser.setFirstName(user.getFirstName());
            existingUser.setFullName(user.getFullName());
            existingUser.setGID(user.getGID());
            existingUser.setLastName(user.getLastName());
            existingUser.setLineManager(user.getLineManager());
            existingUser.setMobileNumber(user.getMobileNumber());
            existingUser.setOrganization(user.getOrganization());
            existingUser.setOrganizationID(user.getOrganizationID());
            existingUser.setSponsor(user.getSponsor());
            existingUser.setUsername(user.getUsername());

            userRepository.save(existingUser);
            modelMapper.map(existingUser, userResponse);
            return userResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteUser(Long userId) {
        try {
            userRepository.deleteById(userId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByUserId(Long userId) {
        try {
            return userRepository.findById(userId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<UserResponse> getAllUserFromSearch(User userSearch) {
        try {
            List<User> userList = userRepository.findByAttributes(userSearch);

            return userList.stream()
                    .map(user -> new UserResponse(user.getUserId(), user.getFullName(), user.getFirstName(),
                            user.getLastName(), user.getDisplayName(), user.getLineManager(), user.getSponsor(),
                            user.getDepartment(), user.getOrganization(), user.getOrganizationID(), user.getCountry(),
                            user.getMobileNumber(), user.getUsername(), user.getPassword(), user.getEmail(),
                            user.getGID(), user.getUserRole().getRoleId(), user.getUserRole().getRoleName()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserResponse getUserByGid(String gid) {
        try {
            Optional<User> user = userRepository.findByGID(gid);
            if (user.isPresent()) {
                modelMapper.map(user.get(), userResponse);
                return userResponse;
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
