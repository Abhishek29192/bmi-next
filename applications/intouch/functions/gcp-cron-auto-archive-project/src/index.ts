import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import GatewayClient from "./utils/GatewayClient";

const handleRequest = async (req: Request<any, any>, res: Response) => {
  try {
    const clientGateway = await GatewayClient.create();
    const response = await clientGateway.archiveGuarantee();
    if (response.ok) {
      const {
        data: { archiveProjects: message }
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
