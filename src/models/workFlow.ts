export interface workFlow {
  entityId: string;
  entityType: string;
  workflowType: string;
  stageId: number;
  submitToUserId: string;
  approveToUserId: string;
  rejectToUserId: string;
  password: string;
  users: users[];
}

export interface users {
  id: string;
  name: string;
  email: string;
}
