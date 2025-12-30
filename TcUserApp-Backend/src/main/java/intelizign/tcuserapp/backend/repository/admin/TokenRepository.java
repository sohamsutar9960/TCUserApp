package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("SELECT t from Token t INNER JOIN User u ON t.user.userId = u.userId " +
            "WHERE t.user.userId = :userId AND t.loggedOut = false")
    List<Token> findAllTokenByUser(Long userId);

    Optional<Token> findByToken(String token);
}
