package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.VolumeResponse;
import intelizign.tcuserapp.backend.model.Volume;

public interface VolumeService {

	List<VolumeResponse> getAllVolumes();

	VolumeResponse addVolume(Volume volume);

	VolumeResponse updateVolume(Volume volume);

	void deleteVolume(Long volumeId);

	boolean findByVolumeId(Long volumeId);

	List<VolumeResponse> getAllVolumesBasedOnSystem(Long systemId);

}
