package intelizign.tcuserapp.backend.service.roleApprover.impl;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.dto.RoleApproverResponse;
import intelizign.tcuserapp.backend.dto.RoleApproverSearchResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.dto.mapper.UserRequestMapper;
import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.DeletionNotAllowedException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.exception.TeamcenterException;
import intelizign.tcuserapp.backend.itk.dto.TCLoginResponse;
import intelizign.tcuserapp.backend.itk.service.ITKService;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.repository.admin.RoleRepository;
import intelizign.tcuserapp.backend.repository.admin.UserHistoryRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.createRequest.AssignedRoleRepository;
import intelizign.tcuserapp.backend.repository.createRequest.CreateRequestRepository;
import intelizign.tcuserapp.backend.repository.createRequest.HistoryLogRepository;
import intelizign.tcuserapp.backend.repository.roleApprover.RoleApproverRepository;
import intelizign.tcuserapp.backend.service.roleApprover.RoleApproverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleApproverServiceImpl implements RoleApproverService {

    @Autowired
    RoleApproverRepository roleApproverRepository;

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    RoleApproverResponse roleApproverResponse;

    @Autowired
    AssignedRoleRepository assignedRoleRepository;

    @Autowired
    UserRequestMapper userRequestMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CreateRequestRepository createRequestRepository;

    @Autowired
    ITKService itkService;

    @Autowired
    HistoryLogRepository historyLogRepository;

    private final Logger logger = LoggerFactory.getLogger(RoleApproverServiceImpl.class);

    @Override
    public UserRequestResponse approvedByRoleApprover(UserRequest userRequest) throws InvalidCredentialsException {
        try {
            UserRequest userRequestInDB = roleApproverRepository.findById(userRequest.getRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user request found with requestId " + userRequest.getRequestId()));

            userRequestInDB.setGroupRoleApproverComments(userRequest.getGroupRoleApproverComments());
            userRequestInDB.setGroupRoleApproverDate(new Date());
            userRequestInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Approved_By_GroupRole_Approver);

            if (userRequestInDB.getUserHistory() != null) {
                UserHistory userHistoryInDB = userHistoryRepository
                        .findById(userRequestInDB.getUserHistory().getUserHistoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId "
                                + userRequestInDB.getUserHistory().getUserHistoryId()));

                userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Approved_By_GroupRole_Approver);
                userHistoryRepository.save(userHistoryInDB);
            }

            Optional<User> userInDB = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            if (userInDB.isPresent()) {
                HistoryLog logs = new HistoryLog();
                logs.setComments("User Request Approved by RoleApprover "
                        + userInDB.get().getDisplayName());
                logs.setCreationDate(new Date());
                logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs.setUserRequest(userRequestInDB);
                HistoryLog saveHistoryLog = historyLogRepository.save(logs);
                userRequestInDB.getHistoryLogList().add(saveHistoryLog);
            }

            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(userRequestInDB.getSystem().getSystemId());
            if (tcLoginResponse != null) {
                itkService.teamcenterUserCreation(userRequestInDB.getSystem().getSystemId(), userRequestInDB, tcLoginResponse);

                if (userInDB.isPresent()) {
                    HistoryLog logs = new HistoryLog();
                    logs.setComments("User Request Exported To Target System by  "
                            + userInDB.get().getDisplayName());
                    logs.setCreationDate(new Date());
                    logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                    logs.setUserRequest(userRequestInDB);
                    HistoryLog saveHistoryLog = historyLogRepository.save(logs);
                    userRequestInDB.getHistoryLogList().add(saveHistoryLog);
                }

                if (userRequestInDB.getUserHistory() != null) {
                    UserHistory userHistoryInDB = userHistoryRepository
                            .findById(userRequestInDB.getUserHistory().getUserHistoryId())
                            .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId "
                                    + userRequestInDB.getUserHistory().getUserHistoryId()));

                    userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);
                    userHistoryRepository.save(userHistoryInDB);
                }

                UserRequest savedUserRequest = roleApproverRepository.save(userRequestInDB);
                return userRequestMapper.toUserRequestResponse(savedUserRequest);
            } else
                throw new TeamcenterException("Unable to connect with Teamcenter instance.");
        } catch (ResourceNotFoundException | InvalidCredentialsException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRequestResponse rejectedByRoleApprover(UserRequest userRequest) {
        try {
            UserRequest userRequestInDB = roleApproverRepository.findById(userRequest.getRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user request found with requestId " + userRequest.getRequestId()));

            userRequestInDB.setGroupRoleApproverComments(userRequest.getGroupRoleApproverComments());
            userRequestInDB.setGroupRoleApproverDate(new Date());
            userRequestInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Rejected_By_GroupRole_Approver);

            if (userRequestInDB.getUserHistory() != null) {
                UserHistory userHistoryInDB = userHistoryRepository
                        .findById(userRequestInDB.getUserHistory().getUserHistoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId "
                                + userRequestInDB.getUserHistory().getUserHistoryId()));

                if (userHistoryInDB.getTcCreated()) {
                    userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);
                    userHistoryRepository.save(userHistoryInDB);
                } else {
                    userHistoryInDB.getUserRequests().remove(userRequestInDB);
                    userRequestInDB.setUserHistory(null);
                    userHistoryRepository.delete(userHistoryInDB);
                }
            }

            Optional<User> userInDB = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            if (userInDB.isPresent()) {
                HistoryLog logs = new HistoryLog();
                logs.setComments("User Request Rejected by RoleApprover "
                        + userInDB.get().getDisplayName());
                logs.setCreationDate(new Date());
                logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs.setUserRequest(userRequestInDB);
                HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                userRequestInDB.getHistoryLogList().add(savedHistoryLog);
            }

            UserRequest savedUserRequest = roleApproverRepository.save(userRequestInDB);
            return userRequestMapper.toUserRequestResponse(savedUserRequest);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @Override
    public UserRequestResponse assignOrDeleteRole(Long assignedRoleId) {
        try {
            AssignedRole assignedRoleInDB = assignedRoleRepository.findById(assignedRoleId).orElseThrow(
                    () -> new ResourceNotFoundException("No assignedRole found with id " + assignedRoleId));

            Long requestId = assignedRoleInDB.getUserRequest().getRequestId();
            UserRequest userRequestInDB = roleApproverRepository.findById(requestId).orElseThrow(
                    () -> new ResourceNotFoundException("No user request found with requestId " + requestId));

            List<AssignedRole> existingAssignedRoles = userRequestInDB.getAssignedRoles();
            String defaultGroup = userRequestInDB.getDefaultGroup();

            Map<String, Long> groupNamePathMap = existingAssignedRoles
                    .stream()
                    .collect(Collectors.groupingBy(AssignedRole::getGroupNamePath, Collectors.counting()));

            if (assignedRoleInDB.getGroupNamePath().equals(defaultGroup) && groupNamePathMap.get(defaultGroup) == 1) {
                throw new DeletionNotAllowedException("Deletion of all roles from default group is not allowed.");
            }

            UserRequest savedUserRequest = null;
            Optional<User> userInDB = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

            if (assignedRoleInDB.getAssignedRole_Status().equals(ENUM_AssignedRole_Status.Newly_Added)) {
                if (userInDB.isPresent()) {
                    HistoryLog logs = new HistoryLog();
                    logs.setComments("Requested new role " + assignedRoleInDB.getRoleName() + " from group "
                            + assignedRoleInDB.getGroupNamePath() + " is deleted by RoleApprover "
                            + userInDB.get().getDisplayName());
                    logs.setCreationDate(new Date());
                    logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                    logs.setUserRequest(userRequestInDB);
                    HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                    userRequestInDB.getHistoryLogList().add(savedHistoryLog);

                    AssignedRole removeAssignedRole = userRequestInDB.getAssignedRoles()
                            .stream()
                            .filter(assignedRole -> assignedRole.getAssignedRoleId() == assignedRoleInDB.getAssignedRoleId())
                            .findFirst()
                            .orElse(null);

                    if (removeAssignedRole != null) {
                        userRequestInDB.getAssignedRoles().remove(removeAssignedRole);
                    }
                    savedUserRequest = roleApproverRepository.save(userRequestInDB);
                    assignedRoleRepository.deleteById(assignedRoleInDB.getAssignedRoleId());
                }
            } else {
                if (assignedRoleInDB.isDeleted()) {
                    if (userInDB.isPresent()) {
                        HistoryLog logs = new HistoryLog();

                        logs.setComments("Delete request for already existing role " + assignedRoleInDB.getRoleName() + " from group "
                                + assignedRoleInDB.getGroupNamePath() + " is reverted by RoleApprover "
                                + userInDB.get().getDisplayName());

                        logs.setCreationDate(new Date());
                        logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                        logs.setUserRequest(userRequestInDB);
                        HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                        userRequestInDB.getHistoryLogList().add(savedHistoryLog);
                        assignedRoleInDB.setDeleted(false);
                        assignedRoleRepository.save(assignedRoleInDB);
                        savedUserRequest = roleApproverRepository.save(userRequestInDB);
                    }
                } else {
                    if (userInDB.isPresent()) {
                        HistoryLog logs = new HistoryLog();

                        logs.setComments("Added already existing role " + assignedRoleInDB.getRoleName() + " from group "
                                + assignedRoleInDB.getGroupNamePath() + " for deletion by RoleApprover "
                                + userInDB.get().getDisplayName());

                        logs.setCreationDate(new Date());
                        logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                        logs.setUserRequest(userRequestInDB);
                        HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                        userRequestInDB.getHistoryLogList().add(savedHistoryLog);
                        assignedRoleInDB.setDeleted(true);
                        assignedRoleRepository.save(assignedRoleInDB);
                        savedUserRequest = roleApproverRepository.save(userRequestInDB);
                    }
                }
            }
            return userRequestMapper.toUserRequestResponse(savedUserRequest);
        } catch (DeletionNotAllowedException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public RoleApproverResponse getAllRequestForRoleApprover() {
        try {
            List<UserRequest> openRequestList = roleApproverRepository.getAllOpenRequest(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager);
            List<UserRequest> approvedRequestList = roleApproverRepository.getAllApprovedRequest(ENUM_UserRequest_RequestStatus.Approved_By_GroupRole_Approver);
            List<UserRequest> rejectedRequestList = roleApproverRepository.getAllRejectedRequest(ENUM_UserRequest_RequestStatus.Rejected_By_GroupRole_Approver);
            List<UserRequest> exportedRequestList = roleApproverRepository.getAllExportedRequest(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);

            roleApproverResponse.setOpenRequests(openRequestList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            roleApproverResponse.setApprovedRequests(approvedRequestList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            roleApproverResponse.setRejectedRequests(rejectedRequestList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            roleApproverResponse.setRejectedRequests(exportedRequestList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            return roleApproverResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<RoleApproverSearchResponse> getAllRolesFromRoleName(String roleName) {
        try {
            List<Role> roleList = roleRepository.getAllRolesFromRoleName(roleName);
            if (!roleList.isEmpty()) {
                return roleList
                        .stream().map(role -> new RoleApproverSearchResponse(role.getRoleId(), role.getRoleName(), role.getGroup().getGroupId(), role.getGroup().getGroupName(), role.getGroup().getGroupNamePath()))
                        .toList();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return List.of();
    }

    @Override
    public UserRequestResponse assignRoleToExistingRequest(Long requestId, List<AssignedRole> requestedAssignedRoleList) {
        try {
            UserRequest userRequestInDB = createRequestRepository.findById(requestId)
                    .orElseThrow(() -> new ResourceNotFoundException("No user request found with requestId " + requestId));

            List<AssignedRole> assignedRolesInDBList = userRequestInDB.getAssignedRoles();
            List<AssignedRole> newAssignedRolesList = new ArrayList<>();

            for (AssignedRole requestedAssignedRole : requestedAssignedRoleList) {

                AssignedRole existingAssignedRole = assignedRolesInDBList
                        .stream()
                        .filter(assignedRole -> assignedRole.getGroupNamePath().equals(requestedAssignedRole.getGroupNamePath())
                                && assignedRole.getRoleName().equals(requestedAssignedRole.getRoleName()))
                        .findFirst()
                        .orElse(null);
                if (existingAssignedRole == null) {
                    newAssignedRolesList.add(requestedAssignedRole);
                }
            }

            List<HistoryLog> historyLogList = new ArrayList<>();
            Optional<User> userInDB = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            for (AssignedRole assignedRole : newAssignedRolesList) {
                if (userInDB.isPresent()) {
                    HistoryLog historyLog = new HistoryLog();
                    historyLog.setComments("Added new role " + assignedRole.getRoleName() +
                            " from group " + assignedRole.getGroupNamePath() + " by "
                            + userInDB.get().getDisplayName());
                    historyLog.setCreationDate(new Date());
                    historyLog.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                    historyLog.setUserRequest(userRequestInDB);
                    historyLogList.add(historyLog);
                }
            }

            updateNewAssignedRole(newAssignedRolesList, userRequestInDB);
            List<AssignedRole> savedAssignedRoleList = assignedRoleRepository.saveAll(newAssignedRolesList);
            userRequestInDB.getAssignedRoles().addAll(savedAssignedRoleList);

            if (!historyLogList.isEmpty()) {
                userRequestInDB.getHistoryLogList().addAll(historyLogList);
                historyLogRepository.saveAll(historyLogList);
            }

            UserRequest savedUserRequest = createRequestRepository.saveAndFlush(userRequestInDB);
            return userRequestMapper.toUserRequestResponse(savedUserRequest);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    private static void updateNewAssignedRole(List<AssignedRole> newAssignedRolesList, UserRequest userRequestInDB) {
        List<AssignedRole> updatedList = newAssignedRolesList.stream().map(assignedRole -> {
            assignedRole.setIsAssigned(false);
            assignedRole.setDeleted(false);
            assignedRole.setSystemName(userRequestInDB.getSystem().getSystemName());
            assignedRole.setAssignedRole_Status(ENUM_AssignedRole_Status.Newly_Added);
            assignedRole.setUserRequest(userRequestInDB);
            return assignedRole;
        }).toList();
        newAssignedRolesList.clear();
        newAssignedRolesList.addAll(updatedList);
    }
}
