import { API, adminEndpoints } from "../api";
import Volume from "../models/VolumeModel";

class TcVolume {
  static createVolume(volume: Volume) {
    return API.post(adminEndpoints.api.volume.saveVolume, volume);
  }
  static updateVolume(volume: Volume) {
    return API.put(adminEndpoints.api.volume.updateVolume, volume);
  }
  static deleteVolume(id: number) {
    return API.delete(adminEndpoints.api.volume.deleteVolume(id));
  }
  static findAllVolumes() {
    return API.get(adminEndpoints.api.volume.findAllVolumes);
  }
  static findVolumeById(systemId: number) {
    return API.get(adminEndpoints.api.volume.findVolumeById(systemId));
  }
}

export default TcVolume;
