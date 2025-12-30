package intelizign.tcuserapp.backend.service.admin;

import intelizign.tcuserapp.backend.dto.UserHistoryResponse;
import intelizign.tcuserapp.backend.model.UserHistory;

import java.util.List;

public interface UserHistoryService {

    List<UserHistoryResponse> getAllUserHistory();

    UserHistoryResponse addUserHistory(UserHistory userHistory);

    UserHistoryResponse updateUserHistory(UserHistory userHistory);

    void deleteUserHistory(Long userHistoryId);

    List<UserHistoryResponse> getAllUserHistoryBasedOnSystem(String systemName);

    List<UserHistoryResponse> getUserHistoryByGIDAndSystemName(String gid, String systemName);

    boolean findByUserHistoryId(Long userHistoryId);

    List<UserHistoryResponse> getAllUserHistorySearch(UserHistory userHistorySearch);
}
