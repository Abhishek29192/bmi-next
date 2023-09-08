import { createEnvironment } from "@bmi/functions-contentful-management-client/helpers";
import type { Environment } from "contentful-management";

export const createEnvironmentWithId = (id: string): Environment => {
  const environment = createEnvironment();
  environment.sys.id = id;
  return environment;
};

export const createEnvironmentWithStatus = (status: string): Environment => {
  const environment = createEnvironment();
  environment.sys.status.sys.id = status;
  return environment;
};

export default createEnvironment;
