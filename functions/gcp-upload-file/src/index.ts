import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Buffer } from "buffer";
import { createClient } from "contentful-management";
import { config } from "dotenv";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

export const upload: HttpFunction = async (request, response) => {
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

      if (!(request.body instanceof Buffer)) {
        throw Error("Endpoint only accepts file buffers");
      }

      const upload = await environment.createUpload({ file: request.body });

      return response.send(upload);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
};
