import { API, userEndpoints } from "../api";
import UserRegistration from "../models/userRegistraionModel";

class TcUserRegistration {
  static createUser(user: UserRegistration) {
    return API.post(userEndpoints.api.user.saveUser, user);
  }
  static updateUser(user: UserRegistration) {
    return API.put(userEndpoints.api.user.updateUser, user);
  }
  static deleteUser(id: number) {
    return API.delete(userEndpoints.api.user.deleteUser(id));
  }
  static findAllUsers() {
    return API.get(userEndpoints.api.user.findAllUsers);
  }
}

export default TcUserRegistration;
