import { API, userEndpoints } from "../api";
import { UserCreationData } from "../models/userCreationModel";

class TcUser {
  static createUser(user: UserCreationData) {
    return API.post(userEndpoints.api.user.saveUser, user);
  }
  static updateUser(user: UserCreationData) {
    return API.put(userEndpoints.api.user.updateUser, user);
  }
  static deleteUser(id: number) {
    return API.delete(userEndpoints.api.user.deleteUser(id));
  }
  static findAllUsers() {
    return API.get(userEndpoints.api.user.findAllUsers);
  }
  static searchUser(user: Partial<UserCreationData>) {
    // @ts-ignore
    return API.post(userEndpoints.api.user.SEARCH_USER, user);
  }
}

export default TcUser;
