import {
  getMarketsToRun,
  getRolesPermissionsToCreate,
  roles
} from "./configurations";
import { createRoles } from "./requests";
import { IMarket } from "./types";

export const main = async () => {
  const marketsToRun = getMarketsToRun();
  if (!marketsToRun || marketsToRun.length === 0) {
    console.info(
      `Please provide markets with locales to create roles in the space`
    );
  }
  await Promise.allSettled(
    marketsToRun.map(async (market: IMarket) => {
      const otherMarkets = marketsToRun.filter(
        (currentMarket: IMarket) => currentMarket.name !== market.name
      );
      const otherMarketsTags = otherMarkets.map(
        (m: IMarket) => `market__${m.name}`
      );
      console.info(`Triggering create roles for ${market.name}`);
      for (const role of roles) {
        console.info(
          `Getting request body for ${role} role for ${market.name}`
        );
        const body = getRolesPermissionsToCreate(
          role,
          market,
          otherMarketsTags
        );
        await createRoles(body);
      }
    })
  );
  console.info(`Created contentful roles`);
};

main();
