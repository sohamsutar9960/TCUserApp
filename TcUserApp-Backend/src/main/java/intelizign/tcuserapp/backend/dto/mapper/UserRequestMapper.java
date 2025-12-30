package intelizign.tcuserapp.backend.dto.mapper;

import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserRequestMapper {

    public UserRequestResponse toUserRequestResponse(UserRequest userRequest) {

        if (userRequest == null) {
            return null;
        }

        UserRequestResponse userRequestResponse = new UserRequestResponse();

        userRequestResponse.setAccountDeactivate(userRequest.getAccountDeactivate());
        userRequestResponse.setAssignedRoles(toAssignedRolesList(userRequest.getAssignedRoles()));
        userRequestResponse.setCancellationComment(userRequest.getCancellationComment());
        userRequestResponse.setCommentsForApprover(userRequest.getCommentsForApprover());
        userRequestResponse.setDefaultGroup(userRequest.getDefaultGroup());

        userRequestResponse.setCostApproverComments(userRequest.getCostApproverComments());
        userRequestResponse.setCostApproverDate(userRequest.getCostApproverDate());
        userRequestResponse.setCostManagerForAnother(toSCDUser(userRequest.getCostManagerForAnother()));
        userRequestResponse.setCostManagerSelf(toSCDUser(userRequest.getCostManagerSelf()));

        userRequestResponse.setCountry(toCountry(userRequest.getCountry()));
        userRequestResponse.setCreationDate(userRequest.getCreationDate());
        userRequestResponse.setGroupRoleApproverComments(userRequest.getGroupRoleApproverComments());
        userRequestResponse.setGroupRoleApproverDate(userRequest.getGroupRoleApproverDate());

        userRequestResponse.setHistoryLogList(toHistoryLogList(userRequest.getHistoryLogList()));
        userRequestResponse.setIpClearance(userRequest.getIpClearance());
        userRequestResponse.setNeverLock(userRequest.getNeverLock());
        userRequestResponse.setReasonForCancellation(userRequest.getReasonForCancellation());

        userRequestResponse.setRequestId(userRequest.getRequestId());
        userRequestResponse.setRequestStatus(userRequest.getRequestStatus());
        userRequestResponse.setService(toService(userRequest.getService()));
        userRequestResponse.setSystem(toSystem(userRequest.getSystem()));
        userRequestResponse.setVolume(toVolume(userRequest.getVolume()));

        userRequestResponse.setTcAccountType(userRequest.getTcAccountType());
        userRequestResponse.setRequestLicensingLevel(userRequest.getRequestLicensingLevel());
        userRequestResponse.setTcOSUserName(userRequest.getTcOSUserName());
        userRequestResponse.setUserHistory(toUserHistory(userRequest.getUserHistory()));
        userRequestResponse.setUserRequest_TypeOfRequest(userRequest.getUserRequest_TypeOfRequest());

        userRequestResponse.setUserRequestForAnother(toSCDUser(userRequest.getUserRequestForAnother()));
        userRequestResponse.setUserRequestSelf(toSCDUser(userRequest.getUserRequestSelf()));

        userRequestResponse.setCreatedBy(toCreatedBy(userRequest.getUser()));

        return userRequestResponse;
    }

    private User toCreatedBy(User user) {

        if (user == null)
            return null;

        User newCreatedBy = new User();

        newCreatedBy.setFullName(user.getFullName());
        newCreatedBy.setFirstName(user.getFirstName());
        newCreatedBy.setLastName(user.getLastName());
        newCreatedBy.setDisplayName(user.getDisplayName());

        newCreatedBy.setLineManager(user.getLineManager());
        newCreatedBy.setSponsor(user.getSponsor());
        newCreatedBy.setDepartment(user.getDepartment());
        newCreatedBy.setOrganization(user.getOrganization());
        newCreatedBy.setOrganizationID(user.getOrganizationID());

        newCreatedBy.setCountry(user.getCountry());
        newCreatedBy.setMobileNumber(user.getMobileNumber());
        newCreatedBy.setUsername(user.getUsername());
        newCreatedBy.setEmail(user.getEmail());
        newCreatedBy.setGID(user.getGID());
        return newCreatedBy;
    }

    private Volume toVolume(Volume volume) {

        if (volume == null)
            return null;

        Volume newVolume = new Volume();
        newVolume.setVolumeId(volume.getVolumeId());
        newVolume.setVolumeName(volume.getVolumeName());
        return newVolume;
    }

    private UserHistory toUserHistory(UserHistory userHistory) {

        if (userHistory == null)
            return null;

        UserHistory newUserHistory = new UserHistory();
        newUserHistory.setGID(userHistory.getGID());
        newUserHistory.setNeverLock(userHistory.getNeverLock());
        newUserHistory.setRequestStatus(userHistory.getRequestStatus());
        newUserHistory.setSystemName(userHistory.getSystemName());
        newUserHistory.setTcAccountType(userHistory.getTcAccountType());
        newUserHistory.setTcCreated(userHistory.getTcCreated());
        newUserHistory.setTcUserId(userHistory.getTcUserId());
        newUserHistory.setUserHistoryId(userHistory.getUserHistoryId());
        newUserHistory.setUserStatus(userHistory.getUserStatus());

        return newUserHistory;
    }

    private System toSystem(System system) {

        if (system == null)
            return null;

        System newSystem = new System();
        newSystem.setSystemId(system.getSystemId());
        newSystem.setSystemName(system.getSystemName());

        return newSystem;
    }

    private Service toService(Service service) {

        if (service == null)
            return null;

        Service newService = new Service();
        newService.setServiceId(service.getServiceId());
        newService.setServiceName(service.getServiceName());

        return newService;
    }

    private List<HistoryLog> toHistoryLogList(List<HistoryLog> historyLogList) {
        return historyLogList
                .stream()
                .map(this::toHistoryLog)
                .collect(Collectors.toList());
    }

    private Country toCountry(Country country) {

        if (country == null)
            return null;

        Country newCountry = new Country();
        newCountry.setCountryCode(country.getCountryCode());
        newCountry.setCountryId(country.getCountryId());
        newCountry.setCountryName(country.getCountryName());
        return newCountry;
    }

    private SCDUser toSCDUser(SCDUser scdUser) {

        if (scdUser == null)
            return null;

        SCDUser newSCDUser = new SCDUser();

        newSCDUser.setCountry(scdUser.getCountry());
        newSCDUser.setDepartment(scdUser.getDepartment());
        newSCDUser.setDisplayName(scdUser.getDisplayName());
        newSCDUser.setEmail(scdUser.getEmail());

        newSCDUser.setFirstName(scdUser.getFirstName());
        newSCDUser.setFullName(scdUser.getFullName());
        newSCDUser.setGID(scdUser.getGID());
        newSCDUser.setLastName(scdUser.getLastName());

        newSCDUser.setLineManager(scdUser.getLineManager());
        newSCDUser.setMobileNumber(scdUser.getMobileNumber());
        newSCDUser.setOrganization(scdUser.getOrganization());
        newSCDUser.setOrganizationID(scdUser.getOrganizationID());

        newSCDUser.setScdUserId(scdUser.getScdUserId());
        newSCDUser.setSponsor(scdUser.getSponsor());

        return newSCDUser;
    }

    private List<AssignedRole> toAssignedRolesList(List<AssignedRole> assignedRoles) {
        return assignedRoles
                .stream()
                .map(this::toAssignRole)
                .collect(Collectors.toList());
    }

    private AssignedRole toAssignRole(AssignedRole assignedRole) {

        if (assignedRole == null) {
            return null;
        }

        AssignedRole newAssignedRole = new AssignedRole();
        newAssignedRole.setIsAssigned(assignedRole.getIsAssigned());
        newAssignedRole.setAssignedRole_Status(assignedRole.getAssignedRole_Status());
        newAssignedRole.setAssignedRoleId(assignedRole.getAssignedRoleId());
        newAssignedRole.setDeleted(assignedRole.isDeleted());
        newAssignedRole.setGroupName(assignedRole.getGroupName());
        newAssignedRole.setGroupNamePath(assignedRole.getGroupNamePath());
        newAssignedRole.setRoleName(assignedRole.getRoleName());
        newAssignedRole.setSystemName(assignedRole.getSystemName());

        return newAssignedRole;

    }

    private HistoryLog toHistoryLog(HistoryLog historyLog) {

        if (historyLog == null)
            return null;

        HistoryLog newHistoryLog = new HistoryLog();
        newHistoryLog.setComments(historyLog.getComments());
        newHistoryLog.setCreationDate(historyLog.getCreationDate());
        newHistoryLog.setHistoryId(historyLog.getHistoryId());
        newHistoryLog.setHistoryLogActionMode(historyLog.getHistoryLogActionMode());

        return newHistoryLog;
    }

}
