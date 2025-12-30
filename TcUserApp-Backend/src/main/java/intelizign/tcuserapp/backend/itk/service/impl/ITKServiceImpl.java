package intelizign.tcuserapp.backend.itk.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.dto.TCConfigResponse;
import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_TCAccountType;
import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_UserStatus;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.exception.TeamcenterException;
import intelizign.tcuserapp.backend.itk.dto.TCAllUserResponse;
import intelizign.tcuserapp.backend.itk.dto.TCGroupAndRoleResponse;
import intelizign.tcuserapp.backend.itk.dto.TCLoginResponse;
import intelizign.tcuserapp.backend.itk.dto.TCUserGroupAndRoleResponse;
import intelizign.tcuserapp.backend.itk.model.Role;
import intelizign.tcuserapp.backend.itk.model.*;
import intelizign.tcuserapp.backend.itk.service.ITKService;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.model.requestModel.UserModel;
import intelizign.tcuserapp.backend.repository.admin.GroupRepository;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.repository.admin.UserHistoryRepository;
import intelizign.tcuserapp.backend.service.admin.TCConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class ITKServiceImpl implements ITKService {

    @Autowired
    TCConfigurationService tcConfigurationService;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    Credentials credentials;

    @Autowired
    LoginBody loginBody;

    @Autowired
    State state;

    @Autowired
    Policy policy;

    @Autowired
    Header header;

    @Autowired
    TeamcenterLoginModel teamcenterLoginModel;

    @Autowired
    TCLoginResponse tcLoginResponse;

    @Autowired
    TeamcenterUserGroupAndRoleModel teamcenterUserGroupAndRoleModel;

    @Autowired
    UserIdBody userIdBody;

    @Autowired
    TCUserGroupAndRoleResponse tcUserGroupAndRoleResponse;

    @Autowired
    AllUserModel allUserModel;

    @Autowired
    UserStatusModel userStatusModel;

    @Autowired
    UserStatusBody userStatusBody;

    @Autowired
    OraganizationModel oraganizationModel;

    @Autowired
    OrganizationBody organizationBody;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    TeamcenterUserCreationModel teamcenterUserCreationModel;

    @Autowired
    TCBody tcBody;

    private final Logger logger = LoggerFactory.getLogger(ITKServiceImpl.class);

    @Override
    public TCLoginResponse teamcenterLogin(Long systemId) throws InvalidCredentialsException {
        try {
            System systemInDB = systemRepository.findById(systemId).orElseThrow(() -> new ResourceNotFoundException("No system found with systemId " + systemId));

            TCConfigResponse tcConfigResponse = tcConfigurationService.getAllTCConfigurationFromSystem(systemId);
            if (tcConfigResponse == null) throw new ResourceNotFoundException("No teamcenter configuration found.");

            String tcUrl = tcConfigResponse.getTcURL() + "/JsonRestServices/Core-2011-06-Session/login";

            // Set the headers
            HttpHeaders loginHeaders = new HttpHeaders();
            loginHeaders.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            // Request body creation
            credentials.setUser(tcConfigResponse.getUserName().trim());
            credentials.setPassword(tcConfigResponse.getPassword().trim());
            credentials.setGroup("");
            credentials.setRole("");
            credentials.setLocale("");
            credentials.setDescrimator("");
            loginBody.setCredentials(credentials);
            header.setPolicy(policy);
            header.setState(state);
            teamcenterLoginModel.setHeader(header);
            teamcenterLoginModel.setBody(loginBody);

            ObjectMapper objectMapper = new ObjectMapper();
            String loginJson = objectMapper.writeValueAsString(teamcenterLoginModel);

            // Create the request entity
            HttpEntity<String> loginRequest = new HttpEntity<>(loginJson, loginHeaders);

            // Invoke login
            ResponseEntity<String> loginResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, loginRequest, String.class);

            if (loginResponse.getBody() != null && loginResponse.getBody().contains("InvalidCredentialsException")) {
                throw new InvalidCredentialsException("The login attempt failed: either the user ID or the password is invalid.");
            }

            tcLoginResponse.setResponseEntity(loginResponse);
            tcLoginResponse.setTcUrl(tcConfigResponse.getTcURL());
            tcLoginResponse.setSystem(systemInDB);
            return tcLoginResponse;
        } catch (InvalidCredentialsException | ResourceNotFoundException | ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public TCUserGroupAndRoleResponse findUserGroupAndRole(String tcUserId, Boolean isTemplate, TCLoginResponse tcLoginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/getGroupsAndRolesDataForUser";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders roleHeaders = new HttpHeaders();
            roleHeaders.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) roleHeaders.add("Cookie", "");
            else roleHeaders.add("Cookie", cookieList.get(0));

            // Request body creation
            userIdBody.setUserId(tcUserId);
            teamcenterUserGroupAndRoleModel.setUserIdBody(userIdBody);
            teamcenterUserGroupAndRoleModel.setHeader(header);

            ObjectMapper objectMapper = new ObjectMapper();
            String userIdJson = objectMapper.writeValueAsString(teamcenterUserGroupAndRoleModel);

            // Create the request entity
            HttpEntity<String> userIdRequest = new HttpEntity<>(userIdJson, roleHeaders);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, userIdRequest, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());

            if (itkResponse.getBody().getOutputString() == null || itkResponse.getBody().getOutputString().isEmpty())
                return tcUserGroupAndRoleResponse;

            TypeReference<List<GetGroupAndRole>> jacksonTypeReference = new TypeReference<>() {
            };

            List<GetGroupAndRole> groupAndRoles = objectMapper.readValue(itkResponse.getBody().getOutputString(), jacksonTypeReference);

            if (!groupAndRoles.isEmpty()) {
                List<TCGroupAndRoleResponse> tcGroupAndRoleResponses = new ArrayList<>();
                List<TeamcenterGroup> teamcenterGroups = groupAndRoles.get(0).getTeamcenterGroup();

                for (TeamcenterGroup teamcenterGroup : teamcenterGroups) {
                    List<String> teamcenterRoles = teamcenterGroup.getExistingRoles().stream().map(ExistingRole::getRoleName).toList();

                    for (String roleName : teamcenterRoles) {
                        TCGroupAndRoleResponse tcGroupAndRoleResponse = new TCGroupAndRoleResponse();
                        tcGroupAndRoleResponse.setGroupName(teamcenterGroup.getGroupName());
                        tcGroupAndRoleResponse.setRoleName(roleName);
                        tcGroupAndRoleResponse.setGroupNamePath(teamcenterGroup.getGroupNamePath());

                        if (isTemplate)
                            tcGroupAndRoleResponse.setStatus(ENUM_AssignedRole_Status.Newly_Added.toString());
                        else tcGroupAndRoleResponse.setStatus(ENUM_AssignedRole_Status.Already_Existing.toString());

                        tcGroupAndRoleResponse.setIsDeleted(false);
                        tcGroupAndRoleResponses.add(tcGroupAndRoleResponse);
                    }
                }

                tcUserGroupAndRoleResponse.setTcGroupAndRoleResponses(tcGroupAndRoleResponses);
                TeamcenterPerson tcPerson = groupAndRoles.get(0).getTeamcenterPerson();
                TeamcenterUser tcUser = groupAndRoles.get(0).getTeamcenterUser();

                tcUserGroupAndRoleResponse.setDefaultGroup(tcUser.getDefaultGroup());
                tcUserGroupAndRoleResponse.setLastLoginDate(tcUser.getLastLoginDate());
                tcUserGroupAndRoleResponse.setPersonName(tcPerson.getPersonName());
                tcUserGroupAndRoleResponse.setOsUserName(tcUser.getOsUserName());
                tcUserGroupAndRoleResponse.setCountry(tcUser.getGeography());
                tcUserGroupAndRoleResponse.setDefaultVolume(tcUser.getDefaultVolume());
                tcUserGroupAndRoleResponse.setLicensingLevel(tcUser.getLicensingLevel());
                tcUserGroupAndRoleResponse.setIpClerance(tcUser.getIpClearance());
            }
            return tcUserGroupAndRoleResponse;
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<TCAllUserResponse> findAllTeamcenterUser(Long systemId, TCLoginResponse tcLoginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/getUsersData";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) userHeaders.add("Cookie", "");
            else userHeaders.add("Cookie", cookieList.get(0));

            // Request body creation
            allUserModel.setHeader(header);

            ObjectMapper objectMapper = new ObjectMapper();
            String userIdJson = objectMapper.writeValueAsString(allUserModel);

            // Create the request entity
            HttpEntity<String> allUserRequest = new HttpEntity<>(userIdJson, userHeaders);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, allUserRequest, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());

            if (itkResponse.getBody().getOutputString() == null || itkResponse.getBody().getOutputString().isEmpty())
                return List.of();

            TypeReference<AllUserData> jacksonTypeReference = new TypeReference<>() {
            };

            AllUserData allUserData = objectMapper.readValue(itkResponse.getBody().getOutputString(), jacksonTypeReference);

            List<TCAllUserResponse> tcAllUserResponses = new ArrayList<>();
            if (allUserData != null) {
                if (allUserData.getAllTeamcenterUsers().isEmpty()) {
                    return List.of();
                } else {
                    for (AllTeamcenterUsers allTeamcenterUsers : allUserData.getAllTeamcenterUsers()) {
                        TCAllUserResponse tcAllUserResponse = getTcUserResponse(allTeamcenterUsers);
                        tcAllUserResponses.add(tcAllUserResponse);
                    }
                }
            }
            return tcAllUserResponses;
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return List.of();
    }

    @Override
    public void findAllGroupAndRole(String groupName, TCLoginResponse tcLoginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/getGroupsAndRolesData";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) headers.add("Cookie", "");
            else headers.add("Cookie", cookieList.get(0));

            // Request body creation
            oraganizationModel.setHeader(header);
            organizationBody.setGroupName(groupName);
            oraganizationModel.setOrganizationBody(organizationBody);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(oraganizationModel);

            // Create the request entity
            HttpEntity<String> orgRequest = new HttpEntity<>(jsonBody, headers);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, orgRequest, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());

            if (itkResponse.getBody().getOutputString() == null || itkResponse.getBody().getOutputString().isEmpty())
                return;

            TypeReference<TCOrganization> jacksonTypeReference = new TypeReference<>() {
            };

            TCOrganization tcOrganization = objectMapper.readValue(itkResponse.getBody().getOutputString(), jacksonTypeReference);

            if (tcOrganization != null) {
                List<Organization> organizations = tcOrganization.getOrganization();
                if (!organizations.isEmpty()) {
                    for (Organization organization : organizations) {
                        Group tcGroup = new Group();
                        tcGroup.setGroupName(organization.getGroupName());
                        tcGroup.setGroupNamePath(organization.getGroupPath());
                        tcGroup.setLevel(organization.getLevel());
                        tcGroup.setIsRoot(organization.getRoot().equalsIgnoreCase("true"));
                        tcGroup.setUid(organization.getUid());
                        tcGroup.setDescription("");
                        tcGroup.setDisplayName(organization.getGroupPath());
                        tcGroup.setSystem(tcLoginResponse.getSystem());

                        List<Role> roles = organization.getRoles();
                        if (roles != null) {
                            List<intelizign.tcuserapp.backend.model.Role> tcRoles = new ArrayList<>();

                            for (Role role : roles) {
                                intelizign.tcuserapp.backend.model.Role tcRole = getRole(tcLoginResponse.getSystem(), role, tcGroup);
                                tcRoles.add(tcRole);
                            }
                            tcGroup.setRoles(tcRoles);
                        }

                        List<Group> existingGroups = groupRepository.getGroupsForSystem(tcLoginResponse.getSystem().getSystemId());
                        groupRepository.deleteAll(existingGroups);
                        Group savedGroup = groupRepository.saveAndFlush(tcGroup);

                        List<Group> allNonRootGroups = new LinkedList<>();
                        List<Subgroup> subgroups = organization.getSubgroups();
                        if (!subgroups.isEmpty()) {
                            for (Subgroup subgroup : subgroups) {
                                callingSubgroupCreation(savedGroup, subgroup, allNonRootGroups);
                            }
                        }
                        if (!allNonRootGroups.isEmpty())
                            groupRepository.saveAllAndFlush(allNonRootGroups);
                    }
                }
            }
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public void updateUserStatus(String userId, String userStatus, TCLoginResponse loginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/updateUserStatus";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) headers.add("Cookie", "");
            else headers.add("Cookie", cookieList.get(0));

            // Request body creation
            userStatusBody.setUserId(userId);
            userStatusBody.setUserStatus(Integer.parseInt(userStatus));
            userStatusModel.setHeader(header);
            userStatusModel.setUserStatusBody(userStatusBody);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(userStatusModel);

            // Create the request entity
            HttpEntity<String> userRequest = new HttpEntity<>(jsonBody, headers);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, userRequest, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());

            List<UserHistory> userHistoryList = userHistoryRepository.getUserByTCUserIdAndSystemName(userId, tcLoginResponse.getSystem().getSystemName());

            if (!userHistoryList.isEmpty()) {
                Optional<UserHistory> userHistoryInDB = userHistoryList
                        .stream()
                        .filter(userHistory -> userHistory.getTcUserId().equalsIgnoreCase(userId)
                                && userHistory.getSystemName().equalsIgnoreCase(tcLoginResponse.getSystem()
                                .getSystemName()))
                        .findFirst();
                if (userHistoryInDB.isPresent()) {
                    if (userStatus.equals("1"))
                        userHistoryInDB.get().setUserStatus(ENUM_UserHistory_UserStatus.inactive);
                    else
                        userHistoryInDB.get().setUserStatus(ENUM_UserHistory_UserStatus.active);
                    userHistoryRepository.save(userHistoryInDB.get());
                }
            }
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public void createOrUpdateTCUser(Long systemId, TCLoginResponse tcLoginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/getUsersData";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) userHeaders.add("Cookie", "");
            else userHeaders.add("Cookie", cookieList.get(0));

            // Request body creation
            allUserModel.setHeader(header);

            ObjectMapper objectMapper = new ObjectMapper();
            String userIdJson = objectMapper.writeValueAsString(allUserModel);

            // Create the request entity
            HttpEntity<String> allUserRequest = new HttpEntity<>(userIdJson, userHeaders);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, allUserRequest, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());

            if (itkResponse.getBody().getOutputString() == null || itkResponse.getBody().getOutputString().isEmpty())
                return;

            TypeReference<AllUserData> jacksonTypeReference = new TypeReference<>() {
            };

            AllUserData allUserData = objectMapper.readValue(itkResponse.getBody().getOutputString(), jacksonTypeReference);

            if (allUserData != null && !allUserData.getAllTeamcenterUsers().isEmpty()) {
                List<UserHistory> newUserHistoryList = new ArrayList<>();
                List<UserHistory> userHistoryListInDB = userHistoryRepository.findBySystemName(tcLoginResponse.getSystem().getSystemName());

                for (AllTeamcenterUsers teamcenterUsers : allUserData.getAllTeamcenterUsers()) {
                    TeamcenterUser tcUser = teamcenterUsers.getTeamcenterUser();

                    UserHistory userHistoryInDB = userHistoryListInDB
                            .stream()
                            .filter(userHistory -> userHistory.getTcUserId().equals(tcUser.getUserId()))
                            .findFirst()
                            .orElse(null);

                    if (userHistoryInDB != null) {
                        userHistoryInDB
                                .setUserStatus(tcUser.getStatus() == 1 ? ENUM_UserHistory_UserStatus.active : ENUM_UserHistory_UserStatus.inactive);
                        newUserHistoryList.add(userHistoryInDB);
                    } else {
                        UserHistory userHistory = getUserHistory(tcLoginResponse, tcUser);
                        newUserHistoryList.add(userHistory);
                    }
                }
                if (!newUserHistoryList.isEmpty())
                    userHistoryRepository.saveAllAndFlush(newUserHistoryList);
            }
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public void teamcenterUserCreation(Long systemId, UserRequest userRequest, TCLoginResponse tcLoginResponse) {
        try {
            String tcUrl = tcLoginResponse.getTcUrl() + "/JsonRestServices/EZAccessManagement-2021-12-EZAccessManagement/maintainUserInfo";

            List<String> cookieList = tcLoginResponse.getResponseEntity().getHeaders().get("Set-Cookie");
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);

            if (cookieList == null || cookieList.isEmpty()) userHeaders.add("Cookie", "");
            else userHeaders.add("Cookie", cookieList.get(0));

            UserModel userModel = new UserModel();

            List<UserModel.Role> assignedRoleList = new ArrayList<>();
            for (AssignedRole assignedRole : userRequest.getAssignedRoles()) {
                UserModel.Role role = new UserModel.Role();
                role.setRoleName(assignedRole.getRoleName());
                role.setRoleStatus(assignedRole.getAssignedRole_Status());
                role.setGroupNamePath(assignedRole.getGroupNamePath());
                role.setIsDeleted(assignedRole.isDeleted());
                assignedRoleList.add(role);
            }

            UserModel.User user = getUser(userRequest);
            user.setAssignedRoles(assignedRoleList);
            userModel.setUsers(List.of(user));

            ObjectMapper objectMapper = new ObjectMapper();
            String outputString = objectMapper.writeValueAsString(userModel);
            java.lang.System.out.println(outputString);

            tcBody.setInputJsonString(outputString);
            teamcenterUserCreationModel.setHeader(header);
            teamcenterUserCreationModel.setBody(tcBody);

            String createUserJson = objectMapper.writeValueAsString(teamcenterUserCreationModel);
            java.lang.System.out.println("createUserJson : " + createUserJson);

            // Create the request entity
            HttpEntity<String> userRequestBody = new HttpEntity<>(createUserJson, userHeaders);

            // Send the request
            ResponseEntity<ITKResponse> itkResponse = restTemplate.exchange(tcUrl, HttpMethod.POST, userRequestBody, ITKResponse.class);

            if (itkResponse.getBody() != null && itkResponse.getBody().getSuccessCode().equals(false))
                throw new TeamcenterException(itkResponse.getBody().getMessage());
            else
                userRequest.setRequestStatus(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);
        } catch (TeamcenterException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private static UserHistory getUserHistory(TCLoginResponse tcLoginResponse, TeamcenterUser tcUser) {
        UserHistory userHistory = new UserHistory();
        userHistory.setUserStatus(tcUser.getStatus() == 0 ? ENUM_UserHistory_UserStatus.active : ENUM_UserHistory_UserStatus.inactive);
        userHistory.setTcCreated(true);
        userHistory.setTcUserId(tcUser.getUserId());
        userHistory.setGID(tcUser.getUserId().toUpperCase());
        userHistory.setSystemName(tcLoginResponse.getSystem().getSystemName());
        userHistory.setTcAccountType(ENUM_UserHistory_TCAccountType.Normal_User);
        userHistory.setNeverLock(false);
        userHistory.setRequestStatus(ENUM_UserRequest_RequestStatus.Exported_To_Target_System);
        return userHistory;
    }

    private static void callingSubgroupCreation(Group parentGroup, Subgroup subgroup, List<Group> allNonRootGroups) {
        Group tcGroup = new Group();
        tcGroup.setGroupName(subgroup.getGroupName());
        tcGroup.setGroupNamePath(subgroup.getGroupPath());
        tcGroup.setLevel(subgroup.getLevel());
        tcGroup.setIsRoot(subgroup.getRoot().equalsIgnoreCase("true"));
        tcGroup.setUid(subgroup.getUid());
        tcGroup.setDescription("");
        tcGroup.setDisplayName(subgroup.getGroupPath());
        tcGroup.setParentGroup(parentGroup);
        tcGroup.setSystem(parentGroup.getSystem());

        List<Role> existingRoles = subgroup.getRoles();
        if (existingRoles != null) {
            List<intelizign.tcuserapp.backend.model.Role> tcRoles = new ArrayList<>();
            for (Role role : existingRoles) {
                intelizign.tcuserapp.backend.model.Role tcRole = getRole(parentGroup.getSystem(), role, tcGroup);
                tcRoles.add(tcRole);
            }
            tcGroup.setRoles(tcRoles);
        }
        allNonRootGroups.add(tcGroup);
        List<Subgroup> childSubgroups = subgroup.getSubgroups();
        if (childSubgroups != null) {
            for (Subgroup childGroup : childSubgroups) {
                callingSubgroupCreation(tcGroup, childGroup, allNonRootGroups);
            }
        }
    }

    private static intelizign.tcuserapp.backend.model.Role getRole(System system, Role role, Group tcGroup) {
        intelizign.tcuserapp.backend.model.Role tcRole = new intelizign.tcuserapp.backend.model.Role();
        tcRole.setRoleName(role.getRoleName());
        tcRole.setDescription("");
        tcRole.setDisplayName(role.getRoleName());
        tcRole.setGroup(tcGroup);
        tcRole.setIsAssigned(false);
        tcRole.setStatus("");
        tcRole.setUid(role.getUid());
        tcRole.setRoleName(role.getRoleName());
        tcRole.setSystem(system);
        return tcRole;
    }

    private static TCAllUserResponse getTcUserResponse(AllTeamcenterUsers allTeamcenterUsers) {
        TeamcenterUser tcUser = allTeamcenterUsers.getTeamcenterUser();
        TCAllUserResponse tcAllUserResponse = new TCAllUserResponse();
        tcAllUserResponse.setUserId(tcUser.getUserId());
        tcAllUserResponse.setStatus(tcUser.getStatus());
        tcAllUserResponse.setPersonName(tcUser.getUserName());
        tcAllUserResponse.setLastLoginDate(tcUser.getLastLoginDate());
        return tcAllUserResponse;
    }

    private static UserModel.User getUser(UserRequest userRequest) {
        UserModel.Person person = getPerson(userRequest);
        UserModel.User user = new UserModel.User();
        user.setUserId(userRequest.getUserHistory().getTcUserId());
        user.setOsUserName(userRequest.getTcOSUserName());
        user.setIpClearance(userRequest.getIpClearance());
        user.setGeography(userRequest.getCountry().getCountryCode());
        user.setVolume(userRequest.getVolume().getVolumeName());
        user.setDefaultGroup(userRequest.getDefaultGroup());
        user.setPassword(userRequest.getUserHistory().getTcUserId());
        user.setPersonName(userRequest.getUserHistory().getTcUserId());
        user.setPerson(person);
        return user;
    }

    private static UserModel.Person getPerson(UserRequest userRequest) {
        UserModel.Person person = new UserModel.Person();
        SCDUser scdUser;
        if (userRequest.getUserRequestSelf() != null)
            scdUser = userRequest.getUserRequestSelf();
        else
            scdUser = userRequest.getUserRequestForAnother();

        person.setPa1Address("");
        person.setPa2City("");
        person.setPa3State("");
        person.setPa4Zipcode("");
        person.setPa5Country(scdUser.getCountry());
        person.setPa6Organisation(scdUser.getOrganization());
        person.setPa7EmployeeNumber(userRequest.getUserHistory().getTcUserId());
        person.setPa8InternalMailCode("");
        person.setPa9Email(scdUser.getEmail());
        person.setPa10Telephone(scdUser.getMobileNumber());
        person.setLocale("");
        return person;
    }
}
