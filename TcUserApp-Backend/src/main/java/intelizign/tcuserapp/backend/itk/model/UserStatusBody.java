package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"userId", "userStatus"})
@Data
public class UserStatusBody {

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("userStatus")
    private Integer userStatus;
}
