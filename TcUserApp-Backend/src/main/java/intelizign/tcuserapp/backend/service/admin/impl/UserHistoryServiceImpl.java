package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.UserHistoryResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.UserHistory;
import intelizign.tcuserapp.backend.repository.admin.UserHistoryRepository;
import intelizign.tcuserapp.backend.service.admin.UserHistoryService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserHistoryServiceImpl implements UserHistoryService {

    @Autowired
    UserHistoryRepository userHistoryRepository;

    @Autowired
    UserHistoryResponse userHistoryResponse;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(UserHistoryServiceImpl.class);

    @Override
    public List<UserHistoryResponse> getAllUserHistory() {
        try {
            List<UserHistory> userHistoryList = userHistoryRepository.findAll();
            return userHistoryList.stream()
                    .map(userHistory -> new UserHistoryResponse(userHistory.getUserHistoryId(), userHistory.getGID(),
                            userHistory.getTcUserId(), userHistory.getSystemName(), userHistory.getRequestStatus(),
                            userHistory.getUserStatus(), userHistory.getNeverLock(), userHistory.getTcCreated(),
                            userHistory.getTcAccountType()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserHistoryResponse addUserHistory(UserHistory userHistory) {
        try {
            //userHistory.setSystemName(userHistory.getSystemName().toUpperCase().trim());
            userHistory.setSystemName(userHistory.getSystemName().trim());
            UserHistory savedUserHistory = userHistoryRepository.save(userHistory);
            modelMapper.map(savedUserHistory, userHistoryResponse);
            return userHistoryResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public UserHistoryResponse updateUserHistory(UserHistory userHistory) {
        try {
            UserHistory existingUserHistory = userHistoryRepository.findById(userHistory.getUserHistoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No userHistory found with id " + userHistory.getUserHistoryId()));
            existingUserHistory.setGID(userHistory.getGID());
            existingUserHistory.setNeverLock(userHistory.getNeverLock());
            existingUserHistory.setRequestStatus(userHistory.getRequestStatus());
            //existingUserHistory.setSystemName(userHistory.getSystemName().toUpperCase().trim());
            existingUserHistory.setSystemName(userHistory.getSystemName().trim());
            existingUserHistory.setTcAccountType(userHistory.getTcAccountType());
            existingUserHistory.setTcCreated(userHistory.getTcCreated());
            existingUserHistory.setTcUserId(userHistory.getTcUserId());
            existingUserHistory.setUserStatus(userHistory.getUserStatus());

            UserHistory savedUserHistory = userHistoryRepository.save(existingUserHistory);
            modelMapper.map(savedUserHistory, userHistoryResponse);
            return userHistoryResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteUserHistory(Long userHistoryId) {
        try {
            userHistoryRepository.deleteById(userHistoryId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public List<UserHistoryResponse> getAllUserHistoryBasedOnSystem(String systemName) {
        try {
            List<UserHistory> userHistoryList = userHistoryRepository.findBySystemName(systemName.trim());
            if (!userHistoryList.isEmpty()) {
                return userHistoryList.stream()
                        .map(userHistory -> new UserHistoryResponse(userHistory.getUserHistoryId(),
                                userHistory.getGID(), userHistory.getTcUserId(), userHistory.getSystemName(),
                                userHistory.getRequestStatus(), userHistory.getUserStatus(), userHistory.getNeverLock(),
                                userHistory.getTcCreated(), userHistory.getTcAccountType()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<UserHistoryResponse> getUserHistoryByGIDAndSystemName(String gid, String systemName) {
        try {
            List<UserHistory> userHistoryList = userHistoryRepository.getUserByGIDAndSystemName(gid, systemName);
            if (!userHistoryList.isEmpty()) {
                return userHistoryList.stream()
                        .map(userHistory -> new UserHistoryResponse(userHistory.getUserHistoryId(),
                                userHistory.getGID(), userHistory.getTcUserId(), userHistory.getSystemName(),
                                userHistory.getRequestStatus(), userHistory.getUserStatus(), userHistory.getNeverLock(),
                                userHistory.getTcCreated(), userHistory.getTcAccountType()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public boolean findByUserHistoryId(Long userHistoryId) {
        try {
            return userHistoryRepository.findById(userHistoryId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<UserHistoryResponse> getAllUserHistorySearch(UserHistory userHistorySearch) {
        try {
            List<UserHistory> userHistoryList = userHistoryRepository.findByAttributes(userHistorySearch);
            return userHistoryList.stream()
                    .map(userHistory -> new UserHistoryResponse(userHistory.getUserHistoryId(), userHistory.getGID(),
                            userHistory.getTcUserId(), userHistory.getSystemName(), userHistory.getRequestStatus(),
                            userHistory.getUserStatus(), userHistory.getNeverLock(), userHistory.getTcCreated(),
                            userHistory.getTcAccountType()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
