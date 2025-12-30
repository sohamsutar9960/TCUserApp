import { createContext, useContext, ReactNode } from "react";
import { CommonRequest } from "../../../../models/ManagerAndGroupRoleApproverModel";

interface RequestContextType {
  openRequests: CommonRequest[];
  approvedRequests: CommonRequest[];
  rejectedRequests: CommonRequest[];
  handleApproveRequest: any;
  handleRejectRequest: any;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: RequestContextType;
}) => {
  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequestContext must be used within a RequestProvider");
  }
  return context;
};
