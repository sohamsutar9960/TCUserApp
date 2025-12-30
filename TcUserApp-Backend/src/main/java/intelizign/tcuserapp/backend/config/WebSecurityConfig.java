package intelizign.tcuserapp.backend.config;

import intelizign.tcuserapp.backend.config.jwt.CustomJwtRequestFilter;
import intelizign.tcuserapp.backend.config.jwt.CustomLogoutHandler;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    CustomLogoutHandler customLogoutHandler;

    @Autowired
    CustomJwtRequestFilter customJwtRequestFilter;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    private final String[] commonForAll = {"/izn/admin/service/findAllService", "/izn/getRequest/{requestId}",
            "/izn/admin/api/scd/{gid}", "/itk/tcUser/{userId}/{systemId}/{userStatus}", "/izn/admin/country/findAllCountry"};

    private final String[] exceptAdmin = {"/izn/admin/system/getSystem/service/{serviceId}",
            "/izn/admin/volume/getVolume/system/{systemId}", "/izn/admin/country/findAllCountry",
            "/izn/admin/country/{countryId}", "/izn/admin/group/getGroup/system/{systemId}",
            "/izn/admin/group/getGroup/system/{systemId}/{groupName}",
            "/izn/admin/role/getRole/group/{groupId}", "/izn/admin/role/getRole/system/{systemId}",
            "/izn/admin/tcConfig/getTCConfig/system/{systemId}",
            "/izn/admin/userHistory/getUserHistory/user/{gid}/{systemName}",
            "/izn/admin/userRequest/saveUserRequest", "/izn/admin/scdUser/getSCDUser/{gid}",
            "/izn/admin/api/scd/{gid}", "/izn/getRequest/cancelUserRequest",
            "/izn/getRequest/createdByMe/{gid}", "/izn/getRequest/createdForMe/{gid}",
            "/izn/getRequest/changeManager", "/itk/getUserGroupAndRole/{systemId}/{tcuserId}/{isTemplate}"};

    private final String[] onlyAdmin = {"/izn/admin/service/saveService",
            "/izn/admin/service/updateService", "/izn/admin/service/deleteService/{serviceId}",
            "/izn/admin/system/findAllSystem", "/izn/admin/system/saveSystem",
            "/izn/admin/system/updateSystem", "/izn/admin/system/deleteSystem/{systemId}",
            "/izn/admin/volume/findAllVolume", "/izn/admin/volume/saveVolume",
            "/izn/admin/volume/updateVolume", "/izn/admin/volume/deleteVolume/{volumeId}",
            "/izn/admin/country/saveCountry",
            "/izn/admin/country/updateCountry", "/izn/admin/country/deleteCountry/{countryId}",
            "/izn/admin/country/getCountry/search", "/izn/admin/country/getCountry/import",
            "/izn/admin/group/findAllGroup", "/izn/admin/group/saveGroup", "/izn/admin/group/updateGroup",
            "/izn/admin/group/deleteGroup/{groupId}", "/izn/admin/group/getGroup/search",
            "/izn/admin/role/findAllRole", "/izn/admin/role/saveRole", "/izn/admin/role/updateRole",
            "/izn/admin/role/deleteRole/{roleId}", "/izn/admin/role/getRole/search",
            "/izn/admin/tcConfig/findAllTCConfig", "/izn/admin/tcConfig/saveTCConfig",
            "/izn/admin/tcConfig/updateTCConfig", "/izn/admin/tcConfig/deleteTCConfig/{tcConfigId}",
            "/izn/admin/userHistory/findAllUserHistory", "/izn/admin/userHistory/saveUserHistory",
            "/izn/admin/userHistory/updateUserHistory", "/izn/admin/userHistory/deleteUserHistory/{userHistoryId}",
            "/izn/admin/userHistory/getUserHistory/system/{systemName}",
            "/izn/admin/userHistory/getUserHistory/search", "/izn/admin/userRequest/findAllUserRequest",
            "/izn/admin/userRequest/search", "/izn/admin/scdUser/findAllSCDUser",
            "/izn/admin/scdUser/saveSCDUser", "/izn/admin/scdUser/updateSCDUser",
            "/izn/admin/scdUser/deleteSCDUser/{scdUserId}", "/izn/admin/scdUser/getSCDUser/search",
            "/izn/admin/api/scd/{gid}", "/izn/admin/groupApprover/findAllGroupRoleApprover",
            "/izn/admin/groupApprover/updateIsActive", "/izn/admin/groupApprover/getGroupRoleApprover/search",
            "/izn/admin/groupApprover/saveGroupRoleApprover", "/izn/admin/groupApprover/updateGroupRoleApprover",
            "/itk/tcUser/{systemId}", "/itk/allGroup/{groupName}/{systemId}", "/itk/tcUser/create/{systemId}"};

    private final String[] onlyManager = {"/izn/manager/approved",
            "/izn/manager/rejected", "/izn/manager/delete/{assignedRoleId}", "/izn/manager/allRequest/{gid}"};

    private final String[] onlyRoleApprover = {"/izn/roleApprover/approved", "/izn/roleApprover/rejected",
            "/izn/roleApprover/delete/{assignedRoleId}", "/izn/roleApprover/allRequest", "/izn/roleApprover/search/{roleName}",
            "/izn/roleApprover/assign/{requestId}"};

    private final String[] commonForAllAuthorities = {"USER", "MANAGER", "ROLEAPPROVER", "ADMIN"};

    private final String[] exceptAdminAuthorities = {"USER", "MANAGER", "ROLEAPPROVER"};

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers(commonForAll).hasAnyAuthority(commonForAllAuthorities))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers(onlyAdmin).hasAuthority("ADMIN"))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers(exceptAdmin).hasAnyAuthority(exceptAdminAuthorities))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers(onlyManager).hasAuthority("MANAGER"))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers(onlyRoleApprover).hasAuthority("ROLEAPPROVER"))
                .authorizeHttpRequests((authorize) -> authorize.requestMatchers("/izn/register/**", "/doLogin", "/izn/email/**").permitAll())
                .authenticationProvider(authenticationProvider())
                .logout(logout -> logout.logoutUrl("/logout").addLogoutHandler(customLogoutHandler)
                        .logoutSuccessHandler(((request, response, authentication) -> SecurityContextHolder.clearContext())))
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden")))
                .oauth2Login((login) -> login.successHandler(customOAuth2SuccessHandler));

        httpSecurity.addFilterBefore(customJwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
