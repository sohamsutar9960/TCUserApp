package intelizign.tcuserapp.backend.dto;

import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_TCAccountType;
import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_UserStatus;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserHistoryResponse {
    private Long userHistoryId;
    private String gid;
    private String tcUserId;
    private String systemName;
    private ENUM_UserRequest_RequestStatus requestStatus;
    private ENUM_UserHistory_UserStatus userStatus;
    private boolean neverLock;
    private boolean tcCreated;
    private ENUM_UserHistory_TCAccountType tcAccountType;
}
