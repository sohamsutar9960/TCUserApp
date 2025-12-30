package intelizign.tcuserapp.backend.service.admin.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import intelizign.tcuserapp.backend.dto.HistoryLogResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.HistoryLog;
import intelizign.tcuserapp.backend.repository.createRequest.HistoryLogRepository;
import intelizign.tcuserapp.backend.service.admin.HistoryLogService;

@Service
public class HistoryLogServiceImpl implements HistoryLogService {

    @Autowired
    HistoryLogRepository historyLogRepository;

    @Autowired
    HistoryLogResponse historyLogResponse;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(HistoryLogServiceImpl.class);

    @Override
    public List<HistoryLogResponse> getAllHistoryLogs() {

        try {

            List<HistoryLog> historyLogList = historyLogRepository.findAll();

            return historyLogList.stream()
                    .map(historyLog -> new HistoryLogResponse(historyLog.getHistoryId(), historyLog.getCreationDate(),
                            historyLog.getComments(), historyLog.getHistoryLogActionMode(),
                            historyLog.getUserRequest().getRequestId()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @Override
    public HistoryLogResponse addHistoryLog(HistoryLog historyLog) {

        try {

            HistoryLog savedHistoryLog = historyLogRepository.save(historyLog);
            modelMapper.map(savedHistoryLog, historyLogResponse);
            return historyLogResponse;

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public HistoryLogResponse updateHistoryLog(HistoryLog historyLog) {

        try {

            HistoryLog existingHistoryLog = historyLogRepository.findById(historyLog.getHistoryId()).orElseThrow(
                    () -> new ResourceNotFoundException("No userhistory found with id " + historyLog.getHistoryId()));

            existingHistoryLog.setComments(historyLog.getComments());
            existingHistoryLog.setCreationDate(historyLog.getCreationDate());
            existingHistoryLog.setHistoryLogActionMode(historyLog.getHistoryLogActionMode());
            existingHistoryLog.setUserRequest(historyLog.getUserRequest());

            HistoryLog savedHistoryLog = historyLogRepository.save(existingHistoryLog);
            modelMapper.map(savedHistoryLog, historyLogResponse);
            return historyLogResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteHistoryLog(Long historyId) {

        try {
            historyLogRepository.deleteById(historyId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public List<HistoryLogResponse> getHistoryLogForUserRequest(Long requestId) {

        try {
            return historyLogRepository.getHistoryLogForUserRequest(requestId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @Override
    public boolean findByHistoryLogId(Long historyId) {

        try {
            return historyLogRepository.findById(historyId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return false;
    }

}
