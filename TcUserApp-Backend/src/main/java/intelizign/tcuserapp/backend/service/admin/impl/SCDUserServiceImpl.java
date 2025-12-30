package intelizign.tcuserapp.backend.service.admin.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import intelizign.tcuserapp.backend.dto.SCDUserResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.SCDUser;
import intelizign.tcuserapp.backend.repository.admin.SCDUserRepository;
import intelizign.tcuserapp.backend.service.admin.SCDUserService;

@Service
public class SCDUserServiceImpl implements SCDUserService {

    @Autowired
    SCDUserRepository scdUserRepository;

    @Autowired
    SCDUserResponse scdUserResponse;

    @Autowired
    ModelMapper modelMapper;

    private final Logger logger = LoggerFactory.getLogger(SCDUserServiceImpl.class);

    @Override
    public List<SCDUserResponse> getAllScdUsers() {

        try {
            List<SCDUser> scdUsers = scdUserRepository.findAll();
            return scdUsers.stream()
                    .map(scdUser -> new SCDUserResponse(scdUser.getScdUserId(), scdUser.getFullName(),
                            scdUser.getFirstName(), scdUser.getLastName(), scdUser.getGID(), scdUser.getDisplayName(),
                            scdUser.getEmail(), scdUser.getLineManager(), scdUser.getSponsor(), scdUser.getDepartment(),
                            scdUser.getOrganization(), scdUser.getOrganizationID(), scdUser.getCountry(),
                            scdUser.getMobileNumber()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public SCDUserResponse addSCDUser(SCDUser scdUser) {

        try {
            if (scdUserRepository.findBygID(scdUser.getGID()).isPresent()) {
                logger.error("Creation failed. Duplicate entry found for GID..!");
                return null;
            }
            SCDUser savedSCDUSer = scdUserRepository.save(scdUser);
            modelMapper.map(savedSCDUSer, scdUserResponse);
            return scdUserResponse;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public SCDUserResponse updateSCDUser(SCDUser scdUser) {

        try {
            SCDUser existingSCDUser = scdUserRepository.findById(scdUser.getScdUserId()).orElseThrow(
                    () -> new ResourceNotFoundException("No scdUser found with scdUserId " + scdUser.getScdUserId()));

            existingSCDUser.setCountry(scdUser.getCountry());
            existingSCDUser.setDepartment(scdUser.getDepartment());

            existingSCDUser.setDisplayName(scdUser.getDisplayName());
            existingSCDUser.setEmail(scdUser.getEmail());

            existingSCDUser.setFirstName(scdUser.getFirstName());
            existingSCDUser.setFullName(scdUser.getFullName());

            existingSCDUser.setGID(scdUser.getGID());
            existingSCDUser.setLastName(scdUser.getLastName());

            existingSCDUser.setGID(scdUser.getGID());
            existingSCDUser.setLastName(scdUser.getLastName());

            existingSCDUser.setLineManager(scdUser.getLineManager());
            existingSCDUser.setMobileNumber(scdUser.getMobileNumber());
            existingSCDUser.setOrganization(scdUser.getOrganization());

            existingSCDUser.setOrganizationID(scdUser.getOrganizationID());
            existingSCDUser.setSponsor(scdUser.getSponsor());

            SCDUser updatedSCDUser = scdUserRepository.save(existingSCDUser);
            modelMapper.map(updatedSCDUser, scdUserResponse);
            return scdUserResponse;

        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @Override
    public void deleteScdUser(Long scdUserId) {

        try {
            scdUserRepository.deleteById(scdUserId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findBySCDUserId(Long scdUserId) {
        try {
            return scdUserRepository.findById(scdUserId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public SCDUserResponse getSCDUserByGID(String gid) {

        try {
            if (scdUserRepository.findBygID(gid).isPresent()) {
                SCDUser scdUser = scdUserRepository.findBygID(gid).get();
                modelMapper.map(scdUser, scdUserResponse);
                return scdUserResponse;
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<SCDUserResponse> getAllSCDUserSearch(SCDUser scdUserSearch) {

        try {
            List<SCDUser> scdUserList = scdUserRepository.findByAttributes(scdUserSearch);
            return scdUserList.stream()
                    .map(scdUser -> new SCDUserResponse(scdUser.getScdUserId(), scdUser.getFullName(),
                            scdUser.getFirstName(), scdUser.getLastName(), scdUser.getGID(), scdUser.getDisplayName(),
                            scdUser.getEmail(), scdUser.getLineManager(), scdUser.getSponsor(), scdUser.getDepartment(),
                            scdUser.getOrganization(), scdUser.getOrganizationID(), scdUser.getCountry(),
                            scdUser.getMobileNumber()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
