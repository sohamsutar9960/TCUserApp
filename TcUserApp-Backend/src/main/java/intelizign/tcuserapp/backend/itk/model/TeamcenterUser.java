
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"DEFAULT_VOLUME", "Geography", "LastLoginDate", "Licensing Level", "Nationality", "OSUserName", "default_group",
        "ip_clearance", "status", "user_id", "user_name"})
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeamcenterUser {

    @JsonProperty("DEFAULT_VOLUME")
    private String defaultVolume;

    @JsonProperty("Geography")
    private String geography;

    @JsonProperty("LastLoginDate")
    private String lastLoginDate;

    @JsonProperty("Licensing Level")
    private Integer licensingLevel;

    @JsonProperty("Nationality")
    private String nationality;

    @JsonProperty("OSUserName")
    private String osUserName;

    @JsonProperty("default_group")
    private String defaultGroup;

    @JsonProperty("ip_clearance")
    private String ipClearance;

    @JsonProperty("status")
    private Integer status;

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_name")
    private String userName;
}
