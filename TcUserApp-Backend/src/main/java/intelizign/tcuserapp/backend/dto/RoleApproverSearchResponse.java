package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoleApproverSearchResponse {
    private Long roleId;
    private String roleName;
    private Long groupId;
    private String groupName;
    private String groupNamePath;
}
