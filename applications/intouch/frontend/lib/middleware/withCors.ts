import Cors from "cors";
import { withLoggerApi } from "./withLogger";

export function initMiddleware(req, res, middleware) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default function withCors(options, handler) {
  return async (req, res) => {
    const {
      headers: { origin: reqOrigin }
    } = req;
    const origin =
      process.env.APP_ENV === "dev" ||
      (!!reqOrigin && options.origins?.indexOf(reqOrigin) !== -1);

    await initMiddleware(
      req,
      res,
      Cors({
        origin,
        methods: ["OPTIONS", ...options.methods]
      })
    );

    return await withLoggerApi(handler)(req, res);
  };
}
