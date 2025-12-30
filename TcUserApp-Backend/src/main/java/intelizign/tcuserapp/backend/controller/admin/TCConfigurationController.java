package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.TCConfigResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.TCConfiguration;
import intelizign.tcuserapp.backend.service.admin.TCConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/tcConfig")
public class TCConfigurationController {

    @Autowired
    TCConfigurationService tcConfigurationService;

    private final Logger logger = LoggerFactory.getLogger(TCConfigurationController.class);

    @GetMapping("/findAllTCConfig")
    public ResponseEntity<List<TCConfigResponse>> getAllTCConfigs() {
        try {
            return ResponseEntity.ok(tcConfigurationService.getAllTCConfigurations());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveTCConfig")
    public ResponseEntity<TCConfigResponse> saveTCConfig(@RequestBody TCConfiguration tcConfiguration) {
        try {
            TCConfigResponse tcConfigResponse = tcConfigurationService.addTCConfiguration(tcConfiguration);
            if (tcConfigResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(tcConfigResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateTCConfig")
    public ResponseEntity<TCConfigResponse> updateTCConfig(@RequestBody TCConfiguration updateTCConfiguration) {
        try {
            TCConfigResponse tcConfigResponse = tcConfigurationService.updateTCConfiguration(updateTCConfiguration);
            if (tcConfigResponse != null) {
                return ResponseEntity.ok(tcConfigResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteTCConfig/{tcConfigId}")
    public ResponseEntity<String> deleteTCConfig(@PathVariable String tcConfigId) {
        try {
            if (tcConfigurationService.findByTCConfigurationId(Long.parseLong(tcConfigId))) {
                tcConfigurationService.deleteTCConfiguration(Long.parseLong(tcConfigId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getTCConfig/system/{systemId}")
    public ResponseEntity<TCConfigResponse> getTCConfigForSystem(@PathVariable String systemId) {
        try {
            TCConfigResponse tcConfigResponse = tcConfigurationService
                    .getAllTCConfigurationFromSystem(Long.parseLong(systemId));
            if (tcConfigResponse != null) {
                return ResponseEntity.ok(tcConfigResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
