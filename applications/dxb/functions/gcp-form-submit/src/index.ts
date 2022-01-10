import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { MailService } from "@sendgrid/mail";
import { createClient } from "contentful-management";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Environment } from "contentful-management/dist/typings/entities/environment";
import fetch from "node-fetch";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SENDGRID_API_KEY_SECRET,
  SENDGRID_FROM_EMAIL,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET,
  SECRET_MAN_GCP_PROJECT_NAME,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1");
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment | undefined;
let sendGridClientCache: MailService | undefined;
let recaptchaSecretKeyCache: string | undefined;
const secretManagerClient = new SecretManagerServiceClient();

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- For some reason, eslint doesn't always like optional chained calls
    const managementTokenSecret = await secretManagerClient.accessSecretVersion(
      {
        name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
      }
    );
    const managementToken =
      managementTokenSecret?.[0]?.payload?.data?.toString();
    if (!managementToken) {
      // eslint-disable-next-line no-console
      console.error("Unable to find contentful management token");
      return;
    }
    const client = createClient({ accessToken: managementToken });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID!);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT!
    );
  }
  return contentfulEnvironmentCache;
};

const getSendGridClient = async () => {
  if (!sendGridClientCache) {
    const apiKeySecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    if (!apiKeySecret) {
      // eslint-disable-next-line no-console
      console.error("Unable to find send grid API key");
      return;
    }
    const apiKey = apiKeySecret?.[0]?.payload?.data?.toString();
    if (!apiKey) {
      return;
    }
    sendGridClientCache = new MailService();
    sendGridClientCache.setApiKey(apiKey);
  }
  return sendGridClientCache;
};

const getRecaptchaSecretKey = async () => {
  if (!recaptchaSecretKeyCache) {
    const recaptchaSecretKey = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${RECAPTCHA_SECRET_KEY}/versions/latest`
    });

    if (!recaptchaSecretKey[0].payload?.data) {
      throw Error("Unable to get ReCaptcha secret key");
    }

    recaptchaSecretKeyCache = recaptchaSecretKey[0].payload.data.toString();
  }
  return recaptchaSecretKeyCache;
};

export const submit: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_SPACE_ID) {
    // eslint-disable-next-line no-console
    console.error("CONTENTFUL_SPACE_ID has not been set");
    return response.status(500).send(Error("Something went wrong."));
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    // eslint-disable-next-line no-console
    console.error("CONTENTFUL_ENVIRONMENT has not been set");
    return response.status(500).send(Error("Something went wrong."));
  }

  if (!SENDGRID_FROM_EMAIL) {
    // eslint-disable-next-line no-console
    console.error("SENDGRID_FROM_EMAIL has not been set");
    return response.status(500).send(Error("Something went wrong."));
  }

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
      if (!request.body) {
        // eslint-disable-next-line no-console
        console.error("Invalid request.");
        return response.status(400).send(Error("Invalid request."));
      }

      const {
        body: {
          locale,
          recipients,
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;

      if (!fields || !Object.entries(fields).length) {
        return response.status(400).send(Error("Fields are empty."));
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

      const environment = await getContentfulEnvironment();
      if (!environment) {
        // eslint-disable-next-line no-console
        console.error(
          "Contentful environment client could not be instantiated."
        );
        return response.sendStatus(500);
      }

      const sendgridClient = await getSendGridClient();
      if (!sendgridClient) {
        // eslint-disable-next-line no-console
        console.error("Send grid client could not be instantiated.");
        return response.sendStatus(500);
      }

      const assets: any[] =
        files && files.length
          ? await Promise.all(
              files.map((file: any) =>
                environment
                  .createAsset({
                    fields: {
                      title: {
                        [locale]: `User upload ${+new Date()}`
                      },
                      file: {
                        [locale]: file
                      }
                    }
                  })
                  .then((asset) => asset.processForAllLocales())
              )
            )
          : [];

      const uploadedAssets = assets
        // eslint-disable-next-line security/detect-object-injection
        .map(({ fields }) => fields.file[locale]?.url)
        .filter(Boolean);

      const formResponse = {
        ...fields,
        uploadedAssets
      };

      const html = `<ul>${Object.entries(formResponse)
        .map(
          ([key, value]) => `<li><b>${key}</b>: ${JSON.stringify(value)}</li>`
        )
        .join("")}</ul>`;

      await sendgridClient.send({
        to: recipients,
        from: SENDGRID_FROM_EMAIL,
        subject: "Website form submission",
        text: JSON.stringify(formResponse),
        html
      });

      return response.sendStatus(200);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return response.sendStatus(500);
    }
  }
};
