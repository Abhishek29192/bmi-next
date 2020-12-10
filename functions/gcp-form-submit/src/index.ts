import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import sgMail from "@sendgrid/mail";
import { createClient } from "contentful-management";
import { config } from "dotenv";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

export const submit: HttpFunction = async (request, response) => {
  const {
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: accessToken,
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL
  } = process.env;

  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    try {
      const client = createClient({ accessToken });
      const space = await client.getSpace(CONTENTFUL_SPACE_ID);
      const environment = await space.getEnvironment(CONTENTFUL_ENVIRONMENT);
      const {
        body: {
          locale,
          title,
          recipients,
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;

      if (!fields || !Object.entries(fields).length) {
        throw Error("Fields are empty");
      }

      const assets = files.length
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
        : null;

      const entry =
        assets !== null
          ? await environment.createEntry("formResponse", {
              fields: {
                title: {
                  [locale]: `Form: "${title}"`
                },
                assets,
                fields
              }
            })
          : null;

      sgMail.setApiKey(SENDGRID_API_KEY);

      const html = `<ul>${Object.entries(fields)
        .map(([key, value]) => `<li><b>${key}</b>: ${value}</li>`)
        .join("")}</ul>`;

      const email = await sgMail.send({
        to: recipients,
        from: SENDGRID_FROM_EMAIL,
        subject: "Website form submission",
        text: JSON.stringify(fields),
        html
      });

      return response.send({ entry, assets, email });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
};
