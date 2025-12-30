package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "SCDUser")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SCDUser {

    @Id
    @Column(name = "scdUser_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scdUserId;

    @Column(name = "fullName")
    private String fullName;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "gID")
    private String gID;

    @Column(name = "displayName")
    private String displayName;

    @Column(name = "email")
    private String email;

    @Column(name = "lineManager")
    private String lineManager;

    @Column(name = "sponsor")
    private String sponsor;

    @Column(name = "department")
    private String department;

    @Column(name = "organization")
    private String organization;

    @Column(name = "organizationID")
    private String organizationID;

    @Column(name = "country")
    private String country;

    @Column(name = "mobileNumber")
    private String mobileNumber;

    @OneToMany(mappedBy = "userRequestSelf", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserRequest> userRequestSelfList;

    @OneToMany(mappedBy = "userRequestForAnother", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserRequest> userRequestForAnotherList;

    @OneToMany(mappedBy = "costManagerSelf", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserRequest> costManagerSelfList;

    @OneToMany(mappedBy = "costManagerForAnother", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserRequest> costManagerForAnotherList;

}
