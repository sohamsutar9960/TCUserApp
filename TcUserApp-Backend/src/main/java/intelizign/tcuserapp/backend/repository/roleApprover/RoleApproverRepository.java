package intelizign.tcuserapp.backend.repository.roleApprover;

import intelizign.tcuserapp.backend.enums.ENUM_UserRequest_RequestStatus;
import intelizign.tcuserapp.backend.model.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoleApproverRepository extends JpaRepository<UserRequest, Long> {

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.requestStatus = :status ORDER BY requestId DESC")
    List<UserRequest> getAllOpenRequest(ENUM_UserRequest_RequestStatus status);

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.requestStatus = :status ORDER BY requestId DESC")
    List<UserRequest> getAllApprovedRequest(ENUM_UserRequest_RequestStatus status);

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.requestStatus = :status ORDER BY requestId DESC")
    List<UserRequest> getAllRejectedRequest(ENUM_UserRequest_RequestStatus status);

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.requestStatus = :status ORDER BY requestId DESC")
    List<UserRequest> getAllExportedRequest(ENUM_UserRequest_RequestStatus status);
}
