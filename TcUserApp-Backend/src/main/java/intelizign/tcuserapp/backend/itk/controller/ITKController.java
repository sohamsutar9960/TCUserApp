package intelizign.tcuserapp.backend.itk.controller;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.exception.TeamcenterException;
import intelizign.tcuserapp.backend.itk.dto.TCAllUserResponse;
import intelizign.tcuserapp.backend.itk.dto.TCLoginResponse;
import intelizign.tcuserapp.backend.itk.dto.TCUserGroupAndRoleResponse;
import intelizign.tcuserapp.backend.itk.service.ITKService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@RestController
@RequestMapping("/itk")
public class ITKController {

    @Autowired
    ITKService itkService;

    private final Logger logger = LoggerFactory.getLogger(ITKController.class);

    @GetMapping("/getUserGroupAndRole/{systemId}/{tcuserId}/{isTemplate}")
    public ResponseEntity<TCUserGroupAndRoleResponse> getUserGroupAndRole(@PathVariable String systemId, @PathVariable String tcuserId, @PathVariable String isTemplate) throws InvalidCredentialsException {
        try {
            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(Long.parseLong(systemId));

            if (tcLoginResponse != null) {
                TCUserGroupAndRoleResponse tcUserGroupAndRoleResponse = itkService.findUserGroupAndRole(tcuserId, Boolean.parseBoolean(isTemplate), tcLoginResponse);
                return ResponseEntity.ok(tcUserGroupAndRoleResponse);
            }
        } catch (InvalidCredentialsException | ResourceNotFoundException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @GetMapping("/tcUser/{systemId}")
    public ResponseEntity<List<TCAllUserResponse>> getAllTCUsers(@PathVariable String systemId) throws InvalidCredentialsException {
        try {
            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(Long.parseLong(systemId));

            if (tcLoginResponse != null) {
                List<TCAllUserResponse> tcAllUserResponses = itkService.findAllTeamcenterUser(Long.parseLong(systemId), tcLoginResponse);
                return ResponseEntity.ok(tcAllUserResponses);
            }
        } catch (InvalidCredentialsException | ResourceNotFoundException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @GetMapping("/allGroup/{groupName}/{systemId}")
    public ResponseEntity<String> getAllGroupAndRole(@PathVariable String groupName, @PathVariable String systemId) throws InvalidCredentialsException {
        try {
            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(Long.parseLong(systemId));
            if (tcLoginResponse != null) {
                itkService.findAllGroupAndRole(groupName, tcLoginResponse);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            }
        } catch (InvalidCredentialsException | ResourceNotFoundException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tcUser/{userId}/{systemId}/{userStatus}")
    public ResponseEntity<String> updateUserStatus(@PathVariable String userId, @PathVariable String systemId, @PathVariable String userStatus) throws InvalidCredentialsException {
        try {
            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(Long.parseLong(systemId));

            if (tcLoginResponse != null) {
                itkService.updateUserStatus(userId, userStatus, tcLoginResponse);
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        } catch (InvalidCredentialsException | ResourceNotFoundException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tcUser/create/{systemId}")
    public ResponseEntity<String> createOrUpdateTCUser(@PathVariable String systemId) throws InvalidCredentialsException {
        try {
            TCLoginResponse tcLoginResponse = itkService.teamcenterLogin(Long.parseLong(systemId));

            if (tcLoginResponse != null) {
                itkService.createOrUpdateTCUser(Long.parseLong(systemId), tcLoginResponse);
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        } catch (InvalidCredentialsException | ResourceNotFoundException | TeamcenterException |
                 ResourceAccessException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}
