import {
  Entry,
  SpaceMembershipProps,
  Space,
  Role
} from "contentful-management";
//import { ContentfulWebhook } from "./types";

const DXB_MARKET_ROLE_PREFIX = "DXB - ";
//const TAG_ID_PREFIX = "market__";

export const FindOwner = (payload: Entry): string | undefined => {
  return payload.sys.createdBy?.sys.id;
};

export const FindMembership = async (
  space: Space,
  userId: string
): Promise<SpaceMembershipProps | undefined> => {
  const limit = 100;
  let offset = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const memberships = await space.getSpaceMemberships({
      limit,
      skip: offset
    });
    const targetMembership = memberships.items.find(
      (item) => item.sys.user.sys.id === userId
    );

    if (targetMembership) {
      return targetMembership;
    }

    if (offset + limit >= memberships.items.length) {
      return undefined;
    }

    offset += limit;
  }
};

export const FindMarketRole = async (
  roleIds: string[],
  space: Space
): Promise<Role | undefined> => {
  //const regEx = new RegExp(`^${DXB_MARKET_ROLE_PREFIX}(.*)`)

  const rolePromises = roleIds.map((rId) => {
    return space.getRole(rId);
  });

  const roles = await Promise.all(rolePromises);
  return roles.find((r) => r.name.startsWith(DXB_MARKET_ROLE_PREFIX));
};

export const GetMarketName = (roleName: string): string | undefined => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const roleRegEx = new RegExp(`^${DXB_MARKET_ROLE_PREFIX}(.*)$`);
  const marketName = roleName.match(roleRegEx)?.[1];
  return marketName;
};
