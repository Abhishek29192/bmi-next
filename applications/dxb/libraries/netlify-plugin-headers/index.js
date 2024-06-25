import { getCsp } from "./csp.js";
import { getXRobotTags } from "./xRobotTags.js";
import { getAccessControlAllowOrigin } from "./accessControlAllowOrigin.js";
import { initialiseFirestore } from "./firestore.js";

export const onPreBuild = async function ({ netlifyConfig, utils, inputs }) {
  const environment = process.env.DXB_ENVIRONMENT;
  const marketCode = process.env.GATSBY_SPACE_MARKET_CODE;
  const database = initialiseFirestore();

  try {
    const csp = await getCsp(marketCode, database);
    const xRobotTags = getXRobotTags(marketCode, environment);
    const accessControlAllowOrigin = getAccessControlAllowOrigin(
      marketCode,
      environment
    );
    netlifyConfig.headers.push({
      for: "/*",
      values: {
        "Content-Security-Policy": csp,
        "X-Robots-Tag": xRobotTags,
        "Access-Control-Allow-Origin": accessControlAllowOrigin,
        "X-Frame-Options": "DENY",
        "x-xss-protection": "1; mode=block", // use lowercase key here to silence the netllify warning
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });
  } catch (error) {
    utils.build.failPlugin(error);
  }

  if (marketCode === "grp") {
    const marketPrefixes = inputs.dxbMarketPrefixes
      .split(",")
      .map((p) => p.trim());

    const errors = [];

    for (const marketPrefix of marketPrefixes) {
      try {
        const marketCsp = await getCsp(marketPrefix, database);
        const marketXRobotTags = getXRobotTags(marketPrefix, environment);
        const marketAccessControlAllowOrigin = getAccessControlAllowOrigin(
          marketPrefix,
          environment
        );

        netlifyConfig.headers.push({
          for: `/${marketPrefix}/*`,
          values: {
            "Content-Security-Policy": marketCsp,
            "X-Robots-Tag": marketXRobotTags,
            "Access-Control-Allow-Origin": marketAccessControlAllowOrigin
          }
        });
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      utils.build.failPlugin(errors.join(", "));
      return;
    }
  }
};
