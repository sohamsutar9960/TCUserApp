package intelizign.tcuserapp.backend.config;

import intelizign.tcuserapp.backend.dto.*;
import intelizign.tcuserapp.backend.itk.dto.TCAllUserResponse;
import intelizign.tcuserapp.backend.itk.dto.TCUserGroupAndRoleResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomDTOConfig {

    @Bean
    public ServiceResponse serviceResponseBean() {
        return new ServiceResponse();
    }

    @Bean
    public SystemResponse systemResponseBean() {
        return new SystemResponse();
    }

    @Bean
    public GroupResponse groupResponseBean() {
        return new GroupResponse();
    }

    @Bean
    public RoleResponse roleResponseBean() {
        return new RoleResponse();
    }

    @Bean
    public TCConfigResponse tcConfigResponseBean() {
        return new TCConfigResponse();
    }

    @Bean
    public UserResponse userResponseBean() {
        return new UserResponse();
    }

    @Bean
    public UserRoleResponse userRoleResponseBean() {
        return new UserRoleResponse();
    }

    @Bean
    public VolumeResponse volumeResponseBean() {
        return new VolumeResponse();
    }

    @Bean
    public SCDUserResponse scdUserResponseBean() {
        return new SCDUserResponse();
    }

    @Bean
    public CountryResponse countryResponseBean() {
        return new CountryResponse();
    }

    @Bean
    public UserHistoryResponse UserHistoryResponseBean() {
        return new UserHistoryResponse();
    }

    @Bean
    public HistoryLogResponse historyLogResponseBean() {
        return new HistoryLogResponse();
    }

    @Bean
    public UserRequestResponse userRequestResponseBean() {
        return new UserRequestResponse();
    }

    @Bean
    public AssignedRoleResponse assignedRoleResponseBean() {
        return new AssignedRoleResponse();
    }

    @Bean
    public MyRequestResponse myRequestResponseBean() {
        return new MyRequestResponse();
    }

    @Bean
    public TCUserGroupAndRoleResponse tcUserGroupAndRoleResponseBean() {
        return new TCUserGroupAndRoleResponse();
    }

    @Bean
    public TCAllUserResponse tcAllUserResponseBean() {
        return new TCAllUserResponse();
    }

    @Bean
    public ManagerResponse managerResponseBean() {
        return new ManagerResponse();
    }

    @Bean
    public RoleApproverResponse roleApproverResponseBean() {
        return new RoleApproverResponse();
    }
}
