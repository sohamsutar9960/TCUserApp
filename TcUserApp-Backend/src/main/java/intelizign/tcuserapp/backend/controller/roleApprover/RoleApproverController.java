package intelizign.tcuserapp.backend.controller.roleApprover;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.dto.RoleApproverResponse;
import intelizign.tcuserapp.backend.dto.RoleApproverSearchResponse;
import intelizign.tcuserapp.backend.dto.UserRequestResponse;
import intelizign.tcuserapp.backend.exception.DeletionNotAllowedException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.exception.TeamcenterException;
import intelizign.tcuserapp.backend.model.AssignedRole;
import intelizign.tcuserapp.backend.model.UserRequest;
import intelizign.tcuserapp.backend.service.roleApprover.RoleApproverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@RestController
@RequestMapping("/izn/roleApprover")
public class RoleApproverController {

    @Autowired
    RoleApproverService roleApproverService;

    private final Logger logger = LoggerFactory.getLogger(RoleApproverController.class);

    @PatchMapping("/approved")
    public ResponseEntity<UserRequestResponse> approvedByRoleApprover(@RequestBody UserRequest userRequest) throws InvalidCredentialsException {
        try {
            UserRequestResponse userRequestResponse = roleApproverService.approvedByRoleApprover(userRequest);
            if (userRequestResponse != null)
                return ResponseEntity.ok(userRequestResponse);
        } catch (ResourceNotFoundException | InvalidCredentialsException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PatchMapping("/rejected")
    public ResponseEntity<UserRequestResponse> rejectedByRoleApprover(@RequestBody UserRequest userRequest) {
        try {
            UserRequestResponse userRequestResponse = roleApproverService.rejectedByRoleApprover(userRequest);
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
    public ResponseEntity<UserRequestResponse> assignOrDeleteRole(@PathVariable String assignedRoleId) {
        try {
            UserRequestResponse userRequestResponse = roleApproverService.assignOrDeleteRole(Long.parseLong(assignedRoleId));
            if (userRequestResponse != null)
                return ResponseEntity.ok(userRequestResponse);
        } catch (DeletionNotAllowedException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/allRequest")
    public ResponseEntity<RoleApproverResponse> getAllRequestForRoleApprover() {
        try {
            RoleApproverResponse roleApproverResponse = roleApproverService.getAllRequestForRoleApprover();
            if (roleApproverResponse != null)
                return ResponseEntity.ok(roleApproverResponse);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/{roleName}")
    public ResponseEntity<List<RoleApproverSearchResponse>> getAllRolesFromRoleName(@PathVariable String roleName) {
        try {
            List<RoleApproverSearchResponse> roleSearchResponse = roleApproverService.getAllRolesFromRoleName(roleName);
            if (!roleSearchResponse.isEmpty())
                return ResponseEntity.ok(roleSearchResponse);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign/{requestId}")
    public ResponseEntity<UserRequestResponse> assignRoleToExistingRequest(@PathVariable String requestId, @RequestBody List<AssignedRole> assignedRoleList) {
        try {
            UserRequestResponse userRequestResponse = roleApproverService.assignRoleToExistingRequest(Long.parseLong(requestId), assignedRoleList);
            if (userRequestResponse != null)
                return ResponseEntity.ok(userRequestResponse);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}
