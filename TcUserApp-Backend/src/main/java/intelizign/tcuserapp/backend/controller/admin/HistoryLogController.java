package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.HistoryLogResponse;
import intelizign.tcuserapp.backend.model.HistoryLog;
import intelizign.tcuserapp.backend.service.admin.HistoryLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/historyLog")
public class HistoryLogController {

    @Autowired
    HistoryLogService historyLogService;

    private final Logger logger = LoggerFactory.getLogger(HistoryLogController.class);

    @GetMapping("/findAllHistoryLog")
    public ResponseEntity<List<HistoryLogResponse>> getAllHistoryLog() {

        try {
            return ResponseEntity.ok(historyLogService.getAllHistoryLogs());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveHistoryLog")
    public ResponseEntity<HistoryLogResponse> saveHistoryLog(@RequestBody HistoryLog historyLog) {
        try {
            HistoryLogResponse historyLogResponse = historyLogService.addHistoryLog(historyLog);
            if (historyLogResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(historyLogResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateHistoryLog")
    public ResponseEntity<HistoryLogResponse> updateHistoryLog(@RequestBody HistoryLog historyLog) {
        try {
            HistoryLogResponse historyLogResponse = historyLogService.updateHistoryLog(historyLog);
            if (historyLogResponse != null) {
                return ResponseEntity.ok(historyLogResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteHistoryLog/{historyId}")
    public ResponseEntity<String> deleteHistoryLog(@PathVariable String historyId) {
        try {
            if (historyLogService.findByHistoryLogId(Long.parseLong(historyId))) {
                historyLogService.deleteHistoryLog(Long.parseLong(historyId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/userrequest/{requestId}")
    public ResponseEntity<List<HistoryLogResponse>> getAllHistoryLogForUserRequest(@PathVariable String requestId) {
        try {
            return ResponseEntity.ok(historyLogService.getHistoryLogForUserRequest(Long.parseLong(requestId)));
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
