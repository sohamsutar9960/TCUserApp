package intelizign.tcuserapp.backend.controller.createRequest;

import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.UserRequest;
import intelizign.tcuserapp.backend.service.createRequest.CreateRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/userRequest")
public class CreateRequestController {

    @Autowired
    CreateRequestService userRequestService;

    private final Logger logger = LoggerFactory.getLogger(CreateRequestController.class);

    @GetMapping("/findAllUserRequest")
    public ResponseEntity<List<UserRequestResponse>> getAllUserRequest() {
        try {
            return ResponseEntity.ok(userRequestService.getAllUserRequest());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveUserRequest")
    public ResponseEntity<UserRequestResponse> saveUserRequest(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse userRequestResponse = userRequestService.createUserRequest(userRequest);
            if (userRequestResponse != null)
                return ResponseEntity.status(HttpStatus.CREATED).body(userRequestResponse);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/search")
    public ResponseEntity<List<UserRequestResponse>> getSearchedGroups(@RequestBody UserRequest userRequestSearch) {
        try {
            List<UserRequestResponse> responses = userRequestService.getSearchedUserRequest(userRequestSearch);
            if (responses != null) {
                return ResponseEntity.ok(responses);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}
