import fetch from "cross-fetch";
import { NextFunction } from "express";
import { getGCPToken } from "../utils";

export default (req, res, next: NextFunction) => {
  req.clientGateway = async (query: string, variables: Object) => {
    const { GATEWAY_URL } = process.env;
    const bearer = await getGCPToken(GATEWAY_URL);
    const fetchResult = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
        "x-request-market-domain": req.headers[
          "x-request-market-domain"
        ] as string
      },
      body: JSON.stringify({ query, variables })
    });
    return fetchResult.json();
  };

  return next();
};
