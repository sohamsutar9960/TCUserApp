package intelizign.tcuserapp.backend.repository.admin;

import java.util.List;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;

import intelizign.tcuserapp.backend.model.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {

	public default List<Country> findByAttributes(Country countrySearch) {

		ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
				.withStringMatcher(StringMatcher.CONTAINING);

		Example<Country> countryExample = Example.of(countrySearch, exampleMatcher);
		return findAll(countryExample);
	}

	/*@Query("SELECT new intelizign.tcuserapp.backend.dto.CountryResponse(ctry.countryId, ctry.countryCode, ctry.countryName) "
			+ "FROM Country ctry JOIN ctry.userRequest userReq")
	public CountryResponse getCountryForUserRequest(Long requestId);*/

}
