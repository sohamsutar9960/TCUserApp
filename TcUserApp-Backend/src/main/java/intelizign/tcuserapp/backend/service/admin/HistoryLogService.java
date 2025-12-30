package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.HistoryLogResponse;
import intelizign.tcuserapp.backend.model.HistoryLog;

public interface HistoryLogService {

	List<HistoryLogResponse> getAllHistoryLogs();

	HistoryLogResponse addHistoryLog(HistoryLog historyLog);

	HistoryLogResponse updateHistoryLog(HistoryLog historyLog);

	void deleteHistoryLog(Long historyId);

	List<HistoryLogResponse> getHistoryLogForUserRequest(Long requestId);

	boolean findByHistoryLogId(Long historyId);
}
