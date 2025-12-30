
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
@JsonPropertyOrder({"organization"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TCOrganization {

    @JsonProperty("organization")
    private List<Organization> organization = new ArrayList<Organization>();

}
