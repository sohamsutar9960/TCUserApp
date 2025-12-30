package intelizign.tcuserapp.backend.controller.registration;

import intelizign.tcuserapp.backend.dto.UserRoleResponse;
import intelizign.tcuserapp.backend.model.UserRole;
import intelizign.tcuserapp.backend.service.admin.UserRoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/register")
public class UserRoleController {

    @Autowired
    UserRoleService userRoleService;

    private final Logger logger = LoggerFactory.getLogger(UserRoleController.class);

    @GetMapping("/findAllUserRole")
    public ResponseEntity<List<UserRoleResponse>> getAllUserRole() {

        try {
            return ResponseEntity.ok(userRoleService.getAllUserRoles());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @PostMapping("/saveUserRole")
    public ResponseEntity<UserRoleResponse> saveUserRole(@RequestBody UserRole userRole) {

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userRoleService.addUserRole(userRole));
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateUserRole")
    public ResponseEntity<UserRoleResponse> updateUserRole(@RequestBody UserRole updateUserRole) {

        try {
            UserRoleResponse userRoleResponse = userRoleService.updateUserRole(updateUserRole);
            if (userRoleResponse != null) {
                return ResponseEntity.ok(userRoleResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteUserRole/{roleId}")
    public ResponseEntity<String> deleteUserRole(@PathVariable String roleId) {

        try {
            if (userRoleService.findByUserRoleId(Long.parseLong(roleId))) {
                userRoleService.deleteUserRole(Long.parseLong(roleId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
