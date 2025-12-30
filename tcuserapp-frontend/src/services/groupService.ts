import { API, adminEndpoints } from "../api";
import { SearchFields } from "../components/molecules/dashboard/groupPage";
import Group from "../models/groupModel";

class TcGroup {
  static createGroup(group: Group) {
    return API.post(adminEndpoints.api.group.saveGroup, group);
  }
  static updateGroup(group: Group) {
    return API.put(adminEndpoints.api.group.updateGroup, group);
  }
  static deleteGroup(id: number) {
    return API.delete(adminEndpoints.api.group.deleteGroup(id));
  }
  static findAllGroups() {
    return API.get(adminEndpoints.api.group.findAllGroups);
  }
  static findAllGroupsBySystemID(systemId: number) {
    return API.get(adminEndpoints.api.group.findAllGroupsBySystemID(systemId));
  }

  static findAllSelectedGroupsByTcUserIdID(systemId: number, tcUserId: string) {
    return API.get(
      adminEndpoints.api.group.findAllSelectedGroupsByTcUserIdID(
        systemId,
        tcUserId,
      ),
    );
  }
  static searchGroup(group: SearchFields) {
    return API.post(adminEndpoints.api.group.SEARCH_GROUP, group);
  }
  static importGroups(groupName: string | undefined, systemId: number) {
    // @ts-ignore
    return API.get(adminEndpoints.api.group.IMPORT_GROUP(groupName, systemId));
  }
  static async getTemplateUser(systemId: number, tcUserId: string) {
    return API.get(
      adminEndpoints.api.group.getTemplateUser(systemId, tcUserId),
    );
  }
}

export default TcGroup;
