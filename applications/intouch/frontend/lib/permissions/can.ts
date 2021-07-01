import { Account } from "@bmi/intouch-api-types";
import gates from "./gates";

const can = (
  user: Account,
  dataModel: string,
  action: string,
  extraData?: any
): boolean => {
  const gate = gates?.[dataModel]?.[action]?.[user?.role];

  if (typeof gate === "function") {
    return gate(user, extraData || {});
  } else {
    return gate;
  }
};

export default can;
