package intelizign.tcuserapp.backend.service.admin.impl;

import intelizign.tcuserapp.backend.dto.VolumeResponse;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.System;
import intelizign.tcuserapp.backend.model.Volume;
import intelizign.tcuserapp.backend.repository.admin.SystemRepository;
import intelizign.tcuserapp.backend.repository.admin.VolumeRepository;
import intelizign.tcuserapp.backend.service.admin.VolumeService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolumeServiceImpl implements VolumeService {

    @Autowired
    VolumeRepository volumeRepository;

    @Autowired
    SystemRepository systemRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    VolumeResponse volumeResponse;

    private final Logger logger = LoggerFactory.getLogger(VolumeServiceImpl.class);

    @Override
    public List<VolumeResponse> getAllVolumes() {
        try {
            return volumeRepository.getVolumeInformation();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public VolumeResponse addVolume(Volume volume) {
        try {
            System system = systemRepository.findById(volume.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + volume.getSystem().getSystemId()));

            volume.setSystem(system);
            Volume savedVolume = volumeRepository.save(volume);
            modelMapper.map(savedVolume, volumeResponse);
            return volumeResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @Override
    public VolumeResponse updateVolume(Volume volume) {
        try {
            System system = systemRepository.findById(volume.getSystem().getSystemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No system found with systemId " + volume.getSystem().getSystemId()));

            Volume existingVolume = volumeRepository.findById(volume.getVolumeId()).orElseThrow(
                    () -> new EntityNotFoundException("No volume found with volumeId :-" + volume.getVolumeId()));

            existingVolume.setSystem(system);
            existingVolume.setVolumeName(volume.getVolumeName());

            Volume savedVolume = volumeRepository.save(existingVolume);
            modelMapper.map(savedVolume, volumeResponse);
            return volumeResponse;
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        return null;
    }

    @Override
    public void deleteVolume(Long volumeId) {
        try {
            volumeRepository.deleteById(volumeId);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    @Override
    public boolean findByVolumeId(Long volumeId) {
        try {
            return volumeRepository.findById(volumeId).isPresent();
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return false;
    }

    @Override
    public List<VolumeResponse> getAllVolumesBasedOnSystem(Long systemId) {
        try {
            if (systemRepository.findById(systemId).isPresent()) {
                return volumeRepository.getVolumesBySystemId(systemId);
            }
            throw new ResourceNotFoundException("No system found with systemId " + systemId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
