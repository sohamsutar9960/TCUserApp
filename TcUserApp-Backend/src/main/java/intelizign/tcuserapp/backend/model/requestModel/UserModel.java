package intelizign.tcuserapp.backend.model.requestModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import intelizign.tcuserapp.backend.enums.ENUM_AssignedRole_Status;
import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_IPClearance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserModel {

    @JsonProperty("Users")
    private List<User> users;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class User {

        @JsonProperty("user_id")
        private String userId;

        @JsonProperty("osUserName")
        private String osUserName;

        @JsonProperty("ipClearance")
        private ENUM_UserRequest_IPClearance ipClearance;

        @JsonProperty("geography")
        private String geography;

        @JsonProperty("volume")
        private String volume;

        @JsonProperty("defaultGroup")
        private String defaultGroup;

        @JsonProperty("password")
        private String password;

        @JsonProperty("personName")
        private String personName;

        @JsonProperty("assignedRoles")
        private List<Role> assignedRoles;

        @JsonProperty("Person")
        private Person person;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Role {

        @JsonProperty("roleName")
        private String roleName;

        @JsonProperty("groupNamePath")
        private String groupNamePath;

        @JsonProperty("isDeleted")
        private Boolean isDeleted;

        @JsonProperty("roleStatus")
        private ENUM_AssignedRole_Status roleStatus;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class Person {

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
        private String pa7EmployeeNumber;

        @JsonProperty("PA8_INTERNALMAILCODE")
        private String pa8InternalMailCode;

        @JsonProperty("PA9_EMAIL")
        private String pa9Email;

        @JsonProperty("locale")
        private String locale;
    }
}

