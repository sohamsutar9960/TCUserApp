package intelizign.tcuserapp.backend.itk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCUserGroupAndRoleResponse {
    private List<TCGroupAndRoleResponse> tcGroupAndRoleResponses;
    private String defaultGroup;
    private String defaultVolume;
    private String osUserName;
    private Integer licensingLevel;
    private String country;
    private String ipClerance;
    private String lastLoginDate;
    private String personName;
}
