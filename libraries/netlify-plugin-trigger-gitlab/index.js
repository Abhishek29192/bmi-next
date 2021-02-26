"use strict";

const { URLSearchParams } = require("url");
const fetch = require("node-fetch");

module.exports = {
  onSuccess: async ({ inputs: { gitlabUrl, application, zapContext } }) => {
    console.log("Sending trigger to GitLab");
    const baseUrl =
      process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.URL;
    const branch = process.env.BRANCH || "master";
    const params = new URLSearchParams();
    params.append("token", process.env.GITLAB_TOKEN);
    params.append("ref", branch);
    params.append("variables[SITE_URL_FROM_NETLIFY]", baseUrl);
    params.append("variables[SITE_FROM_NETLIFY]", application);
    params.append("variables[CONTEXT_FROM_NETLIFY]", zapContext);
    await fetch(gitlabUrl, { method: "POST", body: params });
  }
};
