package intelizign.tcuserapp.backend.controller.admin;

import intelizign.tcuserapp.backend.dto.CountryResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Country;
import intelizign.tcuserapp.backend.service.admin.CountryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/izn/admin/country")
public class CountryController {

    @Autowired
    CountryService countryService;

    private final Logger logger = LoggerFactory.getLogger(CountryController.class);

    @GetMapping("/findAllCountry")
    public ResponseEntity<List<CountryResponse>> getAllCountries() {
        try {
            return ResponseEntity.ok(countryService.getAllCountries());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveCountry")
    public ResponseEntity<CountryResponse> saveCountry(@RequestBody Country country) {
        try {
            CountryResponse countryResponse = countryService.addContry(country);
            if (countryResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(countryResponse);
            }
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateCountry")
    public ResponseEntity<CountryResponse> updateCountry(@RequestBody Country country) {
        try {
            CountryResponse countryResponse = countryService.updateContry(country);
            if (countryResponse != null) {
                return ResponseEntity.ok(countryResponse);
            }
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteCountry/{countryId}")
    public ResponseEntity<String> deleteCountry(@PathVariable String countryId) {
        try {
            if (countryService.findByCountryId(Long.parseLong(countryId))) {
                countryService.deleteCountry(Long.parseLong(countryId));
                return ResponseEntity.ok().build();
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{countryId}")
    public ResponseEntity<CountryResponse> getCountryById(@PathVariable String countryId) {
        try {
            return ResponseEntity.ok(countryService.getCountryById(Long.parseLong(countryId)));
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getCountry/search")
    public ResponseEntity<List<CountryResponse>> getAllCountrySearch(@RequestBody Country countrySearch) {
        try {
            List<CountryResponse> countryResponces = countryService.getAllCountrySearch(countrySearch);

            if (countryResponces != null)
                return ResponseEntity.ok(countryResponces);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getCountry/import")
    public ResponseEntity<List<CountryResponse>> importCountryExcel(@RequestParam("file") MultipartFile file) {
        try {
            List<CountryResponse> countryResponse = countryService.importCountryExcel(file);
            if (countryResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(countryResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
