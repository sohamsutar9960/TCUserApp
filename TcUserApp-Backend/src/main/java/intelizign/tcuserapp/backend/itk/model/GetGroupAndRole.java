
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"TeamcenterGroup", "TeamcenterPerson", "TeamcenterUser"})
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetGroupAndRole {

    @JsonProperty("TeamcenterGroup")
    private List<TeamcenterGroup> teamcenterGroup = new ArrayList<TeamcenterGroup>();

    @JsonProperty("TeamcenterPerson")
    private TeamcenterPerson teamcenterPerson;

    @JsonProperty("TeamcenterUser")
    private TeamcenterUser teamcenterUser;
}
