import { API, adminEndpoints } from "../api";
import Service from "../models/ServiceModel";

class TcService {
  static createService(service: Service) {
    return API.post(adminEndpoints.api.service.saveService, service);
  }
  static updateService(service: Service) {
    return API.put(adminEndpoints.api.service.updateService, service);
  }
  static deleteService(id: number) {
    return API.delete(adminEndpoints.api.service.deleteService(id));
  }
  static findAllServices() {
    return API.get(adminEndpoints.api.service.findAllService);
  }
}

export default TcService;
