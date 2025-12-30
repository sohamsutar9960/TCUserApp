package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoleResponse {
    private Long roleId;
    private String roleName;
    private Long groupId;
    private String groupName;
    private Long systemId;
    private String systemName;
    private String uid;
    private String description;
    private String displayName;
    private boolean isAssigned;
    private String status;
}
