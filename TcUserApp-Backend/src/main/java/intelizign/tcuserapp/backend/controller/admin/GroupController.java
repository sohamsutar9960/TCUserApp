package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.GroupResponse;
import intelizign.tcuserapp.backend.dto.GroupRoleResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Group;
import intelizign.tcuserapp.backend.service.admin.GroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/group")
public class GroupController {

    @Autowired
    GroupService groupService;

    private final Logger logger = LoggerFactory.getLogger(GroupController.class);

    @GetMapping("/findAllGroup")
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        try {
            return ResponseEntity.ok(groupService.getAllGroups());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveGroup")
    public ResponseEntity<GroupResponse> saveGroup(@RequestBody Group group) {
        try {
            GroupResponse groupResponse = groupService.addGroup(group);
            if (groupResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(groupResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateGroup")
    public ResponseEntity<GroupResponse> updateGroup(@RequestBody Group updateGroup) {
        try {
            GroupResponse groupResponse = groupService.updateGroup(updateGroup);
            if (groupResponse != null) {
                return ResponseEntity.ok(groupResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteGroup/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable String groupId) {
        try {
            if (groupService.findByGroupId(Long.parseLong(groupId))) {
                groupService.deleteGroup(Long.parseLong(groupId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getGroup/system/{systemId}")
    public ResponseEntity<List<GroupRoleResponse>> getGroupsForSystem(@PathVariable String systemId) {
        try {
            List<GroupRoleResponse> responses = groupService.getGroupsForSystem(Long.parseLong(systemId));
            if (responses != null) {
                return ResponseEntity.ok(responses);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getGroup/system/{systemId}/{groupName}")
    public ResponseEntity<List<GroupRoleResponse>> getGroupsForSystem(@PathVariable String systemId, @PathVariable String groupName) {
        try {
            List<GroupRoleResponse> responses = groupService.getFilteredGroupsForSystem(Long.parseLong(systemId),
                    groupName);
            if (responses != null) {
                return ResponseEntity.ok(responses);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getGroup/search")
    public ResponseEntity<List<GroupResponse>> getSearchedGroups(@RequestBody Group group) {
        try {
            List<GroupResponse> responses = groupService.getSearchedGroups(group);
            if (responses != null) {
                return ResponseEntity.ok(responses);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    /*@GetMapping("/getAllGroupRoles/system/{systemId}")
    public ResponseEntity<List<GroupRoleResponse>> getAllGroupRoles(@PathVariable String systemId) {
        try {
            List<GroupRoleResponse> groupRoleResponses = groupService.getAllGroupRoles(Long.parseLong(systemId));
            if (groupRoleResponses != null) {
                return ResponseEntity.ok(groupRoleResponses);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }*/
}
