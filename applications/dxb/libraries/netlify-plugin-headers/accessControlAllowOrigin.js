import { envVarSuffix } from "./utils.js";

export const getAccessControlAllowOrigin = (marketCode, dxbEnvironment) => {
  const marketOverride =
    process.env[
      `${dxbEnvironment}_DXB_ACCESS_CONTROL_ALLOW_ORIGIN_${envVarSuffix(
        marketCode
      )}`
    ];
  if (marketOverride) {
    return marketOverride;
  }

  return process.env[`${dxbEnvironment}_DXB_ACCESS_CONTROL_ALLOW_ORIGIN`];
};
