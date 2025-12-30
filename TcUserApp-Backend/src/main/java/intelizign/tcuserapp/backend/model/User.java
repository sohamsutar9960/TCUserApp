package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String fullName;
    private String firstName;
    private String lastName;
    private String displayName;
    private String lineManager;
    private String sponsor;
    private String department;
    private String organization;
    private String organizationID;
    private String country;
    private String mobileNumber;
    private String username;
    private String password;
    private String email;
    private String GID;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private UserRole userRole;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

    @OneToMany(mappedBy = "user")
    private List<Token> tokens;
}
