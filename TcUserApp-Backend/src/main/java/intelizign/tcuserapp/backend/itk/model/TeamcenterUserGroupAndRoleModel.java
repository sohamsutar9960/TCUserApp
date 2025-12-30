package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"header", "body"})
@Data
public class TeamcenterUserGroupAndRoleModel {

    @JsonProperty("header")
    private Header header;

    @JsonProperty("body")
    private UserIdBody userIdBody;

}
