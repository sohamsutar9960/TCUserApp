package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.SystemResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.service.admin.SystemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/system")
public class SystemController {

    @Autowired
    SystemService systemService;

    private final Logger logger = LoggerFactory.getLogger(SystemController.class);

    @GetMapping("/findAllSystem")
    public ResponseEntity<List<SystemResponse>> getAllSystem() {
        try {
            return ResponseEntity.ok(systemService.getAllSystems());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveSystem")
    public ResponseEntity<SystemResponse> saveSystem(@RequestBody System system) {
        try {
            SystemResponse systemResponse = systemService.addSystem(system);
            if (systemResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(systemResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateSystem")
    public ResponseEntity<SystemResponse> updateSystem(@RequestBody System updateSystem) {
        try {
            SystemResponse systemResponse = systemService.updateSystem(updateSystem);
            if (systemResponse != null) {
                return ResponseEntity.ok(systemResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteSystem/{systemId}")
    public ResponseEntity<String> deleteSystem(@PathVariable String systemId) {
        try {
            if (systemService.findBySystemId(Long.parseLong(systemId))) {
                systemService.deleteSystem(Long.parseLong(systemId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getSystem/service/{serviceId}")
    public ResponseEntity<List<SystemResponse>> getAllSystem(@PathVariable String serviceId) {

        try {
            return ResponseEntity.ok(systemService.getAllSystemByServiceId(Long.parseLong(serviceId)));
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
