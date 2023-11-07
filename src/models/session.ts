export interface Session {
  userId: string;
  orgId: string;
  userName: string;
  userEmail: string;
  applicationIds: Array<number>;
}
