package intelizign.tcuserapp.backend.dto;

import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HistoryLogResponse {
    private Long historyId;
    private Date creationDate;
    private String comments;
    private ENUM_HistoryLog_ActionMode historyLogActionMode;
    private Long requestId;
}
