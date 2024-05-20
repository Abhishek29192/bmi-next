import parseContentSecurityPolicy from "content-security-policy-parser";

const groupSiteCode = "grp";
export const contentSecurityPolicy = (marketCode) => {
  if (!process.env.IS_NETLIFY) {
    return process.env.CONTENT_SECURITY_POLICY;
  }

  const csp = buildCsp(marketCode);
  if (process.env["DXB_DEBUG"]) {
    console.log(`${marketCode} Content Security Policy: ${csp}`);
  }
  return csp;
};

export const xRobotTags = (marketCode) => {
  if (!process.env.IS_NETLIFY) {
    return process.env.X_ROBOTS_TAG;
  }
  const environment = process.env["DXB_ENVIRONMENT"];
  const marketOverride =
    process.env[`${environment}_DXB_X_ROBOTS_TAG_${envVarSuffix(marketCode)}`];
  if (marketOverride) {
    return marketOverride;
  }

  return process.env[`${environment}_DXB_X_ROBOTS_TAG`];
};

export const accessControlAllowOrigin = (marketCode) => {
  if (!process.env.IS_NETLIFY) {
    return process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
  }
  const environment = process.env["DXB_ENVIRONMENT"];
  const marketOverride =
    process.env[
      `${environment}_DXB_ACCESS_CONTROL_ALLOW_ORIGIN_${envVarSuffix(
        marketCode
      )}`
    ];
  if (marketOverride) {
    return marketOverride;
  }
  return process.env[`${environment}_DXB_ACCESS_CONTROL_ALLOW_ORIGIN`];
};

// Builds the market environment variable suffix in the form NO
// or FR_BE (for bilingual markets).
const envVarSuffix = (marketCode) => {
  return `${marketCode.split("/").pop().toUpperCase().replace("-", "_")}`;
};

const buildCsp = (marketCode) => {
  const environment = process.env["DXB_ENVIRONMENT"].toLocaleUpperCase();
  const commonCsp = process.env[`${environment}_DXB_CONTENT_SECURITY_POLICY`];
  const marketcsp =
    process.env[
      `${environment}_DXB_CONTENT_SECURITY_POLICY_${envVarSuffix(marketCode)}`
    ];
  if (!marketcsp) {
    return commonCsp;
  }

  const parsedCommonCsp = parseContentSecurityPolicy(commonCsp);
  const parsedMarketCsp = parseContentSecurityPolicy(marketcsp);

  parsedMarketCsp.forEach((v, k) => {
    parsedCommonCsp.set(
      k,
      parsedCommonCsp.get(k) ? parsedCommonCsp.get(k).concat(v) : v
    );
  });

  return stringifyCsp(parsedCommonCsp);
};

const stringifyCsp = (csp) => {
  return Array.from(csp, ([key, value]) => `${key} ${value.join(" ")}`).join(
    "; "
  );
};
