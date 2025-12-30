package intelizign.tcuserapp.backend.dto;

import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AssignedRoleResponse {

    private Long assignedRoleId;
    private String roleName;
    private boolean isAssigned;
    private String groupNamePath;
    private String groupName;
    private String systemName;
    private ENUM_AssignedRole_Status assignedRole_Status;
    private boolean isDeleted;
    private Long requestId;
}
