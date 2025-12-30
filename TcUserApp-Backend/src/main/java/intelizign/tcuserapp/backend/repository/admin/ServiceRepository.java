package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.dto.ServiceResponse;
import intelizign.tcuserapp.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    @Query("SELECT new intelizign.tcuserapp.backend.dto.ServiceResponse(ser.serviceId, ser.serviceName) FROM Service ser")
    public List<ServiceResponse> getServiceInformation();

    public Optional<Service> findByServiceName(String serviceName);

}
