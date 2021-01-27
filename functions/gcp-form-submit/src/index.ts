import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { MailService } from "@sendgrid/mail";
import { createClient } from "contentful-management";
import { config } from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE_ID,
  SENDGRID_API_KEY_SECRET,
  SENDGRID_FROM_EMAIL,
  CONTENTFUL_MANAGEMENT_TOKEN_SECRET,
  SECRET_MAN_GCP_PROJECT_NAME
} = process.env;

let contentfulEnvironmentCache;
let sendGridClientCache;
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
    const apikKeySecret = await secretManagerClient.accessSecretVersion({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${SENDGRID_API_KEY_SECRET}/versions/latest`
    });
    const apiKey = apikKeySecret[0].payload.data.toString();
    sendGridClientCache = new MailService();
    sendGridClientCache.setApiKey(apiKey);
  }
  return sendGridClientCache;
};

export const submit: HttpFunction = async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const environment = await getContentfulEnvironment();
      const {
        body: {
          locale,
          recipients,
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;

      if (!fields || !Object.entries(fields).length) {
        throw Error("Fields are empty");
      }

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
      const email = await sendgridClient.send({
        to: recipients,
        from: SENDGRID_FROM_EMAIL,
        subject: "Website form submission",
        text: JSON.stringify(formResponse),
        html
      });

      return response.send({ assets, email });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
};
