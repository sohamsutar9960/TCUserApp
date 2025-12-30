export interface GroupRoleApprover {
  groupRoleApproverId?: number;
  gid?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  lineManager?: string | null;
  sponsor?: string;
  department?: string;
  organization?: string | null;
  organizationID?: string | null;
  country?: string;
  osUserName?: string | null;
  locality?: string | null;
  mobileNumber?: string;
  city?: string;
  isActive?: boolean;
}

export interface GroupRoleApproversByIdResponse {
  Country?: string;
  Department?: string;
  DisplayName?: string;
  Email?: string;
  FirstName?: string;
  FullName?: string;
  GID?: string;
  LastName?: string;
  LineManager?: string;
  MobileNumber?: string;
  Organization?: string;
  OrganizationID?: string;
  Sponsor?: string;
  checked?: boolean;
  gid: string;
}
