export function isAllowed(
  isAdmin: boolean,
  roleAccess: boolean,
  security: boolean
) {
  // Check if the admin is true
  if (isAdmin) {
    return true;
  }

  // Check if both the roleAccess and security arguments are true
  if (roleAccess && security) {
    return true;
  }

  // If none of the conditions are met, return false
  return false;
}
