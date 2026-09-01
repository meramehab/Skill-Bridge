import { roleCatalog } from "../data/role-catalog.js";

export function getRoleById(roleId) {
  const role = roleCatalog.find((item) => item.id === roleId);

  if (!role) {
    throw new Error(`Role not found: ${roleId}`);
  }

  return role;
}

export function getRoleByName(roleName) {
  const targetName = String(roleName).trim().toLowerCase();
  const role = roleCatalog.find(
    (item) =>
      item.name.toLowerCase() === targetName ||
      item.aliases.some((alias) => alias.toLowerCase() === targetName),
  );

  if (!role) {
    throw new Error(`Role not found: ${roleName}`);
  }

  return role;
}

export function listAvailableRoles() {
  return roleCatalog.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }));
}
