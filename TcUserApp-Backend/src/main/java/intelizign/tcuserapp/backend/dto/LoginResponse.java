package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponse {
    private String jwtToken;
    private String userName;
    private List<String> roles;
    private Date expiration;
    private UserResponse user;
}
