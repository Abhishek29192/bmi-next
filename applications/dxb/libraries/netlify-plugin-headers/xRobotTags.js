import { envVarSuffix } from "./utils.js";

export const getXRobotTags = (marketCode, dxbEnvironment) => {
  const marketOverride =
    process.env[
      `${dxbEnvironment}_DXB_X_ROBOTS_TAG_${envVarSuffix(marketCode)}`
    ];
  if (marketOverride) {
    return marketOverride;
  }

  return process.env[`${dxbEnvironment}_DXB_X_ROBOTS_TAG`];
};
