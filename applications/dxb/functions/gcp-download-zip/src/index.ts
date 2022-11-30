import { Writable } from "stream";
import logger from "@bmi-digital/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { File, Storage } from "@google-cloud/storage";
import archiver from "archiver";
import fetch from "node-fetch";
import { verifyOrigins } from "./verify";

const { GCS_NAME, DXB_VALID_HOSTS, RECAPTCHA_KEY, RECAPTCHA_MINIMUM_SCORE } =
  process.env;

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
  if (!RECAPTCHA_KEY) {
    logger.error({
      message: "RECAPTCHA_KEY was not provided"
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
    const authorizationToken = request.headers.authorization;
    const qaAuthToken = process.env.QA_AUTH_TOKEN;
    if (
      authorizationToken &&
      authorizationToken.substring("Bearer ".length) !== qaAuthToken
    ) {
      logger.error({ message: "QaAuthToken failed." });
      return response.status(400).send("QaAuthToken failed.");
    }

    const recaptchaToken =
      // eslint-disable-next-line security/detect-object-injection
      request.headers[recaptchaTokenHeader] ||
      request.headers[recaptchaTokenHeader.toLowerCase()];
    if (!authorizationToken && !recaptchaToken) {
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
    if (!authorizationToken && recaptchaToken) {
      try {
        const recaptchaResponse = await fetch(
          `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_KEY}&response=${recaptchaToken}`,
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
            message: `Recaptcha check failed with error ${JSON.stringify(
              json
            )}.`
          });
          return response.status(400).send("Recaptcha check failed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error({
          message: `Recaptcha request failed with error ${error}.`
        });
        return response.status(500).send("Recaptcha request failed.");
      }
    }

    response.setHeader("Content-type", "application/json");

    let zipFile: File;
    let zipFileWriteStream: Writable;
    try {
      const fileName = Date.now();
      zipFile = bucket.file(`${fileName}.zip`);
      zipFileWriteStream = zipFile.createWriteStream();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error({
        message: `Failed to create zip file stream: ${error}`
      });
      return response.status(500).send(error);
    }

    const zipStreamPromise = new Promise<void>((resolve, reject) =>
      zipFileWriteStream
        .on("finish", () => {
          logger.info({ message: "Zip stream finish." });
          resolve();
        })
        .on(
          "end",
          // istanbul ignore next: cannot be tested
          () => {
            logger.info({ message: "Zip stream end." });
            resolve();
          }
        )
        .on("close", () => {
          logger.info({ message: "Zip stream close." });
          resolve();
        })
        .on(
          "error",
          // istanbul ignore next: cannot be tested
          (error) => {
            logger.error({ message: `Zip stream error: ${error}` });
            reject(error);
          }
        )
    );

    const archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });

    const archivePromise = new Promise<void>((resolve, reject) =>
      archive
        .on("finish", () => {
          logger.info({ message: "Archive finish." });
          resolve();
        })
        .on("end", () => {
          logger.info({ message: "Archive end." });
          resolve();
        })
        .on(
          "close",
          // istanbul ignore next: cannot be tested
          () => {
            logger.info({ message: "Archive close." });
            resolve();
          }
        )
        .on(
          "error",
          // istanbul ignore next: cannot be tested
          (error) => {
            logger.error({ message: `Archive error: ${error}` });
            reject(error);
          }
        )
    );

    archive.pipe(zipFileWriteStream);

    try {
      await Promise.all(
        request.body.documents.map(async ({ name, href }: Document) => {
          const fetchResponse = await fetch(href!);
          if (!fetchResponse.ok) {
            logger.error({
              message: `Got a non-ok response back from document fetch (${fetchResponse.status}). Not throwing an error to allow other documents to be downloaded.`
            });
            return;
          }
          logger.info({ message: `Appending ${name} to zip.` });
          const buffer = await fetchResponse.buffer();
          archive.append(buffer, { name: name! });
          logger.info({ message: `Appended ${name} to zip.` });
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error({
        message: `Failed to add a document to the zip file: ${error}`
      });
      return response
        .status(500)
        .send("Failed to add a doument to the zip file.");
    }

    logger.info({ message: "Appended all files to the zip file." });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method
    // so register to them beforehand
    await archive.finalize();

    logger.info({ message: "Archive finalized." });

    await archivePromise;
    await zipStreamPromise;

    logger.info({ message: "Getting zip file public URL." });
    const url = zipFile.publicUrl();
    logger.info({ message: `Zip file created at: ${url}` });
    return response.send({ url: url });
  }
};
