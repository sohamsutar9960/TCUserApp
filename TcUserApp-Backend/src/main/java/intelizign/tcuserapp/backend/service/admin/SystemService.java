package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.SystemResponse;
import intelizign.tcuserapp.backend.model.System;

public interface SystemService {

	List<SystemResponse> getAllSystems();

	SystemResponse addSystem(System system);

	SystemResponse updateSystem(System system);

	void deleteSystem(Long systemId);

	boolean findBySystemId(Long systemId);

	List<SystemResponse> getAllSystemByServiceId(Long serviceId);

}
