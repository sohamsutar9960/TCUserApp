package intelizign.tcuserapp.backend.model;

import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "AssignedRole")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AssignedRole {

    @Id
    @Column(name = "assignedRole_Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignedRoleId;

    private String roleName;

    private Boolean isAssigned;

    private String groupNamePath;

    private String groupName;

    private String systemName;

    @Enumerated(EnumType.STRING)
    private ENUM_AssignedRole_Status assignedRole_Status;

    private boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private UserRequest userRequest;

}
