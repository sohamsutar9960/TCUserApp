package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TCConfiguration")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TCConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tcConfigId;

    private String configName;
    private String tcURL;
    private String fmsURL;
    private Boolean ssoEnabled;
    private String ssoLoginURL;
    private String ssoIdentityURL;
    private String ssoTCAppId;
    private Boolean active;
    private String userName;
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "system_id")
    private System system;

}
