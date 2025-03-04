export interface workFlow {
  entityId: string;
  entityType: string;
  workflowType: string;
  stageId: number;
  submitToUserId: string;
  approveToUserId: string;
  rejectToUserId: string;
  password: string;
  comments: [];
  users: users[] | null;
}

export interface users {
  id: string;
  name: string;
  email: string;
}
