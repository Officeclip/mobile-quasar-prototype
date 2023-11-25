export interface Session {
  userId: string;
  orgId: string;
  userName: string;
  userEmail: string;
  applicationIds: Array<number>;
  roleAccesses: RoleAccess[];
}

export interface RoleAccess {
  name: string;
  access: boolean;
}
