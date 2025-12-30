package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.VolumeResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Volume;
import intelizign.tcuserapp.backend.service.admin.VolumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/volume")
public class VolumeController {

    @Autowired
    VolumeService volumeService;

    private final Logger logger = LoggerFactory.getLogger(VolumeController.class);

    @GetMapping("/findAllVolume")
    public ResponseEntity<List<VolumeResponse>> getAllVolume() {
        try {
            return ResponseEntity.ok(volumeService.getAllVolumes());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveVolume")
    public ResponseEntity<VolumeResponse> saveVolume(@RequestBody Volume volume) {
        try {
            VolumeResponse volumeResponse = volumeService.addVolume(volume);
            if (volumeResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(volumeResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateVolume")
    public ResponseEntity<VolumeResponse> updateVolume(@RequestBody Volume updateVolume) {
        try {
            VolumeResponse volumeResponse = volumeService.updateVolume(updateVolume);
            if (volumeResponse != null) {
                return ResponseEntity.ok(volumeResponse);
            }
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteVolume/{volumeId}")
    public ResponseEntity<String> deleteVolume(@PathVariable String volumeId) {
        try {
            if (volumeService.findByVolumeId(Long.parseLong(volumeId))) {
                volumeService.deleteVolume(Long.parseLong(volumeId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getVolume/system/{systemId}")
    public ResponseEntity<List<VolumeResponse>> getVolumesForSystem(@PathVariable String systemId) {
        try {
            List<VolumeResponse> responses = volumeService.getAllVolumesBasedOnSystem(Long.parseLong(systemId));
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
}
