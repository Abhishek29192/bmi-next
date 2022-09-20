import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import GatewayClient from "./utils/GatewayClient";

type Market = {
  language: string;
  id: number;
  domain: string;
};
export type MarketDetails = {
  markets: { nodes: Market[] };
};

const handleRequest = async (req: Request<any, any>, res: Response) => {
  try {
    const clientGateway = await GatewayClient.create();
    const response = await clientGateway.autoRejectDoubleAcceptance();

    if (response.ok) {
      const {
        data: { autoRejectDoubleAcceptance: message }
      } = await response.json();
      logger.info({ message });
    } else {
      logger.error({ message: response.statusText });
    }
  } catch (error) {
    logger.error({ message: (error as Error).message });
  }
};

export { handleRequest };
