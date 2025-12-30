package intelizign.tcuserapp.backend.repository.myRequest;

import intelizign.tcuserapp.backend.model.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MyRequestRepository extends JpaRepository<UserRequest, Long> {

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.user.GID = :gid")
    List<UserRequest> getAllCreatedByMeRequests(String gid);

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.userRequestForAnother.gID = :gid")
    List<UserRequest> getAllCreatedForMeRequests(String gid);
}
