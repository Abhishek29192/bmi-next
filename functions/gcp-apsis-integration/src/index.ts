import { escape } from "querystring";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { config } from "dotenv";
import fetch from "node-fetch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

type RequestRedirect = "error" | "follow" | "manual";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const {
  APSIS_API_BASE_URL,
  APSIS_CLIENT_ID,
  APSIS_CLIENT_SECTRET,
  APSIS_TARGET_KEYSPACE,
  APSIS_TARGET_SECTION,
  APSIS_CONSENT_LIST_DESCRIMINATOR,
  APSIS_TOPIC_DESCRIMINATOR,
  APSIS_TARGET_EMAIL_ATTRIBUTE_ID,
  APSIS_TARGET_GDPR_1_ATTRIBUTE_ID,
  APSIS_TARGET_GDPR_2_ATTRIBUTE_ID,
  APSIS_TARGET_CHANNEL,
  SECRET_MAN_GCP_PROJECT_NAME
} = process.env;

const apsisAudianceBase = `${APSIS_API_BASE_URL}/audience`;

const secretManagerClient = new SecretManagerServiceClient();

const getAuthToken = async () => {
  // get APSIS secret from Secret Manager
  const apsisSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${APSIS_CLIENT_SECTRET}/versions/latest`
  });

  const apsisClientSecret = apsisSecret[0].payload.data.toString();

  const redirect: RequestRedirect = "follow";
  var requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: APSIS_CLIENT_ID,
      client_secret: apsisClientSecret,
      grant_type: "client_credentials"
    }),
    redirect
  };
  const response = await fetch(
    `${APSIS_API_BASE_URL}/oauth/token`,
    requestOptions
  );

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `Request to get OAuth token failed with status ${response.status}`,
      response.statusText
    );
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data;
};

const createProfile = async (
  access_token: string = "",
  email: string = "",
  gdpr_1 = false,
  gdpr_2 = false
) => {
  const createProfileEndpoint = `${apsisAudianceBase}/keyspaces/${APSIS_TARGET_KEYSPACE}/profiles/${escape(
    email
  )}/sections/${APSIS_TARGET_SECTION}/attributes`;
  const payload = {
    [APSIS_TARGET_EMAIL_ATTRIBUTE_ID]: email,
    [APSIS_TARGET_GDPR_1_ATTRIBUTE_ID]: gdpr_1,
    [APSIS_TARGET_GDPR_2_ATTRIBUTE_ID]: gdpr_2
  };

  const response = await fetch(createProfileEndpoint, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `Request to get Create Profile failed with status ${response.status}`,
      response.statusText
    );
    throw new Error(response.statusText);
  }

  const data = await response;
  return data;
};

const createConsent = async (access_token: string = "", email: string = "") => {
  const createConsentEndpoint = `${apsisAudianceBase}/channels/${APSIS_TARGET_CHANNEL}/addresses/${escape(
    email
  )}/consents`;

  const response = await fetch(createConsentEndpoint, {
    method: "POST",
    body: JSON.stringify({
      section_discriminator: APSIS_TARGET_SECTION,
      consent_list_discriminator: APSIS_CONSENT_LIST_DESCRIMINATOR,
      topic_discriminator: APSIS_TOPIC_DESCRIMINATOR,
      type: "opt-in"
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `Request to get Create Consent failed with status ${response.status}`,
      response.statusText
    );
    throw new Error(response.statusText);
  }

  const data = await response;
  return data;
};

const createSubscription = async (
  access_token: string = "",
  email: string = ""
) => {
  const createSubscriptionEndpoint = `${apsisAudianceBase}/keyspaces/${APSIS_TARGET_KEYSPACE}/profiles/${escape(
    email
  )}/sections/${APSIS_TARGET_SECTION}/subscriptions`;

  const response = await fetch(createSubscriptionEndpoint, {
    method: "POST",
    body: JSON.stringify({
      consent_list_discriminator: APSIS_CONSENT_LIST_DESCRIMINATOR,
      topic_discriminator: APSIS_TOPIC_DESCRIMINATOR
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(
      `Request to get Create Subscription failed with status ${response.status}`,
      response.statusText
    );
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data;
};

export const optInEmailMarketing: HttpFunction = async (request, response) => {
  let subscriptionId = "";
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const {
        body: { email, gdpr_1, gdpr_2 }
      } = request;

      const { access_token } = await getAuthToken();

      if (access_token) {
        await createProfile(access_token, email, gdpr_1, gdpr_2);

        await createConsent(access_token, email);

        const subscriptionData = await createSubscription(access_token, email);

        subscriptionId = subscriptionData?.id;
      } else {
        return response.sendStatus(500);
      }
      if (subscriptionId !== "") {
        return response.sendStatus(200);
      } else {
        return response.sendStatus(500);
      }
    } catch (error) {
      return response.sendStatus(500);
    }
  }
};
