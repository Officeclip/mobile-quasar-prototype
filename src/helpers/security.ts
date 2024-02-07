import { useSessionStore } from 'src/stores/SessionStore';
const sessionStore = useSessionStore();

const isSessionAdmin = sessionStore.Session.isAdmin;

export function isAllowed({
  isAdmin = isSessionAdmin,
  roleAccess = '',
  security = {},
}) {
  const session = sessionStore.Session;
  const isRoleAccess = () => {
    if (roleAccess != '') {
      const data = session.roleAccess.find((x) => x.name === roleAccess);
      // console.log('Checking TimeExpensesCreateTimeSheet::', data?.access);
      return data?.access;
    }
    return true;
  };

  const {
    read = true,
    write = true,
    append = true,
    delete: del = true,
  } = security;

  // Check if the admin is true
  if (isAdmin) {
    return true;
  }

  // Check if both the roleAccess and security arguments are true
  if (isRoleAccess() && read && write && append && del) {
    return true;
  }

  // If none of the conditions are met, return false
  return false;
}
