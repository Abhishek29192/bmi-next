/**
 * Netlify-GitLab Webhook transformer
 *
 * This lambda function converts the Netlify JSON event into a GitLab webhook request (which expects form-data for the body).
 * It is triggered on a successful deploy in Netlify.
 *
 * The function name MUST be "deploy-succeeded/deploy-succeeded.js" for everything to work correctly.
 */
"use strict";

const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const handler = async (event) => {
  console.log("Deploy succeeded");

  const gitlabWebhook = process.env.GITLAB_DEPLOY_NOTIFICATION_URL || "";
  const gitLabToken = process.env.GITLAB_TOKEN || "";

  const eventBody = JSON.parse(event.body);
  const input = eventBody.payload;

  const params = new URLSearchParams();
  params.append("token", gitLabToken);
  params.append("ref", input.branch);
  params.append("variables[SITE_URL_FROM_NETLIFY]", input.url);

  try {
    const response = await fetch(gitlabWebhook, {
      method: "POST",
      body: params
    });
    if (!response.ok || response.status >= 400) {
      console.log("Failure");
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    console.log("result", response);

    const data = await response.json();
    console.log("data", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 400, body: err.message || JSON.stringify(err) };
  }
};

module.exports = { handler };
