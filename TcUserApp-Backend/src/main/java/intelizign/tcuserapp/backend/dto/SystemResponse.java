package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SystemResponse {
    private Long systemId;
    private String systemName;
    private Long serviceId;
    private String serviceName;
}
