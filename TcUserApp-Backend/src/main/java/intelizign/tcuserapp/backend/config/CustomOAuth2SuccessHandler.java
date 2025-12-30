package intelizign.tcuserapp.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import intelizign.tcuserapp.backend.config.jwt.JwtTokenUtil;
import intelizign.tcuserapp.backend.dto.LoginResponse;
import intelizign.tcuserapp.backend.dto.SCDRestResponse;
import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.*;
import intelizign.tcuserapp.backend.repository.admin.GroupRoleApproverRepository;
import intelizign.tcuserapp.backend.repository.admin.TokenRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRoleRepository;
import intelizign.tcuserapp.backend.repository.createRequest.CreateRequestRepository;
import intelizign.tcuserapp.backend.service.rest.SCDRestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    UserResponse userResponse;

    @Autowired
    GroupRoleApproverRepository groupRoleApproverRepository;

    @Autowired
    SCDRestService scdRestService;

    @Autowired
    CreateRequestRepository createRequestRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    @Value("${react.endpoint}")
    String reactEndpoint;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(CustomOAuth2SuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {
        try {
            if (authentication.isAuthenticated() && authentication instanceof OAuth2AuthenticationToken oAuth2AuthenticationToken) {

                SecurityContextHolder.getContext().setAuthentication(authentication);
                OAuth2User oauth2User = oAuth2AuthenticationToken.getPrincipal();
                String email = oauth2User.getAttribute("preferred_username");
                SCDRestResponse scdRestResponse = scdRestService.getDataFromSCDAPI(email);

                UserRole userRole = null;
                Optional<User> userInDB;

                if (scdRestResponse != null) {

                    List<GroupRoleApprover> groupRoleApproverListInDB = groupRoleApproverRepository.findAll();
                    List<UserRole> userRoleListInDB = userRoleRepository.findAll();
                    List<UserRequest> userRequestListInDB = createRequestRepository.findAll();

                    List<UserRequest> selfCostManagerList = userRequestListInDB
                            .stream()
                            .filter(userRequestInDB -> userRequestInDB.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Created))
                            .filter(userRequestInDB -> userRequestInDB.getCostManagerSelf() != null)
                            .filter(userRequestInDB -> userRequestInDB.getCostManagerSelf().getEmail().equals(scdRestResponse.getEmail()))
                            .toList();

                    List<UserRequest> anotherCostManagerList = userRequestListInDB
                            .stream()
                            .filter(userRequestInDB -> userRequestInDB.getRequestStatus().equals(ENUM_UserRequest_RequestStatus.Request_Created))
                            .filter(userRequestInDB -> userRequestInDB.getCostManagerForAnother() != null)
                            .filter(userRequestInDB -> userRequestInDB.getCostManagerForAnother().getEmail().equals(scdRestResponse.getEmail()))
                            .toList();

                    Optional<GroupRoleApprover> groupRoleApproverInDB = groupRoleApproverListInDB
                            .stream()
                            .filter(groupRoleApprover -> groupRoleApprover.getEmail().equalsIgnoreCase(scdRestResponse.getEmail())
                                    && groupRoleApprover.getIsActive())
                            .findFirst();

                    List<UserRequest> filterUserRequestListInDB = new ArrayList<>();
                    filterUserRequestListInDB.addAll(selfCostManagerList);
                    filterUserRequestListInDB.addAll(anotherCostManagerList);

                    if (groupRoleApproverInDB.isPresent()) {
                        Optional<UserRole> userRoleInDB = userRoleListInDB
                                .stream()
                                .filter(role -> role.getRoleName().equalsIgnoreCase("ROLEAPPROVER"))
                                .findFirst();
                        if (userRoleInDB.isPresent()) {
                            userRole = userRoleInDB.get();
                        }
                    } else if (!filterUserRequestListInDB.isEmpty()) {
                        Optional<UserRole> userRoleInDB = userRoleListInDB
                                .stream()
                                .filter(role -> role.getRoleName().equalsIgnoreCase("MANAGER"))
                                .findFirst();
                        if (userRoleInDB.isPresent()) {
                            userRole = userRoleInDB.get();
                        }
                    } else {
                        Optional<UserRole> userRoleInDB = userRoleListInDB
                                .stream()
                                .filter(role -> role.getRoleName().equalsIgnoreCase("User"))
                                .findFirst();
                        if (userRoleInDB.isPresent()) {
                            userRole = userRoleInDB.get();
                        }
                    }

                    User existingUser = userRepository.getUserByUsername(scdRestResponse.getGid());

                    if (existingUser == null) {
                        User newUser = getUser(scdRestResponse, userRole);
                        User savedUser = userRepository.save(newUser);
                        userInDB = Optional.of(savedUser);
                    } else {
                        existingUser.setUserRole(userRole);
                        User savedUser = userRepository.save(existingUser);
                        userInDB = Optional.of(savedUser);
                    }

                    Map<String, Object> claims = new HashMap<>();
                    userInDB.ifPresent(user -> claims.put("roles", user.getUserRole().getRoleName()));

                    final String jwtToken = jwtTokenUtil.generateToken(claims, userInDB.get().getUsername());
                    final UserDetails userDetails = userDetailsService.loadUserByUsername(userInDB.get().getUsername());
                    String username = jwtTokenUtil.extractUsername(jwtToken);
                    Date expiration = jwtTokenUtil.extractExpiration(jwtToken);

                    List<String> roles = userDetails
                            .getAuthorities()
                            .stream()
                            .map(GrantedAuthority::getAuthority)
                            .toList();

                    MyUserDetails myUserDetails = (MyUserDetails) userDetails;
                    modelMapper.map(myUserDetails.getUser(), userResponse);
                    userResponse.setPassword(null);

                    List<Token> tokens = tokenRepository.findAllTokenByUser(myUserDetails.getUser().getUserId());
                    if (!tokens.isEmpty()) {
                        tokens.forEach(t -> {
                            t.setLoggedOut(true);
                        });
                    }
                    tokenRepository.saveAll(tokens);

                    //save the token
                    Token token = new Token();
                    token.setToken(jwtToken);
                    token.setUser(myUserDetails.getUser());
                    token.setLoggedOut(false);
                    tokenRepository.save(token);

                    LoginResponse loginResponse = new LoginResponse(jwtToken, username, roles, expiration, userResponse);
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");

                    ObjectMapper objectMapper = new ObjectMapper();
                    String data = objectMapper.writeValueAsString(loginResponse);
                    response.sendRedirect(reactEndpoint + "/ssoLogin?loginResponse=" + data);
                } else
                    throw new ResourceNotFoundException("No user found with email " + email);
            } else
                throw new BadCredentialsException("No user found.");
        } catch (BadCredentialsException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    private static User getUser(SCDRestResponse scdRestResponse, UserRole userRole) {
        User newUser = new User();
        newUser.setUsername(scdRestResponse.getGid());
        newUser.setOrganization(scdRestResponse.getOrganization());
        newUser.setCountry(scdRestResponse.getCountry());
        newUser.setSponsor(scdRestResponse.getSponsor());
        newUser.setMobileNumber(scdRestResponse.getMobileNumber());
        newUser.setOrganizationID(scdRestResponse.getOrganizationId());
        newUser.setLineManager(scdRestResponse.getLineManager());
        newUser.setFullName(scdRestResponse.getFullName());
        newUser.setDisplayName(scdRestResponse.getDisplayName());
        newUser.setLastName(scdRestResponse.getLastName());
        newUser.setFirstName(scdRestResponse.getFirstName());
        newUser.setEmail(scdRestResponse.getEmail());
        newUser.setGID(scdRestResponse.getGid());
        newUser.setDepartment(scdRestResponse.getDepartment());
        newUser.setUserRole(userRole);
        return newUser;
    }
}
