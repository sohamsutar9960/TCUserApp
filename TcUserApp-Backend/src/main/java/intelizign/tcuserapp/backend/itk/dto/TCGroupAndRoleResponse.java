package intelizign.tcuserapp.backend.itk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCGroupAndRoleResponse {
    private String groupName;
    private String groupNamePath;
    private String roleName;
    private String status;
    private Boolean isDeleted;
}
