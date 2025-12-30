package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.model.User;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    public User getUserByUsername(@Param("username") String username);

    @Query("SELECT new intelizign.tcuserapp.backend.dto.UserResponse(user.userId, user.fullName, "
            + "user.firstName, user.lastName, user.displayName, user.lineManager, user.sponsor, "
            + "user.department, user.organization, user.organizationID, user.country, "
            + "user.mobileNumber, user.username, user.password, user.email, user.GID, "
            + "userrole.roleId, userrole.roleName) FROM User user JOIN user.userRole userrole " + "WHERE user.id = :id")
    public UserResponse getUserById(Long id);

    @Query("SELECT new intelizign.tcuserapp.backend.dto.UserResponse(user.userId, user.fullName, "
            + "user.firstName, user.lastName, user.displayName, user.lineManager, user.sponsor, "
            + "user.department, user.organization, user.organizationID, user.country, "
            + "user.mobileNumber, user.username, user.password, user.email, user.GID, "
            + "userrole.roleId, userrole.roleName) FROM User user JOIN user.userRole userrole")
    public List<UserResponse> getAllUserInformation();

    public Optional<User> findByGID(String gid);

    public Optional<User> findByUsername(String userName);

    default List<User> findByAttributes(User userSearch) {
        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
                .withStringMatcher(StringMatcher.CONTAINING);

        Example<User> userExample = Example.of(userSearch, exampleMatcher);
        return findAll(userExample);
    }
}
