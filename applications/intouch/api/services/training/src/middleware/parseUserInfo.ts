import { Buffer } from "buffer";
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.headers["x-apigateway-api-userinfo"];
  const logger = req.logger("ParseUserInfo");

  try {
    if (userInfo) {
      req.user = JSON.parse(
        Buffer.from(userInfo as string, "base64").toString("ascii")
      );
    }
  } catch (error) {
    logger.error("Error parsing the x-apigateway-api-userinfo header: ", error);
  }

  return next();
};
