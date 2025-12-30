package intelizign.tcuserapp.backend.itk.config;

import intelizign.tcuserapp.backend.itk.dto.TCLoginResponse;
import intelizign.tcuserapp.backend.itk.model.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomITKConfig {

    @Bean
    public Credentials getCredentialsBean() {
        return new Credentials();
    }

    @Bean
    public LoginBody getLoginBodyBean() {
        return new LoginBody();
    }

    @Bean
    public State getStateBean() {
        return new State();
    }

    @Bean
    public Policy getPolicyBean() {
        return new Policy();
    }

    @Bean
    public Header getHeaderBean() {
        return new Header();
    }

    @Bean
    public TeamcenterLoginModel getTeamcenterLoginModelBean() {
        return new TeamcenterLoginModel();
    }

    @Bean
    public TCLoginResponse getTCLoginResponseBean() {
        return new TCLoginResponse();
    }

    @Bean
    public TeamcenterUserGroupAndRoleModel getTeamcenterUserGroupAndRoleModelBean() {
        return new TeamcenterUserGroupAndRoleModel();
    }

    @Bean
    public UserIdBody getUserIdBodyBean() {
        return new UserIdBody();
    }

    @Bean
    public AllUserModel getAllUserModelBean() {
        return new AllUserModel();
    }

    @Bean
    public OraganizationModel getOraganizationModelBean() {
        return new OraganizationModel();
    }

    @Bean
    public OrganizationBody getOrganizationBodyBean() {
        return new OrganizationBody();
    }

    @Bean
    public UserStatusBody getUserStatusBodyBean() {
        return new UserStatusBody();
    }

    @Bean
    public UserStatusModel getUserStatusModelBean() {
        return new UserStatusModel();
    }

    @Bean
    public TeamcenterUserCreationModel teamcenterUserCreationModelBean() {
        return new TeamcenterUserCreationModel();
    }

    @Bean
    public TCBody tcBodyBean() {
        return new TCBody();
    }
}
