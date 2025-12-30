package intelizign.tcuserapp.backend.service.rest;

import intelizign.tcuserapp.backend.dto.SCDRestResponse;

public interface SCDRestService {

	SCDRestResponse getDataFromSCDAPI(String gid);

}
