
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"user", "password", "role", "descrimator", "locale", "group"})
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Credentials {

    @JsonProperty("user")
    private String user;

    @JsonProperty("password")
    private String password;

    @JsonProperty("role")
    private String role;

    @JsonProperty("descrimator")
    private String descrimator;

    @JsonProperty("locale")
    private String locale;

    @JsonProperty("group")
    private String group;
}
