package intelizign.tcuserapp.backend.model;

import intelizign.tcuserapp.backend.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "UserRequest")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRequest {

    @Id
    @Column(name = "request_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(name = "commentsForApprover")
    private String commentsForApprover;

    @Column(name = "cancellationComment")
    private String cancellationComment;

    @Column(name = "reasonForCancellation")
    private String reasonForCancellation;

    @Column(name = "tcOSUserName")
    private String tcOSUserName;

    @Column(name = "groupRoleApproverComments")
    private String groupRoleApproverComments;

    @Column(name = "costApproverComments")
    private String costApproverComments;

    @Column(name = "defaultGroup")
    private String defaultGroup;

    @Column(name = "costApproverDate")
    @Temporal(TemporalType.DATE)
    private Date costApproverDate;

    @Column(name = "groupRoleApproverDate")
    @Temporal(TemporalType.DATE)
    private Date groupRoleApproverDate;

    @Column(name = "creationDate")
    @Temporal(TemporalType.DATE)
    private Date creationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "userRequest_TypeOfRequest")
    private ENUM_UserRequest_TypeOfRequest userRequest_TypeOfRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "accountDeactivate")
    private ENUM_UserRequest_AccountDeactivate accountDeactivate;

    @Enumerated(EnumType.STRING)
    @Column(name = "requestStatus")
    private ENUM_UserRequest_RequestStatus requestStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "ipClearance")
    private ENUM_UserRequest_IPClearance ipClearance;

    @Column(name = "neverLock")
    private Boolean neverLock;

    @Enumerated(EnumType.STRING)
    @Column(name = "tcAccountType")
    private ENUM_UserRequest_TCAccountType tcAccountType;

    @Enumerated(EnumType.STRING)
    @Column(name = "tcLicenseLevel")
    private ENUM_UserRequest_LicensingLevel requestLicensingLevel;

    @ManyToOne
    @JoinColumn(name = "scdUserSelf_Id")
    private SCDUser userRequestSelf;

    @OneToMany(mappedBy = "userRequest")
    private List<AssignedRole> assignedRoles;

    @OneToMany(mappedBy = "userRequest")
    private List<HistoryLog> historyLogList;

    @ManyToOne
    @JoinColumn(name = "scdUserAnother_Id")
    private SCDUser userRequestForAnother;

    @ManyToOne
    @JoinColumn(name = "scdCostManagerSelf_Id")
    private SCDUser costManagerSelf;

    @ManyToOne
    @JoinColumn(name = "scdCostManagerAnother_Id")
    private SCDUser costManagerForAnother;

    @ManyToOne
    @JoinColumn(name = "userHistory_Id")
    private UserHistory userHistory;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "system_id")
    private System system;

    @ManyToOne
    @JoinColumn(name = "volume_id")
    private Volume volume;

    @ManyToOne
    @JoinColumn(name = "createdBy_id")
    private User user;

}
