
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
@JsonPropertyOrder({"ExistingRoles", "groupName", "groupNamePath"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TeamcenterGroup {

    @JsonProperty("ExistingRoles")
    private List<ExistingRole> existingRoles = new ArrayList<ExistingRole>();

    @JsonProperty("groupNamePath")
    private String groupNamePath;

    @JsonProperty("groupName")
    private String groupName;

}
