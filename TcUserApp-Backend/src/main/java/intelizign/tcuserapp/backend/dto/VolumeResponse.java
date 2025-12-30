package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class VolumeResponse {
    private Long volumeId;
    private String volumeName;
    private Long systemId;
    private String systemName;
}
