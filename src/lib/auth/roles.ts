import { permissions } from "@/config/dashboard";

/*
  This function will check if the user is authorized to access the route
  based on the permissions array
  @param pathname: string
  @param roles: string[]
  */
export const isAuthorized = (pathname: string, roles: string[]) => {
  const permission = permissions.find(
    (permission) => permission.path === pathname
  );
  return permission
    ? permission.roles.some((role) => (roles || []).includes(role))
    : false;
};
