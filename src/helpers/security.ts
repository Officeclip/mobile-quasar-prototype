import { useSessionStore } from 'src/stores/SessionStore';
const sessionStore = useSessionStore();

export function isAllowed(isAdmin = false, roleAccess = '', security = true) {
  const session = sessionStore.Session;
  const isRoleAccess = () => {
    if (roleAccess != '') {
      const data = session.roleAccess.find((x) => x.name === roleAccess);
      console.log('Checking TimeExpensesCreateTimeSheet::', data?.access);
      return data?.access;
    }
    return true;
  };

  // Check if the admin is true
  if (isAdmin) {
    return true;
  }

  // Check if both the roleAccess and security arguments are true
  if (isRoleAccess() && security) {
    return true;
  }

  // If none of the conditions are met, return false
  return false;
}
