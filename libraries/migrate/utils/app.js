"use strict";

const ora = require("ora");
const fetch = require("node-fetch");
const { isDryRun } = require("./process");

const CONTENTFUL_API_URL = "https://api.contentful.com";

module.exports.removeAppFromSpace = async (appName, { makeRequest }) => {
  const timer = ora(`Removing the ${appName} from the space.`).start();

  if (isDryRun) {
    timer.warn(`Stopping because the --dry-run flag is present.`);

    return;
  }

  const spaceAppInstallations = await makeRequest({
    method: "GET",
    url: `/app_installations`
  });

  const spaceFocalPointApp = spaceAppInstallations.includes.AppDefinition.find(
    ({ name }) => name === appName
  );

  if (!spaceFocalPointApp) {
    timer.warn(`App ${appName} was not found in the space.`);
    return;
  }

  await makeRequest({
    method: "DELETE",
    url: `/app_installations/${spaceFocalPointApp.sys.id}`
  });

  timer.succeed(`App ${appName} succesfully removed from the space.`);
};

module.exports.getApp = async (
  appDefinition,
  { makeRequest, accessToken, spaceId }
) => {
  const { name: appName } = appDefinition;
  const timer = ora(
    `Checking if the ${appName} app is installed in the space.`
  ).start();
  const spaceAppInstallations = await makeRequest({
    method: "GET",
    url: `/app_installations`
  });

  const spaceApp = spaceAppInstallations.includes.AppDefinition.find(
    ({ name }) => appName === name
  );

  if (spaceApp) {
    timer.succeed(`${appName} found in the space.`);

    return spaceApp;
  }

  if (isDryRun) {
    timer.warn(
      "Stopping creating the app because the --dry-run flag is present."
    );

    return { sys: { id: null } };
  }

  timer.text = `Checking if the ${appName} app is installed in the organisation.`;

  const {
    sys: {
      organization: {
        sys: { id: organisationId }
      }
    }
  } = await (
    await fetch(`${CONTENTFUL_API_URL}/spaces/${spaceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  ).json();

  const organisationAppInstallations = await (
    await fetch(
      `${CONTENTFUL_API_URL}/organizations/${organisationId}/app_definitions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        }
      }
    )
  ).json();

  let organisationApp = organisationAppInstallations.items.find(
    ({ name }) => appName === name
  );

  if (!organisationApp) {
    timer.text = `App not found. Creating the ${appName} app at organisation level.`;

    organisationApp = await (
      await fetch(
        `${CONTENTFUL_API_URL}/organizations/${process.env.ORGANIZATION_ID}/app_definitions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/vnd.contentful.management.v1+json"
          },
          body: JSON.stringify(appDefinition)
        }
      )
    ).json();
  }

  timer.text = `Installing the ${appName} app at space level.`;

  await makeRequest({
    method: "PUT",
    url: `/app_installations/${organisationApp.sys.id}`,
    data: {
      parameters: {}
    }
  });

  timer.succeed(`${appName} created and added to the space.`);

  return organisationApp;
};
