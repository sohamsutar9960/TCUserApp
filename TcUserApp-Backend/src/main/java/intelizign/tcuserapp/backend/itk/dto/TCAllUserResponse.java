package intelizign.tcuserapp.backend.itk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCAllUserResponse {
    private String userId;
    private String personName;
    private Integer status;
    private String lastLoginDate;
}
