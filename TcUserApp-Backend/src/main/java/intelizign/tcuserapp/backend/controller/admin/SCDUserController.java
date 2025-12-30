package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.SCDUserResponse;
import intelizign.tcuserapp.backend.model.SCDUser;
import intelizign.tcuserapp.backend.service.admin.SCDUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/scdUser")
public class SCDUserController {

    @Autowired
    SCDUserService scdService;

    private final Logger logger = LoggerFactory.getLogger(SCDUserController.class);

    @GetMapping("/findAllSCDUser")
    public ResponseEntity<List<SCDUserResponse>> getAllSCDUsers() {
        try {
            return ResponseEntity.ok(scdService.getAllScdUsers());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveSCDUser")
    public ResponseEntity<SCDUserResponse> saveSCDUser(@RequestBody SCDUser scdUser) {
        try {
            SCDUserResponse scdUserResponse = scdService.addSCDUser(scdUser);
            if (scdUserResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(scdUserResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/updateSCDUser")
    public ResponseEntity<SCDUserResponse> updateSCDUser(@RequestBody SCDUser scdUser) {
        try {
            SCDUserResponse scdUserResponse = scdService.updateSCDUser(scdUser);
            if (scdUserResponse != null) {
                return ResponseEntity.ok(scdUserResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteSCDUser/{scdUserId}")
    public ResponseEntity<String> deleteSCDUser(@PathVariable String scdUserId) {
        try {
            if (scdService.findBySCDUserId(Long.parseLong(scdUserId))) {
                scdService.deleteScdUser(Long.parseLong(scdUserId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getSCDUser/{gid}")
    public ResponseEntity<SCDUserResponse> saveSCDUser(@PathVariable String gid) {
        try {
            SCDUserResponse scdUserResponse = scdService.getSCDUserByGID(gid);
            if (scdUserResponse != null) {
                return ResponseEntity.ok(scdUserResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/getSCDUser/search")
    public ResponseEntity<List<SCDUserResponse>> getAllSCDUserSearch(@RequestBody SCDUser scdUserSearch) {
        try {
            List<SCDUserResponse> scdUserResponces = scdService.getAllSCDUserSearch(scdUserSearch);

            if (scdUserResponces != null)
                return ResponseEntity.ok(scdUserResponces);

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
