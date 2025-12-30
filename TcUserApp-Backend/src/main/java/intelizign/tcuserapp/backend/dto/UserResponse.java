package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponse {
    private Long userId;
    private String fullName;
    private String firstName;
    private String lastName;
    private String displayName;
    private String lineManager;
    private String sponsor;
    private String department;
    private String organization;
    private String organizationID;
    private String country;
    private String mobileNumber;
    private String username;
    private String password;
    private String email;
    private String GID;
    private Long roleId;
    private String roleName;
}
