export interface Session {
  userId: string;
  orgId: string;
  userName: string;
  userEmail: string;
  orgKey: string;
  applicationIds: Array<number>;
  isAdmin: boolean;
  roleAccess: RoleAccess[];
}

export interface RoleAccess {
  name: string;
  access: boolean;
}
