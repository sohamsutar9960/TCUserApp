
package intelizign.tcuserapp.backend.itk.model;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.processing.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "header",
        "body"
})
@Generated("jsonschema2pojo")
public class TeamcenterLoginModel {

    @JsonProperty("header")
    private Header header;

    @JsonProperty("body")
    private LoginBody body;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("header")
    public Header getHeader() {
        return header;
    }

    @JsonProperty("header")
    public void setHeader(Header header) {
        this.header = header;
    }

    public TeamcenterLoginModel withHeader(Header header) {
        this.header = header;
        return this;
    }

    @JsonProperty("body")
    public LoginBody getBody() {
        return body;
    }

    @JsonProperty("body")
    public void setBody(LoginBody body) {
        this.body = body;
    }

    public TeamcenterLoginModel withBody(LoginBody body) {
        this.body = body;
        return this;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    public TeamcenterLoginModel withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(TeamcenterLoginModel.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("header");
        sb.append('=');
        sb.append(((this.header == null) ? "<null>" : this.header));
        sb.append(',');
        sb.append("body");
        sb.append('=');
        sb.append(((this.body == null) ? "<null>" : this.body));
        sb.append(',');
        sb.append("additionalProperties");
        sb.append('=');
        sb.append(((this.additionalProperties == null) ? "<null>" : this.additionalProperties));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Override
    public int hashCode() {
        int result = 1;
        result = ((result * 31) + ((this.header == null) ? 0 : this.header.hashCode()));
        result = ((result * 31) + ((this.additionalProperties == null) ? 0 : this.additionalProperties.hashCode()));
        result = ((result * 31) + ((this.body == null) ? 0 : this.body.hashCode()));
        return result;
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if ((other instanceof TeamcenterLoginModel) == false) {
            return false;
        }
        TeamcenterLoginModel rhs = ((TeamcenterLoginModel) other);
        return ((((this.header == rhs.header) || ((this.header != null) && this.header.equals(rhs.header))) && ((this.additionalProperties == rhs.additionalProperties) || ((this.additionalProperties != null) && this.additionalProperties.equals(rhs.additionalProperties)))) && ((this.body == rhs.body) || ((this.body != null) && this.body.equals(rhs.body))));
    }

}
