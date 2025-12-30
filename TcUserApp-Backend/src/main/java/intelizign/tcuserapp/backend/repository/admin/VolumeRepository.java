package intelizign.tcuserapp.backend.repository.admin;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import intelizign.tcuserapp.backend.dto.VolumeResponse;
import intelizign.tcuserapp.backend.model.Volume;

public interface VolumeRepository extends JpaRepository<Volume, Long> {

	@Query("SELECT new intelizign.tcuserapp.backend.dto.VolumeResponse(vol.volumeId, vol.volumeName, sys.systemId, sys.systemName)"
			+ " FROM Volume vol JOIN vol.system sys")
	public List<VolumeResponse> getVolumeInformation();

	@Query("SELECT new intelizign.tcuserapp.backend.dto.VolumeResponse(vol.volumeId, vol.volumeName, sys.systemId, sys.systemName)"
			+ " FROM Volume vol JOIN vol.system sys WHERE vol.volumeId = :volumeId")
	public VolumeResponse getVolumeById(Long volumeId);

	@Query("SELECT new intelizign.tcuserapp.backend.dto.VolumeResponse(vol.volumeId, vol.volumeName, sys.systemId, sys.systemName)"
			+ " FROM Volume vol JOIN vol.system sys WHERE sys.systemId = :systemId")
	public List<VolumeResponse> getVolumesBySystemId(Long systemId);

}
