package intelizign.tcuserapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MyRequestResponse {
    private List<UserRequestResponse> openRequests;
    private List<UserRequestResponse> closeRequests;
}
