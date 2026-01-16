package intelizign.tcuserapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonAutoDetect(
    fieldVisibility = JsonAutoDetect.Visibility.ANY,
    getterVisibility = JsonAutoDetect.Visibility.NONE,
    isGetterVisibility = JsonAutoDetect.Visibility.NONE
)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SCDUserResponse {
    private Long scdUserId;
    private String FullName;
    private String FirstName;
    private String LastName;
    private String GID;
    private String DisplayName;
    private String Email;
    private String LineManager;
    private String Sponsor;
    private String Department;
    private String Organization;
    private String OrganizationID;
    private String Country;
    private String MobileNumber;
}
