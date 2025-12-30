package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.TCConfigResponse;
import intelizign.tcuserapp.backend.model.TCConfiguration;

public interface TCConfigurationService {

	List<TCConfigResponse> getAllTCConfigurations();

	TCConfigResponse addTCConfiguration(TCConfiguration tcConfiguration);

	TCConfigResponse updateTCConfiguration(TCConfiguration tcConfiguration);

	void deleteTCConfiguration(Long tcConfigId);

	boolean findByTCConfigurationId(Long tcConfigId);
	
	TCConfigResponse getAllTCConfigurationFromSystem(Long systemId);

}
