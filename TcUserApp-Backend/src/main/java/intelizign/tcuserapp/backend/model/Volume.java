package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Volume")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Volume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long volumeId;

    private String volumeName;

    @ManyToOne
    @JoinColumn(name = "system_id")
    private System system;

    @OneToMany(mappedBy = "volume", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

}
