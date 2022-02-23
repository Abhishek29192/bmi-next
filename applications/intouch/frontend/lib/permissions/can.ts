import { Account } from "@bmi/intouch-api-types";
import gates from "./gates";

const can = (
  user: Account,
  dataModel: string,
  action: string,
  extraData?: any
): boolean => {
  // eslint-disable-next-line security/detect-object-injection
  const definition = gates[dataModel]?.[action];
  let gate;

  // Object holding definition per role
  if (typeof definition === "object") {
    gate = definition[user?.role];
  } else if (typeof definition === "function") {
    return definition(user, extraData || {});
  } else if (typeof definition === "boolean") {
    return definition;
  }

  // In role based definition, both function and boolean is supported
  if (typeof gate === "function") {
    return gate(user, extraData || {});
  } else {
    return gate || false;
  }
};

export default can;
