package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.ServiceResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.repository.admin.ServiceRepository;
import intelizign.tcuserapp.backend.service.admin.Service;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceImpl implements Service {

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ServiceResponse serviceResponse;

    private final Logger logger = LoggerFactory.getLogger(ServiceImpl.class);

    @Override
    public List<ServiceResponse> getAllServices() {
        List<ServiceResponse> serviceResponseList = null;
        try {
            serviceResponseList = serviceRepository.getServiceInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return serviceResponseList;
    }

    @Override
    public ServiceResponse addService(intelizign.tcuserapp.backend.model.Service service) {
        try {
            Optional<intelizign.tcuserapp.backend.model.Service> serviceInDB = serviceRepository.findByServiceName(service.getServiceName().trim());
            if (serviceInDB.isPresent()) {
                throw new DuplicateResourceException("Service already exists with serviceName " + service.getServiceName().trim());
            }
            intelizign.tcuserapp.backend.model.Service savedService = serviceRepository.save(service);
            modelMapper.map(savedService, serviceResponse);
        } catch (DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return serviceResponse;
    }

    @Override
    public ServiceResponse updateService(intelizign.tcuserapp.backend.model.Service updateService) {
        try {
            intelizign.tcuserapp.backend.model.Service existingService = serviceRepository
                    .findById(updateService.getServiceId()).orElseThrow(() -> new ResourceNotFoundException(
                            "No service found with serviceId " + updateService.getServiceId()));

            Optional<intelizign.tcuserapp.backend.model.Service> serviceInDB = serviceRepository.findByServiceName(updateService.getServiceName());
            if (serviceInDB.isPresent()) {
                if (!serviceInDB.get().getServiceId().equals(updateService.getServiceId())) {
                    throw new DuplicateResourceException("Service already exists with serviceName " + updateService.getServiceName().trim());
                }
            }
            existingService.setServiceName(updateService.getServiceName());

            intelizign.tcuserapp.backend.model.Service savedService = serviceRepository.save(existingService);
            modelMapper.map(savedService, serviceResponse);
            return serviceResponse;
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public void deleteService(Long serviceId) {
        try {
            serviceRepository.deleteById(serviceId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByServiceId(Long serviceId) {
        try {
            return serviceRepository.findById(serviceId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }
}
