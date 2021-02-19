import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import Archiver from "archiver";
import { verifyOrigins } from "./verify";

const {
  GCS_NAME,
  DXB_VALID_HOSTS,
  SECRET_MAN_GCP_PROJECT_NAME,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MINIMUM_SCORE
} = process.env;

const storage = new Storage();
const bucket = storage.bucket(GCS_NAME);
const validHosts = DXB_VALID_HOSTS.split(",").map((value) => value.trim());
const minimumScore = parseFloat(RECAPTCHA_MINIMUM_SCORE);
const recaptchaTokenHeader = "X-Recaptcha-Token";

let recaptchaSecretKeyCache: string;
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

export const download: HttpFunction = async (request, response) => {
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
      // eslint-disable-next-line no-console
      console.error("Invalid request.");
      return response.status(400).send("Invalid request.");
    }
    if (!request.body.documents?.length) {
      // eslint-disable-next-line no-console
      console.error("List of documents not provided.");
      return response.status(400).send("List of documents not provided.");
    }
    const recaptchaToken =
      // eslint-disable-next-line security/detect-object-injection
      request.headers[recaptchaTokenHeader] ||
      request.headers[recaptchaTokenHeader.toLowerCase()];
    if (!recaptchaToken) {
      // eslint-disable-next-line no-console
      console.error("Token not provided.");
      return response.status(400).send("Token not provided.");
    }

    if (
      !verifyOrigins(
        request.body.documents.map((values) => values.href),
        validHosts
      )
    ) {
      // eslint-disable-next-line no-console
      console.error("Invalid host(s).");
      return response.status(400).send("Invalid host(s).");
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
        return response.status(400).send("Recaptcha check failed.");
      }
      const json = await recaptchaResponse.json();
      if (!json.success || json.score < minimumScore) {
        // eslint-disable-next-line no-console
        console.error(
          `Recaptcha check failed with error ${JSON.stringify(json)}.`
        );
        return response.status(400).send("Recaptcha check failed.");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Recaptcha request failed with error ${error}.`);
      return response.status(500).send("Recaptcha request failed.");
    }

    response.setHeader("Content-type", "application/json");

    try {
      const fileName = Date.now();
      const zipFile = bucket.file(`${fileName}.zip`);
      const zipFileWriteStream = zipFile.createWriteStream();

      const archive = new Archiver("zip", {
        zlib: { level: 9 } // Sets the compression level.
      });

      // good practice to catch this error explicitly
      archive.on("error", function (err) {
        // eslint-disable-next-line no-console
        console.error(`archive error: ${err}`);
        throw err;
      });

      archive.pipe(zipFileWriteStream);

      await Promise.all(
        request.body.documents.map(async ({ name, href }) => {
          const response = await fetch(href);
          if (!response.ok) {
            // eslint-disable-next-line no-console
            console.error(
              `Got a non-ok response back from document fetch (${response.status}). Not throwing an error to allow other documents to be downloaded.`
            );
          }
          const buffer = await response.buffer();
          archive.append(buffer, { name: name });
        })
      ).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
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
      // eslint-disable-next-line no-console
      console.log(error);
      return response.status(500).send(error);
    }
  }
};
