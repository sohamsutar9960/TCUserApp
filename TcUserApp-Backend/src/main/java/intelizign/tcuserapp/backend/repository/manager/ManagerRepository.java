package intelizign.tcuserapp.backend.repository.manager;

import intelizign.tcuserapp.backend.model.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ManagerRepository extends JpaRepository<UserRequest, Long> {

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.costManagerSelf.gID = :gid")
    List<UserRequest> getRequestForSelf(String gid);

    @Query("SELECT userReq FROM UserRequest userReq WHERE userReq.costManagerForAnother.gID = :gid")
    List<UserRequest> getRequestForOther(String gid);
}
