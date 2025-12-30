package intelizign.tcuserapp.backend.repository.admin;

import intelizign.tcuserapp.backend.model.UserHistory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.StringMatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {

    List<UserHistory> findBySystemName(String systemName);

    @Query("SELECT userHist FROM UserHistory userHist WHERE userHist.gID = :gid AND userHist.systemName = :systemName")
    List<UserHistory> getUserByGIDAndSystemName(String gid, String systemName);

    @Query("SELECT userHist FROM UserHistory userHist WHERE userHist.tcUserId = :tcUserId AND userHist.systemName = :systemName")
    List<UserHistory> getUserByTCUserIdAndSystemName(String tcUserId, String systemName);

    public default List<UserHistory> findByAttributes(UserHistory userHistorySearch) {

        ExampleMatcher exampleMatcher = ExampleMatcher.matchingAll().withIgnoreNullValues()
                .withStringMatcher(StringMatcher.CONTAINING);

        Example<UserHistory> exampleUserHistory = Example.of(userHistorySearch, exampleMatcher);
        return findAll(exampleUserHistory);
    }
}
