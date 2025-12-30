
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"PA10_TELEPHONE", "PA1_ADDRESS", "PA2_CITY", "PA3_STATE", "PA4_ZIPCODE", "PA5_COUNTRY",
        "PA6_ORGANISATION", "PA7_EMPLOYEENUMBER", "PA8_INTERNALMAILCODE", "PA9_EMAIL", "locale", "PersonName"})
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeamcenterPerson {

    @JsonProperty("PA10_TELEPHONE")
    private String pa10Telephone;

    @JsonProperty("PA1_ADDRESS")
    private String pa1Address;

    @JsonProperty("PA2_CITY")
    private String pa2City;

    @JsonProperty("PA3_STATE")
    private String pa3State;

    @JsonProperty("PA4_ZIPCODE")
    private String pa4Zipcode;

    @JsonProperty("PA5_COUNTRY")
    private String pa5Country;

    @JsonProperty("PA6_ORGANISATION")
    private String pa6Organisation;

    @JsonProperty("PA7_EMPLOYEENUMBER")
    private String pa7Employeenumber;

    @JsonProperty("PA8_INTERNALMAILCODE")
    private String pa8Internalmailcode;

    @JsonProperty("PA9_EMAIL")
    private String pa9Email;

    @JsonProperty("locale")
    private String locale;

    @JsonProperty("PersonName")
    private String personName;
}
