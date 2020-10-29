import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { createClient } from "contentful-management";
import { config } from "dotenv";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

export const submit: HttpFunction = async (request, response) => {
  const {
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: accessToken
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
          values: { files, ...fields } // @todo "files" probably shouldn't come from CMS
        }
      } = request;

      if (!fields || !Object.entries(fields).length) {
        throw Error("Fields are empty");
      }

      const assets = await Promise.all(
        files.map(
          async (file) =>
            await environment
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
      );

      const entry = await environment.createEntry("formResponse", {
        fields: {
          title: {
            [locale]: `Form: "${title}"`
          },
          assets,
          fields
        }
      });

      return response.send({ entry, assets });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
};
