package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"header", "body"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TeamcenterUserCreationModel {

    @JsonProperty("header")
    private Header header;

    @JsonProperty("body")
    private TCBody body;
}
