export interface trackerLists {
  category: issueCategory[];
  criticality: issueCriticality[];
  status: issueStatus[];
  kind: issueKind[];
  users: user[];
  regardingParentTypes: regardingParent[];
}

export interface issueCategory {
  id: string;
  name: string;
  is_default: boolean;
}

export interface issueCriticality {
  id: string;
  name: string;
  is_default: boolean;
}

export interface issueStatus {
  id: string;
  name: string;
  is_default: boolean;
}

export interface issueKind {
  id: string;
  name: string;
  is_default: boolean;
}

export interface user {
  id: string;
  name: string;
}

export interface regardingContact {
  id: string;
  name: string;
}

export interface regardingParent {
  id: string;
  name: string;
}

export interface assignedTo {
  id: string;
  name: string;
  email: string;
}
