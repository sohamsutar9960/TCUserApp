
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
@JsonPropertyOrder({"Group Name", "Group Path", "Level", "Root", "UID", "roles", "subgroups"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Organization {

    @JsonProperty("Group Name")
    private String groupName;

    @JsonProperty("Group Path")
    private String groupPath;

    @JsonProperty("Level")
    private Integer level;

    @JsonProperty("Root")
    private String root;

    @JsonProperty("UID")
    private String uid;

    @JsonProperty("roles")
    private List<Role> roles;

    @JsonProperty("subgroups")
    private List<Subgroup> subgroups = new ArrayList<Subgroup>();

}
