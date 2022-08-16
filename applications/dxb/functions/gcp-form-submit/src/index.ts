import logger from "@bmi-digital/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { MailService } from "@sendgrid/mail";
import { createClient } from "contentful-management";
import { Environment } from "contentful-management/dist/typings/entities/environment";
import fetch from "node-fetch";

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  CONTENTFUL_MANAGEMENT_TOKEN,
  RECAPTCHA_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

const MAX_RECIPIENTS = 4;

const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1");
const recaptchaTokenHeader = "X-Recaptcha-Token";

let contentfulEnvironmentCache: Environment | undefined;
let sendGridClientCache: MailService | undefined;

const getContentfulEnvironment = async () => {
  if (!contentfulEnvironmentCache) {
    logger.info({ message: "No Contentful Environment Cache found" });

    const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_TOKEN! });
    const space = await client.getSpace(CONTENTFUL_SPACE_ID!);
    contentfulEnvironmentCache = await space.getEnvironment(
      CONTENTFUL_ENVIRONMENT!
    );

    logger.info({
      message: `Created ${CONTENTFUL_ENVIRONMENT} Contentful Environment`
    });
  }
  return contentfulEnvironmentCache;
};

const getSendGridClient = async () => {
  if (!sendGridClientCache) {
    logger.info({ message: "No SendGrid Client Cache found" });

    sendGridClientCache = new MailService();
    sendGridClientCache.setApiKey(SENDGRID_API_KEY!);

    logger.info({ message: "Created SendGrid Client" });
  }
  return sendGridClientCache;
};

const getRecipientsArray = (recipients: string) => {
  const result = recipients
    .replace(/\s/g, "")
    .split(",")
    .filter((recipient) => Boolean(recipient));

  return [...new Set<string>(result)].slice(0, MAX_RECIPIENTS);
};

export const submit: HttpFunction = async (request, response) => {
  if (!CONTENTFUL_MANAGEMENT_TOKEN) {
    logger.error({
      message: "CONTENTFUL_MANAGEMENT_TOKEN has not been set"
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

  if (!RECAPTCHA_KEY) {
    logger.error({ message: "RECAPTCHA_KEY has not been set" });
    return response.sendStatus(500);
  }

  if (!SENDGRID_API_KEY) {
    logger.error({ message: "SENDGRID_API_KEY has not been set" });
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
          title,
          locale,
          emailSubjectFormat,
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;

      if (!fields || !Object.entries(fields).length) {
        logger.error({ message: "Fields are empty" });
        return response.status(400).send(Error("Fields are empty."));
      }

      const recipients = getRecipientsArray(request.body.recipients);
      const emailSubject = generateEmailSubject(
        title,
        fields,
        emailSubjectFormat
      );

      logger.info({
        message: `Email '${emailSubject}' includes ${
          Object.keys(fields).length
        } fields and ${files?.length ?? 0} files`
      });

      const recaptchaToken =
        // eslint-disable-next-line security/detect-object-injection
        request.headers[recaptchaTokenHeader] ||
        request.headers[recaptchaTokenHeader.toLowerCase()];
      if (!recaptchaToken) {
        logger.error({ message: "Token not provided." });
        return response.status(400).send(Error("Token not provided."));
      }

      try {
        logger.info({ message: "Starting Recaptcha check" });
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_KEY}&response=${recaptchaToken}`,
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
        logger.info({ message: "Recaptcha check successful" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
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
                  .then((asset) =>
                    asset.processForAllLocales().then((asset) => {
                      return asset;
                    })
                  )
              )
            )
          : [];

      const uploadedAssets = assets
        // eslint-disable-next-line security/detect-object-injection
        .map(({ fields }) => fields.file[locale]?.url)
        .filter(Boolean);

      logger.info({ message: `Uploaded ${uploadedAssets.length} assets` });

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
        subject: emailSubject,
        text: JSON.stringify(formResponse),
        html
      });

      logger.info({ message: `Email '${emailSubject}' sent to ${recipients}` });
      return response.sendStatus(200);
    } catch (error) {
      logger.error({ message: (error as Error).message });
      return response.sendStatus(500);
    }
  }
};

const generateEmailSubject = (
  formTitle: string,
  fields: Record<string, string>,
  emailSubjectFormat?: string
) => {
  if (!emailSubjectFormat) {
    return formTitle;
  }

  const emailSubjectFields = emailSubjectFormat.match(/\{\{.+?\}\}/g) ?? [];

  const emailSubjectEntries = emailSubjectFields.map((field) => {
    const formattedField = field.replace(/\{\{/, "").replace(/\}\}/, "");

    return [field, fields[formattedField.toString()] || ""];
  });

  let result = emailSubjectFormat;
  emailSubjectEntries.forEach(([field, value]) => {
    result = result.replace(field, value);
  });

  return result ? result : formTitle;
};
