import { Buffer } from "buffer";
import { Request, Response, NextFunction } from "express";
import { loginToDocebo } from "../apis";

const NAMESPACE = "https://intouch";

export default async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.headers["x-apigateway-api-userinfo"];
  const logger = req.logger("ParseUserInfo");

  try {
    req.user = JSON.parse(
      Buffer.from(userInfo as string, "base64").toString("ascii")
    );
  } catch (error) {
    logger.error(error);
  }

  if (!req.cache.get(`${userInfo}_token`)) {
    try {
      const { data } = await loginToDocebo(req.user[`${NAMESPACE}/email`]);
      req.doceboToken = data?.access_token;
      req.cache.set(`${userInfo}_token`, req.doceboToken);
      logger.info("token correctly fetched");
    } catch (error) {
      logger.error(error);
    }
  } else {
    req.doceboToken = req.cache.get(`${userInfo}_token`);
  }

  return next();
};
