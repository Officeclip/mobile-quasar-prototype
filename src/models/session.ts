export interface Session{
  userId: number;
  orgId: number;
  userName: string;
  userEmail: string;
  applicationIds: Array<number>;
}
