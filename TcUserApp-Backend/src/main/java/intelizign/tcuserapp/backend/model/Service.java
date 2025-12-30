package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Service")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    private String serviceName;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<System> systems;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;
}
