interface Volume {
  volumeId?: any;
  volumeName?: string;
  system?: {
    systemId?: number;
    systemName?: string;
  };
}

export default Volume;

export interface VolumeResponse {
  volumeId: number;
  volumeName: string | undefined;
  systemId: number;
  systemName: string | undefined;
}
