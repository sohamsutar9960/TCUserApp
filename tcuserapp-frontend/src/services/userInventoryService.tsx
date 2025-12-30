import { API, adminEndpoints } from "../api";

class TcUserInventoryService {
  static changeUserInventoryStatus(
    systemId: number,
    UserId: string,
    status: number,
  ) {
    return API.get(
      adminEndpoints.api.TcUserInventoryService.CHANGE_USER_INEVENTORY_USER(
        systemId,
        UserId,
        status,
      ),
    );
  }
  static getAllTcUserBySelect(systemId: number) {
    return API.get(
      adminEndpoints.api.TcUserInventoryService.GET_DATA_BY_SYSTEMID(systemId),
    );
  }
}

export default TcUserInventoryService;
