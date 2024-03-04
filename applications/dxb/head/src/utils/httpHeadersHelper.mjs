const groupSiteCode = "grp";
export const contentSecurityPolicy = (marketCode) => {
  if (marketCode === groupSiteCode || !process.env.IS_NETLIFY) {
    return process.env.CONTENT_SECURITY_POLICY;
  }
  return process.env[`DXB_CONTENT_SECURITY_POLICY_${envVarSuffix(marketCode)}`];
};

export const xRobotTags = (marketCode) => {
  if (marketCode === groupSiteCode || !process.env.IS_NETLIFY) {
    return process.env.X_ROBOTS_TAG;
  }
  return process.env[`DXB_X_ROBOTS_TAG_${envVarSuffix(marketCode)}`];
};

export const accessControlAllowOrigin = (marketCode) => {
  if (marketCode === groupSiteCode || !process.env.IS_NETLIFY) {
    return process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
  }
  return process.env[
    `DXB_ACCESS_CONTROL_ALLOW_ORIGIN_${envVarSuffix(marketCode)}`
  ];
};

// Builds the market environment variable suffix in the form NO
// or FR_BE (for bilingual markets).
const envVarSuffix = (marketCode) => {
  return `${marketCode.split("/").pop().toUpperCase().replace("-", "_")}`;
};
