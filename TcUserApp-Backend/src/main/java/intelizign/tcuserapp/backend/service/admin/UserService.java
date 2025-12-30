package intelizign.tcuserapp.backend.service.admin;

import java.util.List;

import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.model.User;

public interface UserService {

	List<UserResponse> getAllUsers();

	UserResponse addUser(User user);

	UserResponse updateUser(User user);

	void deleteUser(Long userId);

	boolean findByUserId(Long userId);
	
	List<UserResponse> getAllUserFromSearch(User userSearch);
	
	UserResponse getUserByGid(String gid);

}
