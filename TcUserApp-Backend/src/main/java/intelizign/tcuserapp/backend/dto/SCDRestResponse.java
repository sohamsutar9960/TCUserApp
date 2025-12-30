package intelizign.tcuserapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

@JacksonXmlRootElement(localName = "SCD_User")
@Data
public class SCDRestResponse {
    @JsonProperty("FullName")
    private String fullName;

    @JsonProperty("FirstName")
    private String firstName;

    @JsonProperty("LastName")
    private String lastName;

    @JsonProperty("GID")
    private String gid;

    @JsonProperty("DisplayName")
    private String displayName;

    @JsonProperty("Email")
    private String email;

    @JsonProperty("LineManager")
    private String lineManager;

    @JsonProperty("Sponsor")
    private String sponsor;

    @JsonProperty("Department")
    private String department;

    @JsonProperty("Organization")
    private String organization;

    @JsonProperty("OrganizationID")
    private String organizationId;

    @JsonProperty("Country")
    private String country;

    @JsonProperty("MobileNumber")
    private String mobileNumber;
}
