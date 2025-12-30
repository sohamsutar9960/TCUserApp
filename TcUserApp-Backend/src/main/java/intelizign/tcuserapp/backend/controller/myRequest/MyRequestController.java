package intelizign.tcuserapp.backend.controller.myRequest;

import intelizign.tcuserapp.backend.dto.MyRequestResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.UserRequest;
import intelizign.tcuserapp.backend.service.myRequest.MyRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/izn/getRequest")
public class MyRequestController {

    @Autowired
    MyRequestService myRequestService;

    private final Logger logger = LoggerFactory.getLogger(MyRequestController.class);

    @GetMapping("/{requestId}")
    public ResponseEntity<UserRequestResponse> getUserRequest(@PathVariable String requestId) {
        try {
            UserRequestResponse userRequestResponse = myRequestService.getUserRequestByID(Long.parseLong(requestId));
            if (userRequestResponse != null)
                return ResponseEntity.ok(userRequestResponse);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/cancelUserRequest")
    public ResponseEntity<UserRequestResponse> cancelUserRequest(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse userRequestResponse = myRequestService.cancelUserRequest(userRequest);
            if (userRequestResponse != null) return ResponseEntity.ok(userRequestResponse);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/createdByMe/{gid}")
    public ResponseEntity<MyRequestResponse> createdByMe(@PathVariable String gid) {
        try {
            MyRequestResponse myRequestResponse = myRequestService.createdByMeUserRequest(gid);
            if (myRequestResponse != null) return ResponseEntity.ok(myRequestResponse);

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/createdForMe/{gid}")
    public ResponseEntity<MyRequestResponse> createdForMe(@PathVariable String gid) {
        try {
            MyRequestResponse myRequestResponse = myRequestService.createdForMeUserRequest(gid);
            if (myRequestResponse != null) return ResponseEntity.ok(myRequestResponse);

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/changeManager")
    public ResponseEntity<UserRequestResponse> changeManager(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse requestResponse = myRequestService.changeManagerForUserRequest(userRequest);
            if (requestResponse != null) return ResponseEntity.ok(requestResponse);
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
