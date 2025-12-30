package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "GroupRoleApprover")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GroupRoleApprover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupRoleApproverId;

    private String gid;
    private String fullName;
    private String firstName;
    private String lastName;
    private String displayName;
    private String email;
    private String lineManager;
    private String sponsor;
    private String department;
    private String organization;
    private String organizationID;
    private String country;
    private String osUserName;
    private String locality;
    private String mobileNumber;
    private String city;
    private Boolean isActive;

}
