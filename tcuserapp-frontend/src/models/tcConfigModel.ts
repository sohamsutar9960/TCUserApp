export interface System {
  systemId: number | undefined;
}

export interface TcConfig {
  tcConfigId?: number;
  configName?: string;
  tcURL?: string;
  fmsURL?: string;
  ssoEnabled?: boolean;
  ssoLoginURL?: string;
  ssoIdentityURL?: string;
  ssoTCAppId?: number;
  active?: boolean;
  userName?: string;
  password?: string;
  system: System;
}

export interface TcConfigResponse {
  tcConfigId?: number;
  configName?: string;
  systemId?: number;
  systemName?: string;
  tcURL?: string;
  fmsURL?: string;
  ssoEnabled?: boolean;
  ssoLoginURL?: string;
  ssoIdentityURL?: string;
  ssoTCAppId?: number;
  active?: boolean;
  userName?: string;
  password?: string;
}
export interface TcConfigResponse {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gid?: string;
  email?: string;
  sponsor?: string;
  lineManager?: string;
  department?: string;
  country?: string;
}
