package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "System")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class System {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long systemId;

    private String systemName;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @OneToMany(mappedBy = "system", cascade = CascadeType.ALL)
    private List<Group> groups;

    @OneToMany(mappedBy = "system", cascade = CascadeType.ALL)
    private List<Volume> volumes;

    @OneToMany(mappedBy = "system", cascade = CascadeType.ALL)
    private List<Role> roles;

    @OneToOne(mappedBy = "system", cascade = CascadeType.ALL)
    private TCConfiguration tcConfiguration;

    @OneToMany(mappedBy = "system", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

}
