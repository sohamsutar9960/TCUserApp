package intelizign.tcuserapp.backend.itk.dto;

import intelizign.tcuserapp.backend.model.System;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCLoginResponse {
    private String tcUrl;
    ResponseEntity<String> responseEntity;
    private System system;
}
