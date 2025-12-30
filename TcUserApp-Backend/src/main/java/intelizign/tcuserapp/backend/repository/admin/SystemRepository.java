package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.dto.SystemResponse;
import intelizign.tcuserapp.backend.model.System;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SystemRepository extends JpaRepository<System, Long> {

    @Query("SELECT new intelizign.tcuserapp.backend.dto.SystemResponse(sys.systemId, sys.systemName, ser.serviceId, ser.serviceName) "
            + "FROM System sys JOIN sys.service ser")
    public List<SystemResponse> getAllSystem();

    @Query("SELECT new intelizign.tcuserapp.backend.dto.SystemResponse(sys.systemId, sys.systemName, ser.serviceId, ser.serviceName) "
            + "FROM System sys JOIN sys.service ser " + "WHERE sys.systemId = :id")
    public SystemResponse getSystemById(Long id);

    @Query("SELECT new intelizign.tcuserapp.backend.dto.SystemResponse(sys.systemId, sys.systemName, ser.serviceId, ser.serviceName) "
            + "FROM System sys JOIN sys.service ser " + "WHERE ser.serviceId = :id")
    public List<SystemResponse> getSystemByServiceId(Long id);

    public Optional<System> findBySystemName(String systemName);
}
