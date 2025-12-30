package intelizign.tcuserapp.backend.repository.admin;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;

import intelizign.tcuserapp.backend.model.SCDUser;

public interface SCDUserRepository extends JpaRepository<SCDUser, Long> {

	Optional<SCDUser> findBygID(String gid);

	public default List<SCDUser> findByAttributes(SCDUser scdUserSearch) {

		ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
				.withStringMatcher(StringMatcher.CONTAINING);

		Example<SCDUser> scdUserExample = Example.of(scdUserSearch, exampleMatcher);
		return findAll(scdUserExample);
	}

}
