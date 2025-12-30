package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ManagerResponse {
    private List<UserRequestResponse> openRequests;
    private List<UserRequestResponse> approvedRequests;
    private List<UserRequestResponse> rejectedRequests;
}
