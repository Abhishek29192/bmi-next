import { v4 } from "uuid";
import { NextLogger } from "@bmi-digital/logger";
import { Session } from "@auth0/nextjs-auth0";

import { getAuth0Instance } from "../auth0";

export function withLogger(getServerSideProps) {
  return async (context) => {
    if (context?.req) {
      const auth0 = await getAuth0Instance(context.req, context.res);
      const session: Session = auth0.getSession(context.req, context.res);

      context.req["x-request-id"] = v4();
      context.req["x-authenticated-user-id"] = session?.user?.sub;

      NextLogger(context.req, context.res);
    }
    return await getServerSideProps(context);
  };
}

export function withLoggerApi(handler) {
  return async (req, res) => {
    if (req) {
      const auth0 = await getAuth0Instance(req, res);
      const session: Session = auth0.getSession(req, res);

      req["x-request-id"] = v4();
      req["x-authenticated-user-id"] = session?.user?.sub;

      NextLogger(req, res);
    }
    return await handler(req, res);
  };
}
