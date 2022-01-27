import logger from "@bmi/functions-logger";
import { getSecret } from "@bmi/functions-secret-client";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage";
import archiver from "archiver";
import { verifyOrigins } from "./verify";

const {
  GCS_NAME,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- is being used in an optional chain, but eslint isn't detecting it
  DXB_VALID_HOSTS,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

const storage = new Storage();
const bucket = GCS_NAME && storage.bucket(GCS_NAME);
const validHosts =
  DXB_VALID_HOSTS?.split(",").map((value) => value.trim()) || [];
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE || "1.0");
const recaptchaTokenHeader = "X-Recaptcha-Token";

type Document = {
  name?: string;
  href?: string;
};

export const download: HttpFunction = async (request, response) => {
  if (!RECAPTCHA_SECRET_KEY) {
    logger.error({
      message: "RECAPTCHA_SECRET_KEY was not provided"
    });
    return response.sendStatus(500);
  }

  if (!bucket) {
    logger.error({ message: "Unable to connect to a storage bucket" });
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
    if (!request.body) {
      logger.error({ message: "Invalid request." });
      return response.status(400).send("Invalid request.");
    }
    if (!request.body.documents?.length) {
      logger.error({ message: "List of documents not provided." });
      return response.status(400).send("List of documents not provided.");
    }
    const recaptchaToken =
      // eslint-disable-next-line security/detect-object-injection
      request.headers[recaptchaTokenHeader] ||
      request.headers[recaptchaTokenHeader.toLowerCase()];
    if (!recaptchaToken) {
      logger.error({ message: "Token not provided." });
      return response.status(400).send("Token not provided.");
    }

    if (request.body.documents.find((values: Document) => !values.name)) {
      logger.error({ message: "Missing name(s)." });
      return response.status(400).send("Missing name(s).");
    }

    if (request.body.documents.find((values: Document) => !values.href)) {
      logger.error({ message: "Missing HREF(s)." });
      return response.status(400).send("Missing HREF(s).");
    }

    if (
      !verifyOrigins(
        request.body.documents.map((values: Document) => values.href),
        validHosts
      )
    ) {
      logger.error({ message: "Invalid host(s)." });
      return response.status(400).send("Invalid host(s).");
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
        return response.status(400).send("Recaptcha check failed.");
      }
      const json = await recaptchaResponse.json();
      if (!json.success || json.score < minimumScore) {
        logger.error({
          message: `Recaptcha check failed with error ${JSON.stringify(json)}.`
        });
        return response.status(400).send("Recaptcha check failed.");
      }
    } catch (error) {
      logger.error({
        message: `Recaptcha request failed with error ${error}.`
      });
      return response.status(500).send("Recaptcha request failed.");
    }

    response.setHeader("Content-type", "application/json");

    try {
      const fileName = Date.now();
      const zipFile = bucket.file(`${fileName}.zip`);
      const zipFileWriteStream = zipFile.createWriteStream();

      const archive = archiver("zip", {
        zlib: { level: 9 } // Sets the compression level.
      });

      // good practice to catch this error explicitly
      archive.on("error", function (err) {
        logger.error({ message: `archive error: ${err}` });
        throw err;
      });

      archive.pipe(zipFileWriteStream);

      await Promise.all(
        request.body.documents.map(async ({ name, href }: Document) => {
          const response = await fetch(href!);
          if (!response.ok) {
            logger.error({
              message: `Got a non-ok response back from document fetch (${response.status}). Not throwing an error to allow other documents to be downloaded.`
            });
          }
          const buffer = await response.buffer();
          archive.append(buffer, { name: name! });
        })
      ).catch((err) => {
        logger.error({ message: err.message });
        return response
          .status(500)
          .send("Failed to add a doument to the zip file.");
      });

      const promise = new Promise((resolve, reject) =>
        zipFileWriteStream.on("finish", resolve).on("error", reject)
      );

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method
      // so register to them beforehand
      archive.finalize();

      await promise;

      let url = zipFile.publicUrl();
      return response.send({ url: url });
    } catch (error) {
      logger.error({ message: error.message });
      return response.status(500).send(error);
    }
  }
};
