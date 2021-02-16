import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage";
import Archiver from "archiver";
import { verifyOrigins } from "./verify";

const storage = new Storage();
const bucketName = process.env.GCS_NAME;
const bucket = storage.bucket(bucketName);
const validHosts = process.env.DXB_VALID_HOSTS.split(",").map((value) =>
  value.trim()
);
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
const minimumScore = parseFloat(process.env.RECAPTCHA_MINIMUM_SCORE);

export const download: HttpFunction = async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
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
    if (!request.headers["X-Recaptcha-Token"]) {
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
        `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${request.headers["X-Recaptcha-Token"]}`,
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
            throw Error(
              `Got a non-ok response back from document fetch (${response.status}).`
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
