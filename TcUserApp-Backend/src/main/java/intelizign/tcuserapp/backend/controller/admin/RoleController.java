package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.RoleResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Role;
import intelizign.tcuserapp.backend.service.admin.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/role")
public class RoleController {

    @Autowired
    RoleService roleService;

    private final Logger logger = LoggerFactory.getLogger(RoleController.class);

    @GetMapping("/findAllRole")
    public ResponseEntity<List<RoleResponse>> getAllRole() {
        try {
            return ResponseEntity.ok(roleService.getAllRoles());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveRole")
    public ResponseEntity<RoleResponse> saveRole(@RequestBody Role role) {
        try {
            RoleResponse roleResponse = roleService.addRole(role);

            if (roleResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(roleResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateRole")
    public ResponseEntity<RoleResponse> updateRole(@RequestBody Role updateRole) {
        try {
            RoleResponse roleResponse = roleService.updateRole(updateRole);
            if (roleResponse != null) {
                return ResponseEntity.ok(roleResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteRole/{roleId}")
    public ResponseEntity<String> deleteRole(@PathVariable String roleId) {
        try {
            if (roleService.findByRoleId(Long.parseLong(roleId))) {
                roleService.deleteRole(Long.parseLong(roleId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getRole/system/{systemId}")
    public ResponseEntity<List<RoleResponse>> getAllRoleFromSystem(@PathVariable String systemId) {
        try {
            List<RoleResponse> roleResponse = roleService.getAllRolesFromSystem(Long.parseLong(systemId));
            if (roleResponse != null) {
                return ResponseEntity.ok(roleResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getRole/group/{groupId}")
    public ResponseEntity<List<RoleResponse>> getAllRoleFromGroup(@PathVariable String groupId) {
        try {
            List<RoleResponse> roleResponse = roleService.getAllRolesFromGroup(Long.parseLong(groupId));
            if (roleResponse != null) {
                return ResponseEntity.ok(roleResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getRole/search")
    public ResponseEntity<List<RoleResponse>> getAllRoleSearch(@RequestBody Role roleSearch) {
        try {
            List<RoleResponse> roleResponse = roleService.getAllRoleSearch(roleSearch);
            if (roleResponse != null) {
                return ResponseEntity.ok(roleResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
