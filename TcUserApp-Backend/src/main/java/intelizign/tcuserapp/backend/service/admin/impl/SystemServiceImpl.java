package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.SystemResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.repository.admin.ServiceRepository;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.service.admin.SystemService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemServiceImpl implements SystemService {

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    SystemResponse systemResponse;

    private final Logger logger = LoggerFactory.getLogger(SystemServiceImpl.class);

    @Override
    public List<SystemResponse> getAllSystems() {
        try {
            return systemRepository.getAllSystem();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public SystemResponse addSystem(System system) {
        try {
            intelizign.tcuserapp.backend.model.Service service = serviceRepository
                    .findById(system.getService().getServiceId()).orElseThrow(() -> new ResourceNotFoundException(
                            "No service found with serviceId " + system.getService().getServiceId()));

            Optional<System> systemInDB = systemRepository.findBySystemName(system.getSystemName());
            if (systemInDB.isPresent()) {
                throw new DuplicateResourceException("System already exists with systemName " + system.getSystemName());
            }

            system.setService(service);
            System savedSystem = systemRepository.save(system);
            modelMapper.map(savedSystem, systemResponse);
            return systemResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public SystemResponse updateSystem(System system) {
        try {
            intelizign.tcuserapp.backend.model.Service service = serviceRepository
                    .findById(system.getService().getServiceId()).orElseThrow(() -> new ResourceNotFoundException(
                            "No service found with serviceId " + system.getService().getServiceId()));

            System existingSystem = systemRepository.findById(system.getSystemId()).orElseThrow(
                    () -> new ResourceNotFoundException("No system found with systemId " + system.getSystemId()));

            Optional<System> systemInDB = systemRepository.findBySystemName(system.getSystemName());
            if (systemInDB.isPresent()) {
                if (!systemInDB.get().getSystemId().equals(system.getSystemId())) {
                    throw new DuplicateResourceException("System already exists with systemName " + system.getSystemName());
                }
            }

            existingSystem.setSystemName(system.getSystemName());
            existingSystem.setService(service);
            System savedSystem = systemRepository.save(existingSystem);
            modelMapper.map(savedSystem, systemResponse);
            return systemResponse;
        } catch (DuplicateResourceException | ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteSystem(Long systemId) {
        try {
            systemRepository.deleteById(systemId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findBySystemId(Long systemId) {
        try {
            return systemRepository.findById(systemId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<SystemResponse> getAllSystemByServiceId(Long serviceId) {
        List<SystemResponse> systemResponses = null;
        try {
            intelizign.tcuserapp.backend.model.Service service = serviceRepository
                    .findById(serviceId).orElseThrow(() -> new ResourceNotFoundException(
                            "No service found with serviceId " + serviceId));

            systemResponses = systemRepository.getSystemByServiceId(serviceId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return systemResponses;
    }
}
