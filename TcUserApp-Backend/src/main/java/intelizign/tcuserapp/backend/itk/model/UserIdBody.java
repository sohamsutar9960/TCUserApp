package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserIdBody {

    @JsonProperty("userId")
    private String userId;

}
