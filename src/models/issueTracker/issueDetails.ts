import { security } from '../security';

export interface issueDetails {
  id: string;
  issueId: string;
  name: string;
  status: string;
  assignedTo: string;
  criticality: string;
  kind: string;
  createdDate: string;
  createdUserName: string;
  modifiedDate: string;
  modifiedUserName: string;
  description: string;
  security: security;
}
