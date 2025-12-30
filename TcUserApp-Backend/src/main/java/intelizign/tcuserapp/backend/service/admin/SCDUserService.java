package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.SCDUserResponse;
import intelizign.tcuserapp.backend.model.SCDUser;

public interface SCDUserService {

	List<SCDUserResponse> getAllScdUsers();

	SCDUserResponse addSCDUser(SCDUser scdUser);

	SCDUserResponse updateSCDUser(SCDUser scdUser);

	void deleteScdUser(Long scdUserId);

	boolean findBySCDUserId(Long scdUserId);

	SCDUserResponse getSCDUserByGID(String gid);
	
	List<SCDUserResponse> getAllSCDUserSearch(SCDUser scdUserSearch);

}
