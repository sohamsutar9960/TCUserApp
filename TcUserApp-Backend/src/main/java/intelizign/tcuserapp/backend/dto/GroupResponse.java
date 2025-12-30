package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GroupResponse {
    private Long groupId;
    private String groupName;
    private String groupNamePath;
    private String uid;
    private boolean isRoot;
    private String description;
    private String displayName;
    private Integer level;
    private Long systemId;
    private String systemName;
    private Long parentGroupId;
    private String parentGroupName;
}
