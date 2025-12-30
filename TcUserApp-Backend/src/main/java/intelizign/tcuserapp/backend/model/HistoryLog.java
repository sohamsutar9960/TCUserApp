package intelizign.tcuserapp.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import intelizign.tcuserapp.backend.enums.ENUM_HistoryLog_ActionMode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "HistoryLog")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HistoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @Temporal(TemporalType.DATE)
    private Date creationDate;

    private String comments;

    @Enumerated(EnumType.STRING)
    private ENUM_HistoryLog_ActionMode historyLogActionMode;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private UserRequest userRequest;

}
