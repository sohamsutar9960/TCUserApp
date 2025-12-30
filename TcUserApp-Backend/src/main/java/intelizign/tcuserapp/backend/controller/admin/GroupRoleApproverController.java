package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.GroupRoleApprover;
import intelizign.tcuserapp.backend.service.admin.GroupRoleApproverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/groupApprover")
public class GroupRoleApproverController {

    @Autowired
    GroupRoleApproverService groupRoleApproverService;

    private final Logger logger = LoggerFactory.getLogger(GroupRoleApproverController.class);

    @GetMapping("/findAllGroupRoleApprover")
    public ResponseEntity<List<GroupRoleApprover>> getAllGroupRoleApprovers() {
        try {
            return ResponseEntity.ok(groupRoleApproverService.findAllGroupRoleApprover());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveGroupRoleApprover")
    public ResponseEntity<GroupRoleApprover> saveGroupRoleApprover(@RequestBody GroupRoleApprover groupRoleApprover) {
        try {
            GroupRoleApprover savedGroupRoleInDB = groupRoleApproverService.saveGroupRoleApprover(groupRoleApprover);
            if (savedGroupRoleInDB != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(savedGroupRoleInDB);
            }
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateGroupRoleApprover")
    public ResponseEntity<GroupRoleApprover> updateGroupRoleApprover(@RequestBody GroupRoleApprover groupRoleApprover) {
        try {
            GroupRoleApprover savedGroupRoleInDB = groupRoleApproverService.updateGroupRoleApprover(groupRoleApprover);

            if (savedGroupRoleInDB != null) {
                return ResponseEntity.ok(savedGroupRoleInDB);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/getGroupRoleApprover/{gid}")
    public ResponseEntity<GroupRoleApprover> getGroupRoleApprover(@PathVariable String gid) {
        try {
            GroupRoleApprover groupRoleApprover = groupRoleApproverService.findBygID(gid);
            if (groupRoleApprover != null)
                return ResponseEntity.ok(groupRoleApproverService.findBygID(gid));
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/updateIsActive")
    public ResponseEntity<GroupRoleApprover> updateIsActive(@RequestBody GroupRoleApprover groupRoleApprover) {
        try {
            GroupRoleApprover groupRoleApproverInDB = groupRoleApproverService.updateIsActive(groupRoleApprover);
            if (groupRoleApproverInDB != null)
                return ResponseEntity.ok(groupRoleApproverInDB);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/getGroupRoleApprover/search")
    public ResponseEntity<List<GroupRoleApprover>> getGroupRoleApproverSearch(
            @RequestBody GroupRoleApprover groupRoleApproverSearch) {
        try {
            List<GroupRoleApprover> groupRoleApprovers = groupRoleApproverService
                    .getGroupRoleApproverSearch(groupRoleApproverSearch);

            if (groupRoleApprovers != null)
                return ResponseEntity.ok(groupRoleApprovers);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
