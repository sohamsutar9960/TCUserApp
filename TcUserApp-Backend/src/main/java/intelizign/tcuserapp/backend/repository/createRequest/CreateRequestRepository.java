package intelizign.tcuserapp.backend.repository.createRequest;

import intelizign.tcuserapp.backend.model.UserRequest;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreateRequestRepository extends JpaRepository<UserRequest, Long> {

    default List<UserRequest> findByAttributes(UserRequest userRequestSearch) {
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);

        Example<UserRequest> userRequestExample = Example.of(userRequestSearch, exampleMatcher);
        return findAll(userRequestExample);
    }
}
