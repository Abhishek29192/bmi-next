import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import JSZip from "jszip";
import fetch from "node-fetch";

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

    response.setHeader("Content-type", "application/octet-stream");
    response.setHeader(
      "Content-Disposition",
      "attachment; filename=download.zip"
    );

    try {
      const zip = new JSZip();

      await Promise.all(
        request.body.map(async ({ name, href }) => {
          const { body } = await fetch(href);
          zip.file(`${name}.${href.split(".").pop()}`, body);
        })
      );

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      return response.send(zipBuffer);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
};
