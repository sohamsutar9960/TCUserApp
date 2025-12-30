export interface Role {
  id: number;
  name: string;
}

export interface SubGroup {
  id: number;
  name: string;
  roles: Role[];
}

export interface Group {
  id: number;
  name: string;
  subGroups?: SubGroup[];
  roles?: Role[];
}
