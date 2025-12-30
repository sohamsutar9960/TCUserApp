package intelizign.tcuserapp.backend.controller.manager;

import intelizign.tcuserapp.backend.dto.ManagerResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.exception.DeletionNotAllowedException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.UserRequest;
import intelizign.tcuserapp.backend.service.manager.ManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/izn/manager")
public class ManagerController {

    @Autowired
    ManagerService managerService;

    private final Logger logger = LoggerFactory.getLogger(ManagerController.class);

    @PatchMapping("/approved")
    public ResponseEntity<UserRequestResponse> approveByManager(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse userRequestResponse = managerService.approveUserRequestByManager(userRequest);
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

    @PatchMapping("/rejected")
    public ResponseEntity<UserRequestResponse> rejectByManager(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse userRequestResponse = managerService.rejectUserRequestByManager(userRequest);
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

    @GetMapping("/delete/{assignedRoleId}")
    public ResponseEntity<UserRequestResponse> deleteAssignedRole(@PathVariable String assignedRoleId) {
        try {
            UserRequestResponse userRequestResponse = managerService.assignOrDeleteRole(Long.parseLong(assignedRoleId));
            if (userRequestResponse != null)
                return ResponseEntity.ok(userRequestResponse);
        } catch (DeletionNotAllowedException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/allRequest/{gid}")
    public ResponseEntity<ManagerResponse> getAllRequest(@PathVariable String gid) {
        try {
            ManagerResponse managerResponse = managerService.getAllRequestForManager(gid);
            if (managerResponse != null)
                return ResponseEntity.ok(managerResponse);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}