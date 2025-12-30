package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCConfigResponse {
    private Long tcConfigId;
    private String configName;
    private Long systemId;
    private String systemName;
    private String tcURL;
    private String fmsURL;
    private boolean ssoEnabled;
    private String ssoLoginURL;
    private String ssoIdentityURL;
    private String ssoTCAppId;
    private boolean active;
    private String userName;
    private String password;
}
