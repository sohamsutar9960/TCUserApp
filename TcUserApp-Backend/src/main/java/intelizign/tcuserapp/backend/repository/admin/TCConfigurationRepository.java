package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.dto.TCConfigResponse;
import intelizign.tcuserapp.backend.model.TCConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TCConfigurationRepository extends JpaRepository<TCConfiguration, Long> {

    @Query("SELECT new intelizign.tcuserapp.backend.dto.TCConfigResponse(tcc.tcConfigId, tcc.configName, sys.systemId, sys.systemName, "
            + "tcc.tcURL, tcc.fmsURL, tcc.ssoEnabled, tcc.ssoLoginURL, tcc.ssoIdentityURL, tcc.ssoTCAppId, tcc.active, tcc.userName, tcc.password) "
            + "FROM TCConfiguration tcc JOIN tcc.system sys")
    public List<TCConfigResponse> getAllTCConfigurationInformation();

    @Query("SELECT new intelizign.tcuserapp.backend.dto.TCConfigResponse(tcc.tcConfigId, tcc.configName, sys.systemId, sys.systemName, "
            + "tcc.tcURL, tcc.fmsURL, tcc.ssoEnabled, tcc.ssoLoginURL, tcc.ssoIdentityURL, tcc.ssoTCAppId, tcc.active, tcc.userName, tcc.password) "
            + "FROM TCConfiguration tcc JOIN tcc.system sys WHERE tcc.tcConfigId = :id")
    public TCConfigResponse getTCConfigurationById(Long id);

    @Query("SELECT tcc FROM TCConfiguration tcc WHERE tcc.system.systemId = :systemId")
    public List<TCConfiguration> getTCConfigurationForSystem(Long systemId);

}
