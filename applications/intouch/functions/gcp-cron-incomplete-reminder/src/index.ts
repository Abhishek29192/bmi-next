import dotenv from "dotenv";

dotenv.config();

import GatewayClient from "./utils/GatewayClient";

export const sendReminder = async (postEvent: any, context: any) => {
  try {
    const gatewayClient = await GatewayClient.create();
    const { data } = await gatewayClient.getMarkets();

    for (const market of data?.markets?.nodes) {
      await gatewayClient.sendReminder(market.domain);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

//sendReminder(null, null);
