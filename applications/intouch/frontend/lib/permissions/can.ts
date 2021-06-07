import { UserProfile } from "@auth0/nextjs-auth0";
import { CLAIMS } from "./claims";
import gates from "./gates";

const can = (
  user: UserProfile,
  dataModel: string,
  action: string,
  extraData?: any
): boolean => {
  const userRole = user[CLAIMS.role];
  const gate = gates?.[dataModel]?.[action]?.[userRole];

  if (typeof gate === "function") {
    return gate(user, extraData || {});
  } else {
    return gate;
  }
};

export default can;
