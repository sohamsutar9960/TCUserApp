import { API, adminEndpoints } from "../api";
import System from "../models/SystemModel";

class TcSystem {
  static createSystem(system: System) {
    return API.post(adminEndpoints.api.system.saveSystem, system);
  }
  static updateSystem(system: System) {
    return API.put(adminEndpoints.api.system.updateSystem, system);
  }
  static deleteSystem(id: number) {
    return API.delete(adminEndpoints.api.system.deleteSystem(id));
  }
  static findAllSystems() {
    return API.get(adminEndpoints.api.system.findAllSystem);
  }
  static findSystemByID(systemId: number) {
    return API.get(adminEndpoints.api.system.findSystemByID(systemId));
  }
}

export default TcSystem;
