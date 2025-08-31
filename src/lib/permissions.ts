import { Roles } from "../../types/globals";

export function hasPermission(
  role: Roles | undefined,
  action: "create" | "update" | "delete"
): boolean {
  if (!role) return false;

  if (role === "admin") return true; 

  if (action === "create") {
    return role === "creator";
  }

  if (action === "update") {
    return role === "creator" || role === "write-access";
  }

  if (action === "delete") {
    return role === "creator"; 
  }

  return false;
}
