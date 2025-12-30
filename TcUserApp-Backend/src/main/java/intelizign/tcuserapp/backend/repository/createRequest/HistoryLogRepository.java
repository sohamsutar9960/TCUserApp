package intelizign.tcuserapp.backend.repository.createRequest;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import intelizign.tcuserapp.backend.dto.HistoryLogResponse;
import intelizign.tcuserapp.backend.model.HistoryLog;

public interface HistoryLogRepository extends JpaRepository<HistoryLog, Long> {

	@Query("Select intelizign.tcuserapp.backend.dto.HistoryLogResponse(histLog.historyId, "
			+ "histLog.creationDate, histLog.comments, histLog.historyLogActionMode, "
			+ "histLog.userRequest.requestId) FROM HistoryLog histLog "
			+ "where histLog.userRequest.requestId = :requestId")
	List<HistoryLogResponse> getHistoryLogForUserRequest(Long requestId);
}
