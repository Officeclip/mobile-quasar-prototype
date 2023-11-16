export interface workFlow {
  id: string;
  entityId: string;
  entityType: string;
  workflowType: string;
  submitToUserId: string;
  approveToUserId: string;
  rejectToUserId: string;
  users: users[];
}

export interface users {
  id: string;
  name: string;
  email: string;
}
