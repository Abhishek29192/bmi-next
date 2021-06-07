"use strict";

const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

const getZapContext = (branch) => {
  switch (branch) {
    case "master":
      return "qa";
    case "pre-production":
      return "pre-production";
    case "production":
      return "production";
    default:
      return null;
  }
};

module.exports = {
  onSuccess: async ({ inputs: { gitlabUrl, application }, utils }) => {
    const branch = process.env.BRANCH || "master";
    const zapContext = getZapContext(branch);
    if (!zapContext) {
      console.log("SKIPPING: Unable to find ZAP context");
      return;
    }

    console.log("Sending trigger to GitLab");
    const baseUrl =
      process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.URL;
    if (!baseUrl) {
      return utils.build.failPlugin(
        "Could not find the base URL of the deployed site"
      );
    }

    const params = new URLSearchParams();
    params.append("token", process.env.GITLAB_TOKEN);
    params.append("ref", branch);
    params.append("variables[SITE_URL_FROM_NETLIFY]", baseUrl);
    params.append("variables[SITE_FROM_NETLIFY]", application);
    params.append("variables[CONTEXT_FROM_NETLIFY]", zapContext);
    await fetch(gitlabUrl, { method: "POST", body: params });
  }
};
