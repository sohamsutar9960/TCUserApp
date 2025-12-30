package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.CountryResponse;
import intelizign.tcuserapp.backend.model.Country;
import org.springframework.web.multipart.MultipartFile;

public interface CountryService {

	List<CountryResponse> getAllCountries();

	CountryResponse addContry(Country country);

	CountryResponse updateContry(Country country);

	void deleteCountry(Long countryId);

	boolean findByCountryId(Long countryId);

	CountryResponse getCountryById(Long countryId);
	
	List<CountryResponse> getAllCountrySearch(Country countrySearch);

	List<CountryResponse> importCountryExcel(MultipartFile file);

}
