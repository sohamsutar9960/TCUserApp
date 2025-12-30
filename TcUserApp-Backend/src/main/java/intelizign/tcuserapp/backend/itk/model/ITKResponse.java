package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({".QName", "outputString", "successcode", "error"})
@Data
public class ITKResponse {

    @JsonProperty(".QName")
    public String QName;

    @JsonProperty("outputString")
    public String outputString;

    @JsonProperty("successcode")
    public Boolean successCode;

    @JsonProperty("error")
    public String message;
}
