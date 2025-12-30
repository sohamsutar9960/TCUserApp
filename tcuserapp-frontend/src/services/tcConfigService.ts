import { API, adminEndpoints } from "../api";
import { TcConfig } from "../models/tcConfigModel";

class TcConfigurtaion {
  static createTcConfig(tcConfig: TcConfig) {
    return API.post(adminEndpoints.api.tcConfig.saveTCConfig, tcConfig);
  }
  static updateTcConfig(tcConfig: TcConfig) {
    return API.put(adminEndpoints.api.tcConfig.updateTCConfig, tcConfig);
  }
  static deleteTcConfig(id: number) {
    return API.delete(adminEndpoints.api.tcConfig.deleteTCConfig(id));
  }
  static findAllTcConfig() {
    return API.get(adminEndpoints.api.tcConfig.findAllTcConfig);
  }
}

export default TcConfigurtaion;
