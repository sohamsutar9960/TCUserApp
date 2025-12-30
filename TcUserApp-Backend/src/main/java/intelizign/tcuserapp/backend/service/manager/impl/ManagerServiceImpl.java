package intelizign.tcuserapp.backend.service.manager.impl;

import intelizign.tcuserapp.backend.dto.ManagerResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.dto.mapper.UserRequestMapper;
import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.DeletionNotAllowedException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.repository.admin.UserHistoryRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.createRequest.AssignedRoleRepository;
import intelizign.tcuserapp.backend.repository.createRequest.HistoryLogRepository;
import intelizign.tcuserapp.backend.repository.manager.ManagerRepository;
import intelizign.tcuserapp.backend.service.manager.ManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ManagerServiceImpl implements ManagerService {

    @Autowired
    ManagerRepository managerRepository;

    @Autowired
    UserRequestMapper userRequestMapper;

    @Autowired
    AssignedRoleRepository assignedRoleRepository;

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    ManagerResponse managerResponse;

    @Autowired
    UserRepository userRepository;

    @Autowired
    HistoryLogRepository historyLogRepository;

    private final Logger logger = LoggerFactory.getLogger(ManagerServiceImpl.class);

    @Override
    public UserRequestResponse approveUserRequestByManager(UserRequest userRequest) {
        try {
            UserRequest userRequestInDB = managerRepository.findById(userRequest.getRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user request found with requestId " + userRequest.getRequestId()));

            userRequestInDB.setCostApproverComments(userRequest.getCostApproverComments());
            userRequestInDB.setCostApproverDate(new Date());
            userRequestInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager);

            if (userRequestInDB.getUserHistory() != null) {
                UserHistory userHistoryInDB = userHistoryRepository
                        .findById(userRequestInDB.getUserHistory().getUserHistoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId "
                                + userRequestInDB.getUserHistory().getUserHistoryId()));

                userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager);
                userHistoryRepository.save(userHistoryInDB);
            }

            Optional<User> userInDB = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
            if (userInDB.isPresent()) {
                HistoryLog logs = new HistoryLog();
                logs.setComments("User Request Approved by Manager "
                        + userInDB.get().getDisplayName());
                logs.setCreationDate(new Date());
                logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs.setUserRequest(userRequestInDB);
                HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                userRequestInDB.getHistoryLogList().add(savedHistoryLog);
            }

            UserRequest savedUserRequest = managerRepository.save(userRequestInDB);
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
    public UserRequestResponse rejectUserRequestByManager(UserRequest userRequest) {
        try {
            UserRequest userRequestInDB = managerRepository.findById(userRequest.getRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user request found with requestId " + userRequest.getRequestId()));

            userRequestInDB.setCostApproverComments(userRequest.getCostApproverComments());
            userRequestInDB.setCostApproverDate(new Date());
            userRequestInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Rejected_By_Cost_Manager);

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
                logs.setComments("User Request Rejected by Manager "
                        + userInDB.get().getDisplayName());
                logs.setCreationDate(new Date());
                logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs.setUserRequest(userRequestInDB);
                HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                userRequestInDB.getHistoryLogList().add(savedHistoryLog);
            }

            UserRequest savedUserRequest = managerRepository.save(userRequestInDB);
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
    public UserRequestResponse assignOrDeleteRole(Long deleteRoleId) {
        try {
            AssignedRole assignedRoleInDB = assignedRoleRepository.findById(deleteRoleId).orElseThrow(
                    () -> new ResourceNotFoundException("No assignedRole found with id " + deleteRoleId));

            Long requestId = assignedRoleInDB.getUserRequest().getRequestId();
            UserRequest userRequestInDB = managerRepository.findById(requestId).orElseThrow(
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
                            + assignedRoleInDB.getGroupNamePath() + " is deleted by Manager "
                            + userInDB.get().getDisplayName());
                    logs.setCreationDate(new Date());
                    logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                    logs.setUserRequest(userRequestInDB);

                    HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                    userRequestInDB.getHistoryLogList().add(savedHistoryLog);

                    AssignedRole removeAssignedRole = userRequestInDB.getAssignedRoles()
                            .stream()
                            .filter(assignedRole -> assignedRole.getAssignedRoleId().equals(assignedRoleInDB.getAssignedRoleId()))
                            .findFirst()
                            .orElse(null);

                    if (removeAssignedRole != null) {
                        userRequestInDB.getAssignedRoles().remove(removeAssignedRole);
                    }
                    savedUserRequest = managerRepository.save(userRequestInDB);
                    assignedRoleRepository.deleteById(assignedRoleInDB.getAssignedRoleId());
                }
            } else {
                if (assignedRoleInDB.isDeleted()) {
                    if (userInDB.isPresent()) {
                        HistoryLog logs = new HistoryLog();
                        logs.setComments("Delete request for already existing role " + assignedRoleInDB.getRoleName() + " from group "
                                + assignedRoleInDB.getGroupNamePath() + " is reverted by Manager "
                                + userInDB.get().getDisplayName());
                        logs.setCreationDate(new Date());
                        logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                        logs.setUserRequest(userRequestInDB);

                        HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                        userRequestInDB.getHistoryLogList().add(savedHistoryLog);

                        assignedRoleInDB.setDeleted(false);
                        assignedRoleRepository.save(assignedRoleInDB);
                        savedUserRequest = managerRepository.save(userRequestInDB);
                    }
                } else {
                    if (userInDB.isPresent()) {
                        String message = "Added already existing role " + assignedRoleInDB.getRoleName() + " from group "
                                + assignedRoleInDB.getGroupNamePath() + " for deletion by Manager "
                                + userInDB.get().getDisplayName();
                        HistoryLog logs = new HistoryLog();
                        logs.setComments(message);
                        logs.setCreationDate(new Date());
                        logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                        logs.setUserRequest(userRequestInDB);

                        HistoryLog savedHistoryLog = historyLogRepository.save(logs);
                        userRequestInDB.getHistoryLogList().add(savedHistoryLog);

                        assignedRoleInDB.setDeleted(true);
                        assignedRoleRepository.save(assignedRoleInDB);
                        savedUserRequest = managerRepository.save(userRequestInDB);
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
    public ManagerResponse getAllRequestForManager(String gid) {
        try {
            List<UserRequest> userRequestSelfList = managerRepository.getRequestForSelf(gid);
            List<UserRequest> userRequestOtherList = managerRepository.getRequestForOther(gid);

            List<UserRequest> userRequestFormAll = new ArrayList<>();
            userRequestFormAll.addAll(userRequestSelfList);
            userRequestFormAll.addAll(userRequestOtherList);

            List<UserRequest> openList = userRequestFormAll
                    .stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Created))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            List<UserRequest> approvedList = userRequestFormAll
                    .stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            List<UserRequest> rejectedList = userRequestFormAll
                    .stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Rejected_By_Cost_Manager))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            managerResponse.setOpenRequests(openList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            managerResponse.setApprovedRequests(approvedList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            managerResponse.setRejectedRequests(rejectedList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            return managerResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
