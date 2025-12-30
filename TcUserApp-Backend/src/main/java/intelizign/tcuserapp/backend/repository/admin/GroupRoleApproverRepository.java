package intelizign.tcuserapp.backend.repository.admin;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;

import intelizign.tcuserapp.backend.model.GroupRoleApprover;

public interface GroupRoleApproverRepository extends JpaRepository<GroupRoleApprover, Long> {

	Optional<GroupRoleApprover> findByGid(String gid);

	default List<GroupRoleApprover> findByAttributes(GroupRoleApprover groupRoleApproverSearch) {

		ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
				.withStringMatcher(StringMatcher.CONTAINING);

		Example<GroupRoleApprover> groupRoleApproverExample = Example.of(groupRoleApproverSearch, exampleMatcher);
		return findAll(groupRoleApproverExample);

	}
}
