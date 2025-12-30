package intelizign.tcuserapp.backend.model;

import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_TCAccountType;
import intelizign.tcuserapp.backend.enums.ENUM_UserHistory_UserStatus;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "UserHistory")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userHistoryId;

    private String gID;

    private String tcUserId;

    private String systemName;

    @Enumerated(EnumType.STRING)
    private ENUM_UserRequest_RequestStatus requestStatus;

    @Enumerated(EnumType.STRING)
    private ENUM_UserHistory_UserStatus userStatus;

    private Boolean neverLock;

    private Boolean tcCreated;

    @Enumerated(EnumType.STRING)
    private ENUM_UserHistory_TCAccountType tcAccountType;

    @OneToMany(mappedBy = "userHistory", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

}
