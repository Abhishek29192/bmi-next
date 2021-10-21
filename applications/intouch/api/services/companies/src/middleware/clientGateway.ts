import axios from "axios";
import { NextFunction } from "express";
import { getGCPToken } from "../utils";

export default (req, res, next: NextFunction) => {
  const logger = req.logger("gateway:client");
  req.clientGateway = async (query: string, variables: Object) => {
    const { GATEWAY_URL } = process.env;
    const bearer = await getGCPToken(GATEWAY_URL);

    try {
      const { data } = await axios({
        url: `${GATEWAY_URL}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
          "x-request-market-domain": req.headers[
            "x-request-market-domain"
          ] as string,
          "x-apigateway-api-userinfo": req.headers["x-apigateway-api-userinfo"]
        },
        data: { query, variables },
        timeout: 3000
      });

      return data;
    } catch (error) {
      logger.error("Error fetching gateway: ", error);
      throw new Error(error);
    }
  };

  return next();
};
