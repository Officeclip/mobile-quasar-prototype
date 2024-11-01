export interface issueLists {
  category: issueCategory[];
  criticality: issueCriticality[];
  status: issueStatus[];
  kind: issueKind[];
  users: user[];
}

export interface issueCategory {
  id: string;
  name: string;
}

export interface issueCriticality {
  id: string;
  name: string;
}

export interface issueStatus {
  id: string;
  name: string;
}

export interface issueKind {
  id: string;
  name: string;
}

export interface user {
  id: string;
  name: string;
}

export interface regardingContact {
  id: string;
  name: string;
}

export interface assignedTo {
  id: string;
  name: string;
  email: string;
}
