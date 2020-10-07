"use strict";

const getCredentialData = (env, data = [], index = 0) => {
  const suffix = index ? `_${index}` : "";

  const spaceId = env[`SPACE_ID${suffix}`];
  const accessToken = env[`ACCESS_TOKEN${suffix}`];
  const environment = env[`ENVIRONMENT${suffix}`] || "master";

  if (!spaceId || !accessToken) {
    if (index === 0) {
      throw new Error(
        `You need to define SPACE_ID and ACCESS_TOKEN in your .env.${env.NODE_ENV} file`
      );
    }

    return data;
  }

  const countryData = {
    spaceId,
    accessToken,
    environment
  };

  return getCredentialData(env, data.concat(countryData), index + 1);
};

module.exports = getCredentialData;
