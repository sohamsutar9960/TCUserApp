package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.ServiceResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/service")
public class ServiceController {

    @Autowired
    intelizign.tcuserapp.backend.service.admin.Service service;

    private final Logger logger = LoggerFactory.getLogger(ServiceController.class);

    @GetMapping("/findAllService")
    public ResponseEntity<List<ServiceResponse>> getAllService() {
        try {
            return ResponseEntity.ok(service.getAllServices());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveService")
    public ResponseEntity<ServiceResponse> saveService(@RequestBody Service saveService) {
        try {
            ServiceResponse serviceResponse = service.addService(saveService);
            if (serviceResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(serviceResponse);
            }
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateService")
    public ResponseEntity<ServiceResponse> updateService(@RequestBody Service updateService) {
        try {
            ServiceResponse serviceResponse = service.updateService(updateService);
            if (serviceResponse != null) {
                return ResponseEntity.ok(serviceResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteService/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable String serviceId) {
        try {
            if (service.findByServiceId(Long.parseLong(serviceId))) {
                service.deleteService(Long.parseLong(serviceId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}
