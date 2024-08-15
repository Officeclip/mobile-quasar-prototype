export interface Session {
  userId: string;
  orgId: string;
  userName: string;
  userEmail: string;
  orgKey: string;
  applicationIds: Array<number>;
  isAdmin: boolean;
  restApiVersion: string;
  roleAccess: RoleAccess[];
}

export interface RoleAccess {
  name: string;
  access: boolean;
}
