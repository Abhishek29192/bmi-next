import { Request, Response } from "express";
import logger from "@bmi-digital/functions-logger";
import GatewayClient from "./utils/GatewayClient";
import GatewayMarketsClient from "./utils/GetMarkets";

type Market = {
  id: number;
  domain: string;
};
export type MarketDetails = {
  markets: { nodes: Market[] };
};

const handleRequest = async (req: Request<any, any>, res: Response) => {
  const clientMarketsGateway = await GatewayMarketsClient.create();
  const marketsResponse = await clientMarketsGateway.getMarkets();

  if (marketsResponse.ok) {
    const {
      data: {
        markets: { nodes }
      }
    }: { data: MarketDetails } = await marketsResponse.json();
    const markets = nodes.map(({ domain }) => domain.toString());

    for (const market of markets) {
      try {
        const clientGateway = await GatewayClient.create(market);
        const response = await clientGateway.annualInspection();
        if (response.ok) {
          const {
            data: { annualProjectsInspection: message }
          } = await response.json();
          logger.info({ message });
        } else {
          logger.error({ message: response.statusText });
        }
      } catch (error) {
        logger.error({ message: (error as Error).message });
      }
    }
  }
};

export { handleRequest };
