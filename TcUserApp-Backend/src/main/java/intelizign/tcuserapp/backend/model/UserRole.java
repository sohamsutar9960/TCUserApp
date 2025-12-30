package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "UserRole")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRole {

    @Id
    @Column(name = "role_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    private String roleName;

    @OneToMany(mappedBy = "userRole", cascade = CascadeType.ALL)
    private List<User> users;

}
