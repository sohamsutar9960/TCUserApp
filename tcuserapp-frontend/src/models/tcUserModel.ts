export interface TcUserModel {
  gid?: string;
  userHistoryId?: number;
  tcUserId?: string;
  systemName?: string | undefined;
  requestStatus?: string | undefined;
  userStatus?: string | undefined;
  neverLock?: boolean;
  tcCreated?: boolean;
  tcAccountType?: string | undefined;
}

// export default TcUserModel;
export interface TcUserResponse {
  gid?: string;
  userHistoryId?: number;
  tcUserId?: string;
  systemName?: string | undefined;
  requestStatus?: string | undefined;
  userStatus?: string | undefined;
  neverLock?: boolean;
  tcCreated?: boolean;
  tcAccountType?: string | undefined;
}

export interface searchFields {
  gid?: string;
  tcUserId?: string;
  systemName: string;
  userStatus?: string;
}
