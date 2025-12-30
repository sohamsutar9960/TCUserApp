interface System {
  systemId?: number;
  systemName?: string;
  service: {
    serviceId: number;
    serviceName?: string | null;
  };
}

export default System;
