package intelizign.tcuserapp.backend.service.createRequest.impl;

import intelizign.tcuserapp.backend.dto.SCDRestResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.dto.mapper.UserRequestMapper;
import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.repository.admin.*;
import intelizign.tcuserapp.backend.repository.createRequest.AssignedRoleRepository;
import intelizign.tcuserapp.backend.repository.createRequest.CreateRequestRepository;
import intelizign.tcuserapp.backend.repository.createRequest.HistoryLogRepository;
import intelizign.tcuserapp.backend.service.createRequest.CreateRequestService;
import intelizign.tcuserapp.backend.service.rest.SCDRestService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class CreateRequestServiceImpl implements CreateRequestService {

    @Autowired
    CreateRequestRepository createRequestRepository;

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    SCDUserRepository scdUserRepository;

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    VolumeRepository volumeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AssignedRoleRepository assignedRoleRepository;

    @Autowired
    HistoryLogRepository historyLogRepository;

    @Autowired
    UserRequestMapper userRequestMapper;

    @Autowired
    SCDRestService scdService;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(CreateRequestServiceImpl.class);

    @Override
    public List<UserRequestResponse> getAllUserRequest() {
        try {
            List<UserRequest> userRequestList = createRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "requestId"));
            return userRequestList.stream().map(userRequestMapper::toUserRequestResponse).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserRequestResponse createUserRequest(UserRequest userRequest) {
        try {
            Service serviceInDB = serviceRepository.findById(userRequest.getService().getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No service found with serviceId " + userRequest.getService().getServiceId()));
            userRequest.setService(serviceInDB);

            System systemInDB = systemRepository.findById(userRequest.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + userRequest.getSystem().getSystemId()));
            userRequest.setSystem(systemInDB);

            Volume volumeInDB = volumeRepository.findById(userRequest.getVolume().getVolumeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No volume found with volumeId " + userRequest.getVolume().getVolumeId()));
            userRequest.setVolume(volumeInDB);

            Country countryInDB = countryRepository.findById(userRequest.getCountry().getCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No country found with countryId " + userRequest.getCountry().getCountryId()));
            userRequest.setCountry(countryInDB);

            // Start - Assigning SCD User and Manager for UserRequest
            SCDUser requestedUser = null;
            SCDUser assignedManager;

            if (userRequest.getUserRequestSelf() != null) {
                if (scdUserRepository.findBygID(userRequest.getUserRequestSelf().getGID()).isPresent()) {
                    requestedUser = scdUserRepository.findBygID(userRequest.getUserRequestSelf().getGID()).get();
                    userRequest.setUserRequestSelf(requestedUser);
                } else {
                    SCDRestResponse scdRestResponse = scdService
                            .getDataFromSCDAPI(userRequest.getUserRequestSelf().getGID().trim());

                    SCDUser scdUser = new SCDUser();
                    modelMapper.map(scdRestResponse, scdUser);
                    SCDUser savedScdUser = scdUserRepository.save(scdUser);
                    userRequest.setUserRequestSelf(savedScdUser);
                }
            } else {
                if (scdUserRepository.findBygID(userRequest.getUserRequestForAnother().getGID()).isPresent()) {
                    requestedUser = scdUserRepository.findBygID(userRequest.getUserRequestForAnother().getGID()).get();
                    userRequest.setUserRequestForAnother(requestedUser);
                } else {
                    SCDRestResponse scdRestResponse = scdService
                            .getDataFromSCDAPI(userRequest.getUserRequestForAnother().getGID().trim());

                    SCDUser scdUser = new SCDUser();
                    modelMapper.map(scdRestResponse, scdUser);
                    SCDUser savedScdUser = scdUserRepository.save(scdUser);
                    userRequest.setUserRequestForAnother(savedScdUser);
                }
            }

            if (userRequest.getCostManagerSelf() != null) {
                if (scdUserRepository.findBygID(userRequest.getCostManagerSelf().getGID()).isPresent()) {
                    assignedManager = scdUserRepository.findBygID(userRequest.getCostManagerSelf().getGID()).get();
                    userRequest.setCostManagerSelf(assignedManager);
                } else {
                    SCDRestResponse scdRestResponse = scdService
                            .getDataFromSCDAPI(userRequest.getCostManagerSelf().getGID().trim());

                    SCDUser scdUser = new SCDUser();
                    modelMapper.map(scdRestResponse, scdUser);
                    SCDUser savedScdManager = scdUserRepository.save(scdUser);
                    userRequest.setCostManagerSelf(savedScdManager);
                }
            } else {
                if (scdUserRepository.findBygID(userRequest.getCostManagerForAnother().getGID()).isPresent()) {
                    assignedManager = scdUserRepository.findBygID(userRequest.getCostManagerForAnother().getGID()).get();
                    userRequest.setCostManagerForAnother(assignedManager);
                } else {
                    SCDRestResponse scdRestResponse = scdService
                            .getDataFromSCDAPI(userRequest.getCostManagerForAnother().getGID().trim());

                    SCDUser scdUser = new SCDUser();
                    modelMapper.map(scdRestResponse, scdUser);
                    SCDUser savedScdManager = scdUserRepository.save(scdUser);
                    userRequest.setCostManagerForAnother(savedScdManager);
                }
            }
            // End - Assigning SCD User and Manager for UserRequest

            // Start - Creating user history
            if (userRequest.getUserHistory() != null) {
                creationOfUserHistory(userRequest);
            }
            // End - Creating user history

            // Start - Created By
            String userName = SecurityContextHolder.getContext().getAuthentication().getName().trim();
            Optional<User> user = userRepository.findByUsername(userName);
            userRequest.setUser(user.orElse(null));
            // End - Created By

            // Start - Updating assigned role with user request
            List<AssignedRole> assignedRoleList = new ArrayList<>(userRequest.getAssignedRoles());

            userRequest.setCreationDate(new Date());
            userRequest.setRequestStatus(ENUM_UserRequest_RequestStatus.Request_Created);
            UserRequest savedUserRequest = createRequestRepository.save(userRequest);

            for (AssignedRole assignedRole : assignedRoleList) {
                assignedRole.setUserRequest(savedUserRequest);
            }
            assignedRoleRepository.saveAll(assignedRoleList);
            // End - Updating assigned role with user request

            // Start - Creating history logs with UserRequest
            HistoryLog logs = new HistoryLog();
            logs.setComments(
                    "New user request created by " + user.get().getDisplayName());
            logs.setCreationDate(new Date());
            logs.setHistoryLogActionMode(ENUM_HistoryLog_ActionMode.Create);
            logs.setUserRequest(savedUserRequest);
            List<HistoryLog> historyLogs = new ArrayList<>();
            historyLogs.add(logs);
            savedUserRequest.setHistoryLogList(historyLogs);
            historyLogRepository.save(logs);
            // End - Creating history logs with UserRequest

            return userRequestMapper.toUserRequestResponse(savedUserRequest);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    private void creationOfUserHistory(UserRequest userRequest) {
        UserHistory userHistoryInDB;

        if (userRequest.getUserHistory().getUserHistoryId() != null) {
            userHistoryInDB = userHistoryRepository.findById(userRequest.getUserHistory().getUserHistoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("No user history found with historyId "
                            + userRequest.getUserHistory().getUserHistoryId()));

            userHistoryInDB.setRequestStatus(ENUM_UserRequest_RequestStatus.Request_Created);
            userHistoryInDB.setNeverLock(userRequest.getUserHistory().getNeverLock());
            userHistoryInDB.setSystemName(userRequest.getSystem().getSystemName());
            userHistoryInDB.getUserRequests().add(userRequest);
            userHistoryRepository.save(userHistoryInDB);
        } else {
            List<UserRequest> userRequests = new ArrayList<>();
            userRequests.add(userRequest);
            userRequest.getUserHistory().setUserRequests(userRequests);
            userRequest.getUserHistory().setSystemName(userRequest.getSystem().getSystemName());
            userHistoryRepository.save(userRequest.getUserHistory());
        }
    }

    @Override
    public List<UserRequestResponse> getSearchedUserRequest(UserRequest userRequestSearch) {
        try {
            List<UserRequest> userRequestInDB = createRequestRepository.findByAttributes(userRequestSearch);
            if (userRequestInDB != null) {
                return userRequestInDB
                        .stream()
                        .map(userRequestMapper::toUserRequestResponse)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return List.of();
    }
}
