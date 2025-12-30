package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"Teamcenter Users"})
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AllUserData {

    @JsonProperty("Teamcenter Users")
    private List<AllTeamcenterUsers> allTeamcenterUsers;
}
