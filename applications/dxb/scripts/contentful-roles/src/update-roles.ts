import {
  getMarketsToRun,
  getRolesPermissionsToUpdate,
  roles
} from "./configurations";
import { getSpaceRoles, updateRole } from "./requests";
import { IMarket } from "./types";

export const main = async () => {
  const marketsToRun = getMarketsToRun();
  if (marketsToRun.length === 0) {
    console.info(
      `Please provide markets with locales to update roles in the space`
    );
    return;
  }
  const allExistingSpaceRoles = await getSpaceRoles();
  if (
    !allExistingSpaceRoles ||
    !allExistingSpaceRoles.items ||
    allExistingSpaceRoles.items.length === 0
  ) {
    console.info(
      `Don't have any roles for the space - ${process.env.CONTENTFUL_SPACE_ID}`
    );
    return;
  }
  await Promise.allSettled(
    marketsToRun.map(async (market: IMarket) => {
      const otherMarkets = marketsToRun.filter(
        (currentMarket: IMarket) => currentMarket.name !== market.name
      );
      const otherMarketsTags = otherMarkets.map(
        (m: IMarket) => `market__${m.name}`
      );
      for (const role of roles) {
        const roleToUpdate = allExistingSpaceRoles.items.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (existingRole: any) =>
            existingRole.name === `DXB - ${market.name} content ${role}`
        );
        if (!roleToUpdate) {
          console.info(
            `Space - ${process.env.CONTENTFUL_SPACE_ID} - doesn't have ${role} role for ${market.name} market`
          );
          return;
        }
        console.info(`Getting request body for ${roleToUpdate.name} role`);
        const body = getRolesPermissionsToUpdate(
          role,
          market,
          otherMarketsTags
        );
        await updateRole(body, roleToUpdate);
      }
    })
  );

  console.info(
    `Updated contentful roles permissions for the space - ${process.env.CONTENTFUL_SPACE_ID}`
  );
};

main();
