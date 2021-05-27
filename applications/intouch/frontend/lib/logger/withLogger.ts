import { NextLogger } from "@bmi/logger";

export function withLogger(getServerSideProps) {
  return async (context) => {
    if (context?.req) {
      NextLogger(context.req, context.res);
    }
    return await getServerSideProps(context);
  };
}

export function withLoggerApi(handler) {
  return async (req, res) => {
    if (req) {
      NextLogger(req, res);
    }
    return await handler(req, res);
  };
}
