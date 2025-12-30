package intelizign.tcuserapp.backend.controller.rest;

import intelizign.tcuserapp.backend.dto.SCDRestResponse;
import intelizign.tcuserapp.backend.service.rest.SCDRestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/izn/admin/api")
public class SCDController {

    @Autowired
    SCDRestService scdService;

    private final Logger logger = LoggerFactory.getLogger(SCDController.class);

    @GetMapping("/scd/{gid}")
    public ResponseEntity<SCDRestResponse> getDataFromSCD(@PathVariable String gid) {
        try {
            return ResponseEntity.ok(scdService.getDataFromSCDAPI(gid));
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

}
