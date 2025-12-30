package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.TCConfigResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.TCConfiguration;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.repository.admin.TCConfigurationRepository;
import intelizign.tcuserapp.backend.service.admin.TCConfigurationService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TCConfigurationServiceImpl implements TCConfigurationService {

    @Autowired
    TCConfigurationRepository tcConfigurationRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TCConfigResponse tcConfigResponse;

    @Autowired
    SystemRepository systemRepository;

    private final Logger logger = LoggerFactory.getLogger(TCConfigurationServiceImpl.class);

    @Override
    public List<TCConfigResponse> getAllTCConfigurations() {
        try {
            return tcConfigurationRepository.getAllTCConfigurationInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public TCConfigResponse addTCConfiguration(TCConfiguration tcConfiguration) {
        try {
            System systemInDB = systemRepository.findById(tcConfiguration.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + tcConfiguration.getSystem().getSystemId()));
            tcConfiguration.setSystem(systemInDB);

            List<TCConfiguration> tcConfigurations = tcConfigurationRepository.getTCConfigurationForSystem(tcConfiguration.getSystem().getSystemId());
            if (!tcConfigurations.isEmpty()) {
                throw new DuplicateResourceException("Teamcenter configurations is already added for system " + systemInDB.getSystemName());
            }

            tcConfiguration.setPassword(tcConfiguration.getPassword());
            TCConfiguration savedTCConfig = tcConfigurationRepository.save(tcConfiguration);
            modelMapper.map(savedTCConfig, tcConfigResponse);
            return tcConfigResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public TCConfigResponse updateTCConfiguration(TCConfiguration tcConfiguration) {
        try {
            TCConfiguration existingTCConfig = tcConfigurationRepository.findById(tcConfiguration.getTcConfigId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No TCConfiguration found with tcConfigId " + tcConfiguration.getTcConfigId()));

            System systemInDB = systemRepository.findById(tcConfiguration.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + tcConfiguration.getTcConfigId()));

            List<TCConfiguration> tcConfigurations = tcConfigurationRepository.getTCConfigurationForSystem(tcConfiguration.getSystem().getSystemId());
            if (!tcConfigurations.isEmpty()) {
                if (!existingTCConfig.getTcConfigId().equals(tcConfigurations.get(0).getTcConfigId()))
                    throw new DuplicateResourceException("Teamcenter configurations is already added for system " + systemInDB.getSystemName());
            }

            existingTCConfig.setActive(tcConfiguration.getActive());
            existingTCConfig.setConfigName(tcConfiguration.getConfigName());
            existingTCConfig.setFmsURL(tcConfiguration.getFmsURL());

            existingTCConfig.setPassword(tcConfiguration.getPassword());
            existingTCConfig.setSsoEnabled(tcConfiguration.getSsoEnabled());
            existingTCConfig.setSsoIdentityURL(tcConfiguration.getSsoIdentityURL());

            existingTCConfig.setSsoLoginURL(tcConfiguration.getSsoLoginURL());
            existingTCConfig.setSsoTCAppId(tcConfiguration.getSsoTCAppId());
            existingTCConfig.setSystem(systemInDB);

            existingTCConfig.setTcConfigId(tcConfiguration.getTcConfigId());
            existingTCConfig.setTcURL(tcConfiguration.getTcURL());
            existingTCConfig.setUserName(tcConfiguration.getUserName());

            TCConfiguration savedTCConfig = tcConfigurationRepository.save(existingTCConfig);
            modelMapper.map(savedTCConfig, tcConfigResponse);
            return tcConfigResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteTCConfiguration(Long tcConfigId) {
        try {
            tcConfigurationRepository.deleteById(tcConfigId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByTCConfigurationId(Long tcConfigId) {
        try {
            return tcConfigurationRepository.findById(tcConfigId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public TCConfigResponse getAllTCConfigurationFromSystem(Long systemId) {
        try {
            System systemInDB = systemRepository.findById(systemId)
                    .orElseThrow(() -> new ResourceNotFoundException("No system found with systemId " + systemId));
            List<TCConfiguration> tcConfigurations = tcConfigurationRepository.getTCConfigurationForSystem(systemId);
            if (!tcConfigurations.isEmpty()) {
                modelMapper.map(tcConfigurations.get(0), tcConfigResponse);
                return tcConfigResponse;
            }
            throw new ResourceNotFoundException("No teamcenter configuration found for system " + systemInDB.getSystemName());
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
