package intelizign.tcuserapp.backend.dto;

import intelizign.tcuserapp.backend.enums.*;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRequestResponse {

    private Long requestId;

    private String commentsForApprover;
    private String cancellationComment;
    private String reasonForCancellation;
    private String tcOSUserName;
    private String groupRoleApproverComments;
    private String costApproverComments;
    private String defaultGroup;

    private Date costApproverDate;
    private Date groupRoleApproverDate;
    private Date creationDate;

    private ENUM_UserRequest_TypeOfRequest userRequest_TypeOfRequest;
    private ENUM_UserRequest_AccountDeactivate accountDeactivate;
    private ENUM_UserRequest_RequestStatus requestStatus;
    private ENUM_UserRequest_IPClearance ipClearance;
    private ENUM_UserRequest_TCAccountType tcAccountType;
    private ENUM_UserRequest_LicensingLevel requestLicensingLevel;

    private boolean neverLock;

    private List<AssignedRole> assignedRoles;
    private List<HistoryLog> historyLogList;

    private SCDUser userRequestSelf;
    private SCDUser userRequestForAnother;
    private SCDUser costManagerSelf;
    private SCDUser costManagerForAnother;

    private UserHistory userHistory;

    private Country country;

    private Service service;

    private System system;

    private Volume volume;

    private User createdBy;
}
