package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.CountryResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.Country;
import intelizign.tcuserapp.backend.repository.admin.CountryRepository;
import intelizign.tcuserapp.backend.service.admin.CountryService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CountryServiceImpl implements CountryService {

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    CountryResponse countryResponse;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(CountryServiceImpl.class);

    @Override
    public List<CountryResponse> getAllCountries() {
        try {
            List<Country> countryList = countryRepository.findAll(Sort.by(Sort.Direction.ASC, "countryCode"));
            return countryList.stream().map(country -> new CountryResponse(country.getCountryId(),
                    country.getCountryCode(), country.getCountryName())).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public CountryResponse addContry(Country country) {
        try {
            if (countryRepository.findAll()
                    .stream()
                    .anyMatch(countryInDB -> countryInDB.getCountryCode().equalsIgnoreCase(country.getCountryCode()))) {
                throw new DuplicateResourceException("Country code already exists with " + country.getCountryCode());
            }
            Country savedCountry = countryRepository.save(country);
            modelMapper.map(savedCountry, countryResponse);
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return countryResponse;
    }

    @Override
    public CountryResponse updateContry(Country country) {
        try {
            Country existingInDB = countryRepository.findById(country.getCountryId()).orElseThrow(
                    () -> new ResourceNotFoundException("No country found with countryId " + country.getCountryId()));

            if (countryRepository.findAll().stream()
                    .anyMatch(countryInDB -> countryInDB.getCountryCode().equalsIgnoreCase(country.getCountryCode()))) {
                throw new DuplicateResourceException("Country code already exists with " + country.getCountryCode());
            }

            existingInDB.setCountryCode(country.getCountryCode());
            existingInDB.setCountryName(country.getCountryName());
            Country updatedCountry = countryRepository.save(existingInDB);
            modelMapper.map(updatedCountry, countryResponse);
            return countryResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteCountry(Long countryId) {
        try {
            countryRepository.deleteById(countryId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByCountryId(Long countryId) {
        try {
            return countryRepository.findById(countryId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public CountryResponse getCountryById(Long countryId) {
        try {
            if (countryRepository.findById(countryId).isPresent()) {
                Country countryInDB = countryRepository.findById(countryId).get();
                modelMapper.map(countryInDB, countryResponse);
                return countryResponse;
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<CountryResponse> getAllCountrySearch(Country countrySearch) {
        try {
            List<Country> countryList = countryRepository.findByAttributes(countrySearch);
            return countryList.stream().map(country -> new CountryResponse(country.getCountryId(),
                    country.getCountryCode(), country.getCountryName())).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<CountryResponse> importCountryExcel(MultipartFile file) {
        try {
            List<Country> countryDBList = countryRepository.findAll(Sort.by(Sort.Direction.ASC, "countryCode"));
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            List<Country> countryInExcel = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue;
                }
                Optional<Country> countryFound = countryDBList.stream()
                        .filter(ctry -> ctry.getCountryCode().equalsIgnoreCase(row.getCell(0).getStringCellValue())).findFirst();
                if (countryFound.isEmpty()) {
                    Country country = new Country();
                    country.setCountryCode(row.getCell(0).getStringCellValue());
                    country.setCountryName(row.getCell(1).getStringCellValue());
                    countryInExcel.add(country);
                }
            }
            if (!countryInExcel.isEmpty()) {
                countryRepository.saveAll(countryInExcel);
            }

            List<Country> countryListInDB = countryRepository.findAll(Sort.by(Sort.Direction.ASC, "countryCode"));
            return countryListInDB.
                    stream().
                    map((country) -> modelMapper.map(country, CountryResponse.class)).
                    collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
