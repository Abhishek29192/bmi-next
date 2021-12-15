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
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE);
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment;
let sendGridClientCache: MailService;
let recaptchaSecretKeyCache: string;
const secretManagerClient = new SecretManagerServiceClient();

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    const managementTokenSecret = await secretManagerClient.accessSecretVersion(
      {
        name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${CONTENTFUL_MANAGEMENT_TOKEN_SECRET}/versions/latest`
      }
    );
    const managementToken = managementTokenSecret[0].payload.data.toString();
    const client = createClient({ accessToken: managementToken });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT
    );
  }
  return contentfulEnvironmentCache;
};

const getSendGridClient = async () => {
  if (!sendGridClientCache) {
    const apiKeySecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    const apiKey = apiKeySecret[0].payload.data.toString();
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

      const assets: Array<any> =
        files && files.length
          ? await Promise.all(
              files.map((file) =>
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

      const sendgridClient = await getSendGridClient();
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
