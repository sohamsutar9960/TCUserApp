package intelizign.tcuserapp.backend.service.myRequest.impl;

import intelizign.tcuserapp.backend.dto.MyRequestResponse;
import intelizign.tcuserapp.backend.dto.SCDRestResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.dto.mapper.UserRequestMapper;
import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.repository.admin.SCDUserRepository;
import intelizign.tcuserapp.backend.repository.admin.UserHistoryRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.createRequest.HistoryLogRepository;
import intelizign.tcuserapp.backend.repository.myRequest.MyRequestRepository;
import intelizign.tcuserapp.backend.service.myRequest.MyRequestService;
import intelizign.tcuserapp.backend.service.rest.SCDRestService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MyRequestServiceImpl implements MyRequestService {

    @Autowired
    MyRequestRepository myRequestRepository;

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    UserRequestMapper userRequestMapper;

    @Autowired
    SCDRestService scdRestService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    SCDUserRepository scdUserRepository;

    @Autowired
    MyRequestResponse myRequestResponse;

    @Autowired
    HistoryLogRepository historyLogRepository;

    @Autowired
    UserRepository userRepository;

    private final Logger logger = LoggerFactory.getLogger(MyRequestServiceImpl.class);

    @Override
    public UserRequestResponse getUserRequestByID(Long requestId) {
        try {
            UserRequest userRequestInDB = myRequestRepository
                    .findById(requestId).orElseThrow(() -> new ResourceNotFoundException("No user request found with requestId " + requestId));
            return userRequestMapper.toUserRequestResponse(userRequestInDB);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRequestResponse cancelUserRequest(UserRequest userRequest) {
        try {
            UserRequest userRequestInDB = myRequestRepository.findById(userRequest.getRequestId()).orElseThrow(() -> new ResourceNotFoundException("No user request found with requestId " + userRequest.getRequestId()));
            String userName = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> userInDB = userRepository.findByUsername(userName);

            String displayName = "";
            if (userInDB.isPresent())
                displayName = userInDB.get().getDisplayName();

            userRequestInDB.setCancellationComment(userRequest.getCancellationComment());
            userRequestInDB.setReasonForCancellation(userRequest.getReasonForCancellation());
            userRequestInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Request_Cancelled);

            HistoryLog logs = new HistoryLog();
            logs.setComments("User Request Cancelled By " + displayName);
            logs.setCreationDate(new Date());
            logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
            logs.setUserRequest(userRequestInDB);
            HistoryLog savedHistoryLog = historyLogRepository.save(logs);
            userRequestInDB.getHistoryLogList().add(savedHistoryLog);

            if (userRequestInDB.getUserHistory() != null) {
                UserHistory userHistoryInDB = userHistoryRepository
                        .findById(userRequestInDB
                                .getUserHistory()
                                .getUserHistoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId " + userRequest.getUserHistory().getUserHistoryId()));

                if (!userHistoryInDB.getTcCreated()) {
                    userHistoryInDB.getUserRequests().remove(userRequestInDB);
                    userRequestInDB.setUserHistory(null);
                    userHistoryRepository.delete(userHistoryInDB);
                } else {
                    userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);
                    userHistoryRepository.save(userHistoryInDB);
                }
            }
            UserRequest savedUserRequest = myRequestRepository.save(userRequestInDB);
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
    public MyRequestResponse createdByMeUserRequest(String gid) {
        try {
            List<UserRequest> userRequestList = myRequestRepository.getAllCreatedByMeRequests(gid);

            List<UserRequest> openList = userRequestList.stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Created) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Approved_By_GroupRole_Approver))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            myRequestResponse.setOpenRequests(openList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));

            List<UserRequest> closeList = userRequestList.stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Cancelled) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Rejected_By_Cost_Manager) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Rejected_By_GroupRole_Approver) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Exported_To_Target_System))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            myRequestResponse.setCloseRequests(closeList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            return myRequestResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public MyRequestResponse createdForMeUserRequest(String gid) {
        try {
            List<UserRequest> userRequestList = myRequestRepository.getAllCreatedForMeRequests(gid);

            List<UserRequest> openList = userRequestList.stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Created) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Approved_By_Cost_Manager) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Approved_By_GroupRole_Approver))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            myRequestResponse.setOpenRequests(openList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));

            List<UserRequest> closeList = userRequestList.stream()
                    .filter(userRequest -> userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Cancelled) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Rejected_By_Cost_Manager) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Rejected_By_GroupRole_Approver) ||
                            userRequest.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Exported_To_Target_System))
                    .sorted(Comparator.comparing(UserRequest::getRequestId).reversed())
                    .toList();

            myRequestResponse.setCloseRequests(closeList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList()));
            return myRequestResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRequestResponse changeManagerForUserRequest(UserRequest userRequest) {
        try {
            UserRequest userRequestInDB = myRequestRepository.findById(userRequest.getRequestId()).orElseThrow(() -> new ResourceNotFoundException("No user request found with requestId " + userRequest.getRequestId()));
            String newGID, oldGID;

            HistoryLog logs1 = new HistoryLog();
            if (userRequestInDB.getCostManagerSelf() != null) {
                oldGID = userRequestInDB.getCostManagerSelf().getGID();
                logs1.setComments("Removed old cost manager called " + userRequestInDB.getCostManagerSelf().getDisplayName());
                logs1.setCreationDate(new Date());
                logs1.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs1.setUserRequest(userRequestInDB);
            } else {
                oldGID = userRequestInDB.getCostManagerForAnother().getGID();
                logs1.setComments("Removed old cost manager called " + userRequestInDB.getCostManagerForAnother().getDisplayName());
                logs1.setCreationDate(new Date());
                logs1.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs1.setUserRequest(userRequestInDB);
            }

            newGID = userRequest.getCostManagerForAnother().getGID().trim();

            if (oldGID.equalsIgnoreCase(newGID)) {
                throw new DuplicateResourceException("Both cost manager are same.!");
            }

            HistoryLog savedHistoryLog = historyLogRepository.save(logs1);
            userRequestInDB.getHistoryLogList().add(savedHistoryLog);

            HistoryLog logs2 = new HistoryLog();
            if (scdUserRepository.findBygID(newGID).isPresent()) {
                SCDUser newCostManager = scdUserRepository.findBygID(newGID).get();
                userRequestInDB.setCostManagerForAnother(newCostManager);
                userRequestInDB.setCostManagerSelf(null);

                logs2.setComments("Assigned new manager called " + newCostManager.getDisplayName());
                logs2.setCreationDate(new Date());
                logs2.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs2.setUserRequest(userRequestInDB);

                HistoryLog savedHistoryLog1 = historyLogRepository.save(logs2);
                userRequestInDB.getHistoryLogList().add(savedHistoryLog1);

                UserRequest savedUserRequest = myRequestRepository.save(userRequestInDB);
                return userRequestMapper.toUserRequestResponse(savedUserRequest);
            } else {
                SCDRestResponse scdRestResponse = scdRestService.getDataFromSCDAPI(newGID);
                if (scdRestResponse == null) {
                    throw new ResourceNotFoundException("Unable to retrieve new manager details from SCD");
                }
                SCDUser scdUser = new SCDUser();
                modelMapper.map(scdRestResponse, scdUser);
                SCDUser savedScdUser = scdUserRepository.save(scdUser);
                userRequestInDB.setCostManagerForAnother(savedScdUser);
                userRequestInDB.setCostManagerSelf(null);

                logs2.setComments("Assigned new manager called " + savedScdUser.getDisplayName());
                logs2.setCreationDate(new Date());
                logs2.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Change);
                logs2.setUserRequest(userRequestInDB);

                HistoryLog savedHistoryLog1 = historyLogRepository.save(logs2);
                userRequestInDB.getHistoryLogList().add(savedHistoryLog1);

                UserRequest savedUserRequest = myRequestRepository.save(userRequestInDB);
                return userRequestMapper.toUserRequestResponse(savedUserRequest);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
