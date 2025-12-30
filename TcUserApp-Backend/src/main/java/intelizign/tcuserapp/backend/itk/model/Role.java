
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"RoleName", "UID"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Role {

    @JsonProperty("RoleName")
    private String roleName;

    @JsonProperty("UID")
    private String uid;

}
