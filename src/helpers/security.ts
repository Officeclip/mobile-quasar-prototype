import { useSessionStore } from 'src/stores/SessionStore';
const sessionStore = useSessionStore();

const isSessionAdmin = sessionStore.Session.isAdmin;

// Define the isRoleAccess function
function isRoleAccess(roleAccess: string): boolean {
  if (roleAccess !== '') {
    const data = sessionStore.Session.roleAccess.find(
      (x) => x.name === roleAccess
    );
    return data?.access ?? true;
  }
  return true;
}

export function isAllowed({ roleAccess = '', security = {} }) {
  const {
    read = true,
    write = true,
    append = true,
    delete: del = true,
  } = security;

  // Check if the admin is true
  if (isSessionAdmin) {
    return true;
  }

  // Check if both the roleAccess and security arguments are true
  if (isRoleAccess(roleAccess) && read && write && append && del) {
    return true;
  }

  // If none of the conditions are met, return false
  return false;
}
