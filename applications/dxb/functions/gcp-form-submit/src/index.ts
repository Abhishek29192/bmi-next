import logger from "@bmi/functions-logger";
import { getSecret } from "@bmi/functions-secret-client";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { MailService } from "@sendgrid/mail";
import { createClient } from "contentful-management";
import { Environment } from "contentful-management/dist/typings/entities/environment";
import fetch from "node-fetch";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SENDGRID_API_KEY_SECRET,
  SENDGRID_FROM_EMAIL,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1");
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment | undefined;
let sendGridClientCache: MailService | undefined;

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    const managementToken = await getSecret(
      CONTENTFUL_MANAGEMENT_TOKEN_SECRET!
    );
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
    const apiKey = await getSecret(SENDGRID_API_KEY_SECRET!);
    sendGridClientCache = new MailService();
    sendGridClientCache.setApiKey(apiKey);
  }
  return sendGridClientCache;
};

export const submit: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_MANAGEMENT_TOKEN_SECRET) {
    logger.error({
      message: "CONTENTFUL_MANAGEMENT_TOKEN_SECRET has not been set"
    });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_SPACE_ID) {
    logger.error({ message: "CONTENTFUL_SPACE_ID has not been set" });
    return response.sendStatus(500);
  }

  if (!CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "CONTENTFUL_ENVIRONMENT has not been set" });
    return response.sendStatus(500);
  }

  if (!RECAPTCHA_SECRET_KEY) {
    logger.error({ message: "RECAPTCHA_SECRET_KEY has not been set" });
    return response.sendStatus(500);
  }

  if (!SENDGRID_API_KEY_SECRET) {
    logger.error({ message: "SENDGRID_API_KEY_SECRET has not been set" });
    return response.sendStatus(500);
  }

  if (!SENDGRID_FROM_EMAIL) {
    logger.error({ message: "SENDGRID_FROM_EMAIL has not been set" });
    return response.sendStatus(500);
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
        logger.error({ message: "Invalid request." });
        return response.status(400).send(Error("Invalid request."));
      }

      const {
        body: {
          locale,
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;
      const recipients = request.body.recipients.replace(/\s/, "").split(",");

      if (!fields || !Object.entries(fields).length) {
        return response.status(400).send(Error("Fields are empty."));
      }

      const recaptchaToken =
        // eslint-disable-next-line security/detect-object-injection
        request.headers[recaptchaTokenHeader] ||
        request.headers[recaptchaTokenHeader.toLowerCase()];
      if (!recaptchaToken) {
        logger.error({ message: "Token not provided." });
        return response.status(400).send(Error("Token not provided."));
      }

      try {
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${await getSecret(
            RECAPTCHA_SECRET_KEY
          )}&response=${recaptchaToken}`,
          { method: "POST" }
        );
        if (!recaptchaResponse.ok) {
          logger.error({
            message: `Recaptcha check failed with status ${recaptchaResponse.status} ${recaptchaResponse.statusText}.`
          });
          return response.status(400).send(Error("Recaptcha check failed."));
        }
        const json = await recaptchaResponse.json();
        if (!json.success || json.score < minimumScore) {
          logger.error({
            message: `Recaptcha check failed with error ${JSON.stringify(
              json
            )}.`
          });
          return response.status(400).send(Error("Recaptcha check failed."));
        }
      } catch (error) {
        logger.error({
          message: `Recaptcha request failed with error ${error}.`
        });
        return response.status(500).send(Error("Recaptcha request failed."));
      }

      const environment = await getContentfulEnvironment();

      const sendgridClient = await getSendGridClient();

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
      logger.error({ message: error.message });
      return response.sendStatus(500);
    }
  }
};
