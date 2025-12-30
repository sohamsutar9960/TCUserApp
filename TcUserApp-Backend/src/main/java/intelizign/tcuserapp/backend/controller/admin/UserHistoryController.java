package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.UserHistoryResponse;
import intelizign.tcuserapp.backend.model.UserHistory;
import intelizign.tcuserapp.backend.service.admin.UserHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/userHistory")
public class UserHistoryController {

    @Autowired
    UserHistoryService userHistoryService;

    private final Logger logger = LoggerFactory.getLogger(UserHistoryController.class);

    @GetMapping("/findAllUserHistory")
    public ResponseEntity<List<UserHistoryResponse>> getAllUserHistory() {
        try {
            return ResponseEntity.ok(userHistoryService.getAllUserHistory());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveUserHistory")
    public ResponseEntity<UserHistoryResponse> addUserHistory(@RequestBody UserHistory userHistory) {
        try {
            UserHistoryResponse userHistoryResponse = userHistoryService.addUserHistory(userHistory);
            if (userHistoryResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(userHistoryResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateUserHistory")
    public ResponseEntity<UserHistoryResponse> updateUserHistory(@RequestBody UserHistory userHistory) {
        try {
            UserHistoryResponse userHistoryResponse = userHistoryService.updateUserHistory(userHistory);
            if (userHistoryResponse != null) {
                return ResponseEntity.ok(userHistoryResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteUserHistory/{userHistoryId}")
    public ResponseEntity<String> deleteUserHistory(@PathVariable String userHistoryId) {
        try {
            if (userHistoryService.findByUserHistoryId(Long.parseLong(userHistoryId))) {
                userHistoryService.deleteUserHistory(Long.parseLong(userHistoryId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getUserHistory/system/{systemName}")
    public ResponseEntity<List<UserHistoryResponse>> getAllUserHistoryBasedOnSystem(@PathVariable String systemName) {
        try {
            List<UserHistoryResponse> userHistoryResponse = userHistoryService
                    .getAllUserHistoryBasedOnSystem(systemName);
            if (userHistoryResponse != null)
                return ResponseEntity.ok(userHistoryResponse);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getUserHistory/user/{gid}/{systemName}")
    public ResponseEntity<List<UserHistoryResponse>> getUserHistoryByGIDAndSystemName(@PathVariable String gid, @PathVariable String systemName) {
        try {
            List<UserHistoryResponse> userHistoryResponses = userHistoryService.getUserHistoryByGIDAndSystemName(gid, systemName);
            if (userHistoryResponses != null)
                return ResponseEntity.ok(userHistoryResponses);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getUserHistory/search")
    public ResponseEntity<List<UserHistoryResponse>> getAllUserHistorySearch(
            @RequestBody UserHistory userHistorySearch) {
        try {
            List<UserHistoryResponse> userHistoryResponse = userHistoryService
                    .getAllUserHistorySearch(userHistorySearch);

            if (userHistoryResponse != null)
                return ResponseEntity.ok(userHistoryResponse);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
