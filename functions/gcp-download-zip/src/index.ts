import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { Storage } from "@google-cloud/storage/build/src/storage";
import Archiver from "archiver";

const storage = new Storage();
const bucketName = process.env.GCS_NAME;
const bucket = storage.bucket(bucketName);

export const download: HttpFunction = async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");

    return response.status(204).send("");
  } else {
    if (!(request.body && request.body.length)) {
      return response.status(400).send("Invalid request.");
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
        console.log(`archive error: ${err}`);
        throw err;
      });

      archive.pipe(zipFileWriteStream);

      await Promise.all(
        request.body.map(async ({ name, href }) => {
          const buffer = await fetch(href).then((res) => res.buffer());
          archive.append(buffer, { name: name });
        })
      ).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method
      // so register to them beforehand
      archive.finalize();

      await new Promise((resolve, reject) =>
        zipFileWriteStream.on("finish", resolve).on("error", reject)
      );

      let url = zipFile.publicUrl();
      return response.send({ url: url });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return response.status(500).send(error);
    }
  }
};
