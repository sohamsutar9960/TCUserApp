package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.GroupRoleApprover;
import intelizign.tcuserapp.backend.repository.admin.GroupRoleApproverRepository;
import intelizign.tcuserapp.backend.service.admin.GroupRoleApproverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupRoleApproverServiceImpl implements GroupRoleApproverService {

    @Autowired
    GroupRoleApproverRepository groupRoleApproverRepository;

    final Logger logger = LoggerFactory.getLogger(GroupRoleApproverServiceImpl.class);

    @Override
    public List<GroupRoleApprover> findAllGroupRoleApprover() {
        try {
            return groupRoleApproverRepository.findAll();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupRoleApprover findBygID(String gid) {
        try {
            Optional<GroupRoleApprover> groupRoleApproverInDB = groupRoleApproverRepository.findByGid(gid);
            if (groupRoleApproverInDB.isPresent())
                return groupRoleApproverInDB.get();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupRoleApprover saveGroupRoleApprover(GroupRoleApprover groupRoleApprover) {
        try {
            List<GroupRoleApprover> groupRoleApproverList = groupRoleApproverRepository.findAll();

            Optional<GroupRoleApprover> groupRoleApproverInDB = groupRoleApproverList.stream().filter(
                            groupApproverInDB -> groupApproverInDB.getGid().equalsIgnoreCase(groupRoleApprover.getGid()))
                    .findFirst();

            if (groupRoleApproverInDB.isPresent()) {
                throw new DuplicateResourceException("Duplicate GroupRoleApprover found with gid " + groupRoleApproverInDB.get().getGid());
            } else {
                return groupRoleApproverRepository.save(groupRoleApprover);
            }
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupRoleApprover updateGroupRoleApprover(GroupRoleApprover groupRoleApprover) {
        try {
            GroupRoleApprover groupRoleApproverInDB = groupRoleApproverRepository
                    .findById(groupRoleApprover.getGroupRoleApproverId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No groupRoleApprover found with id " + groupRoleApprover.getGroupRoleApproverId()));

            Optional<GroupRoleApprover> approverInDB = groupRoleApproverRepository.findByGid(groupRoleApprover.getGid());
            if (approverInDB.isPresent()) {
                if (!approverInDB.get().getGroupRoleApproverId().equals(groupRoleApprover.getGroupRoleApproverId()))
                    throw new DuplicateResourceException("Duplicate GroupRoleApprover found with gid " + approverInDB.get().getGid());
            }
            groupRoleApproverInDB.setCity(groupRoleApprover.getCity());
            groupRoleApproverInDB.setCountry(groupRoleApprover.getCountry());
            groupRoleApproverInDB.setDepartment(groupRoleApprover.getDepartment());
            groupRoleApproverInDB.setDisplayName(groupRoleApprover.getDisplayName());
            groupRoleApproverInDB.setEmail(groupRoleApprover.getEmail());
            groupRoleApproverInDB.setFirstName(groupRoleApprover.getFirstName());
            groupRoleApproverInDB.setFullName(groupRoleApprover.getFullName());
            groupRoleApproverInDB.setGid(groupRoleApprover.getGid());
            groupRoleApproverInDB.setIsActive(groupRoleApprover.getIsActive());
            groupRoleApproverInDB.setLastName(groupRoleApprover.getLastName());
            groupRoleApproverInDB.setLineManager(groupRoleApprover.getLineManager());
            groupRoleApproverInDB.setLocality(groupRoleApprover.getLocality());
            groupRoleApproverInDB.setMobileNumber(groupRoleApprover.getMobileNumber());
            groupRoleApproverInDB.setOrganization(groupRoleApprover.getOrganization());
            groupRoleApproverInDB.setOrganizationID(groupRoleApprover.getOrganizationID());
            groupRoleApproverInDB.setOsUserName(groupRoleApprover.getOsUserName());
            groupRoleApproverInDB.setSponsor(groupRoleApprover.getSponsor());

            return groupRoleApproverRepository.save(groupRoleApproverInDB);
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public GroupRoleApprover updateIsActive(GroupRoleApprover groupRoleApprover) {
        try {
            GroupRoleApprover groupRoleApproverInDB = groupRoleApproverRepository
                    .findById(groupRoleApprover.getGroupRoleApproverId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No groupRoleApprover found with id " + groupRoleApprover.getGroupRoleApproverId()));

            groupRoleApproverInDB.setIsActive(groupRoleApprover.getIsActive());
            return groupRoleApproverRepository.save(groupRoleApproverInDB);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public List<GroupRoleApprover> getGroupRoleApproverSearch(GroupRoleApprover groupRoleApproverSearch) {
        try {
            return groupRoleApproverRepository.findByAttributes(groupRoleApproverSearch);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
