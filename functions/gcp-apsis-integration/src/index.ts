import { escape } from "querystring";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

type RequestRedirect = "error" | "follow" | "manual";

const {
  APSIS_API_BASE_URL,
  APSIS_CLIENT_ID,
  APSIS_CLIENT_SECRET,
  APSIS_TARGET_KEYSPACE,
  APSIS_TARGET_SECTION,
  APSIS_CONSENT_LIST_DESCRIMINATOR,
  APSIS_TOPIC_DESCRIMINATOR,
  APSIS_TARGET_EMAIL_ATTRIBUTE_ID,
  APSIS_TARGET_GDPR_1_ATTRIBUTE_ID,
  APSIS_TARGET_GDPR_2_ATTRIBUTE_ID,
  APSIS_TARGET_FIRST_NAME_ATTRIBUTE_ID,
  APSIS_TARGET_CHANNEL,
  SECRET_MAN_GCP_PROJECT_NAME,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE);
const recaptchaTokenHeader = "X-Recaptcha-Token";

const apsisAudianceBase = `${APSIS_API_BASE_URL}/audience`;

let recaptchaSecretKeyCache: string;
let apsisClientSecretCache: string;
const secretManagerClient = new SecretManagerServiceClient();

const getRecaptchaSecretKey = async () => {
  if (!recaptchaSecretKeyCache) {
    const recaptchaSecretKey = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${RECAPTCHA_SECRET_KEY}/versions/latest`
    });

    recaptchaSecretKeyCache = recaptchaSecretKey[0].payload.data.toString();
  }
  return recaptchaSecretKeyCache;
};

const getAuthToken = async () => {
  if (!apsisClientSecretCache) {
    const apsisSecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${APSIS_CLIENT_SECRET}/versions/latest`
    });

    apsisClientSecretCache = apsisSecret[0].payload.data.toString();
  }

  const redirect: RequestRedirect = "follow";
  var requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: APSIS_CLIENT_ID,
      client_secret: apsisClientSecretCache,
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

  return await response.json();
};

const createProfile = async (
  access_token: string,
  email: string,
  gdpr_1: boolean,
  gdpr_2: boolean,
  name: string
) => {
  const createProfileEndpoint = `${apsisAudianceBase}/keyspaces/${APSIS_TARGET_KEYSPACE}/profiles/${escape(
    email
  )}/sections/${APSIS_TARGET_SECTION}/attributes`;
  const payload = {
    [APSIS_TARGET_EMAIL_ATTRIBUTE_ID]: email,
    [APSIS_TARGET_GDPR_1_ATTRIBUTE_ID]: gdpr_1,
    [APSIS_TARGET_GDPR_2_ATTRIBUTE_ID]: gdpr_2
  };

  if (APSIS_TARGET_FIRST_NAME_ATTRIBUTE_ID && name) {
    // Roof calculator sends 'name' additionally - but does not split it to first and last name.
    // Use first-name attribute in Apsis to capture the full name.
    payload[APSIS_TARGET_FIRST_NAME_ATTRIBUTE_ID.toString()] = name;
  }

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
};

const createConsent = async (access_token: string, email: string) => {
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
};

const createSubscription = async (access_token: string, email: string) => {
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

  return await response.json();
};

const validateEmail = (email: string): boolean => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validateGDPR = (gdpr_1: boolean, gdpr_2: boolean) => {
  return gdpr_1 && gdpr_2;
};

export const optInEmailMarketing: HttpFunction = async (request, response) => {
  let subscriptionId = "";
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", [
      "Content-Type",
      recaptchaTokenHeader
    ]);
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const {
        body: { email, gdpr_1, gdpr_2, name }
      } = request;

      if (!validateEmail(email) || !validateGDPR(gdpr_1, gdpr_2)) {
        return response.status(400).send(Error("Invalid input received."));
      }

      const recaptchaToken =
        // eslint-disable-next-line security/detect-object-injection
        request.headers[recaptchaTokenHeader] ||
        request.headers[recaptchaTokenHeader.toLowerCase()];
      if (!recaptchaToken) {
        // eslint-disable-next-line no-console
        console.error("Token not provided.");
        return response.status(400).send(Error("Token not provided."));
      }

      try {
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${await getRecaptchaSecretKey()}&response=${recaptchaToken}`,
          { method: "POST" }
        );
        if (!recaptchaResponse.ok) {
          // eslint-disable-next-line no-console
          console.error(
            `Recaptcha check failed with status ${recaptchaResponse.status}.`
          );
          return response.status(400).send(Error("Recaptcha check failed."));
        }
        const json = await recaptchaResponse.json();
        if (!json.success || json.score < minimumScore) {
          // eslint-disable-next-line no-console
          console.error(
            `Recaptcha check failed with error ${JSON.stringify(json)}.`
          );
          return response.status(400).send(Error("Recaptcha check failed."));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Recaptcha request failed with error ${error}.`);
        return response.status(500).send(Error("Recaptcha request failed."));
      }

      const { access_token } = await getAuthToken();

      await createProfile(access_token, email, gdpr_1, gdpr_2, name);

      await createConsent(access_token, email);

      const subscriptionData = await createSubscription(access_token, email);

      subscriptionId = subscriptionData.id;

      if (!subscriptionId) {
        return response.sendStatus(500);
      } else {
        return response.sendStatus(200);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`APSIS integration Error occured`, error);
      return response.sendStatus(500);
    }
  }
};
