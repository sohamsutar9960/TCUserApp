package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.ServiceResponse;

public interface Service {

	List<ServiceResponse> getAllServices();

	ServiceResponse addService(intelizign.tcuserapp.backend.model.Service service);

	ServiceResponse updateService(intelizign.tcuserapp.backend.model.Service service);

	void deleteService(Long serviceId);
	
	boolean findByServiceId(Long serviceId);
}
