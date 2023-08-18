import logger from "@bmi-digital/functions-logger";
import { BuildLog } from "@bmi/firestore-types";
import { GatsbyLog as RequestBody, BuildStatusType } from "./types";
import { getBuildStartedEventId, setDocumentInFirestore } from "./db";
import type { HttpFunction } from "@google-cloud/functions-framework";

export const buildStatusLogger: HttpFunction = async (req, res) => {
  if (!process.env.GCP_PROJECT_ID) {
    logger.error({
      message: "GCP_PROJECT_ID has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.FIRESTORE_ROOT_COLLECTION) {
    logger.error({
      message: "FIRESTORE_ROOT_COLLECTION has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.GATSBY_SITE_URL) {
    logger.error({
      message: "GATSBY_SITE_URL has not been set"
    });
    return res.sendStatus(500);
  }

  try {
    res.set("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", [
        "Content-Type",
        "Access-Control-Allow-Origin"
      ]);
      res.set("Access-Control-Max-Age", "3600");
      return res.sendStatus(204);
    }
    res.set("Content-Type", "application/json");
    logger.info({ message: `Received data - ${JSON.stringify(req.body)}` });

    const {
      event: eventType,
      body,
      buildId,
      deployPreviewUrl
    }: RequestBody = req.body;

    if (
      deployPreviewUrl &&
      new URL(deployPreviewUrl).host !==
        new URL(process.env.GATSBY_SITE_URL).host
    ) {
      //returns 400 error for mere request preview builds and other non expected resources
      return res.status(400).send("'deployPreviewUrl' field is not correct");
    }

    if (!eventType || !body) {
      return res.status(400).send("Fields 'event' and 'body' are required");
    }

    const timestamp = new Date().getTime();
    const eventDetails: BuildLog = {
      eventType,
      timestamp,
      body,
      buildId
    };

    const isPreviewEvent = getIsPreviewEvent(eventType);
    const collectionPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/root/${
      isPreviewEvent ? "preview" : "production"
    }`;

    const buildStartedEventId = await getBuildStartedEventId(
      collectionPath,
      isPreviewEvent
    );
    let docPath = `${collectionPath}/${timestamp}`;

    if (buildStartedEventId) {
      //Replaces the latest BUILD_STARTED or PREVIEW_BUILD_STARTED event with SUCCEEDED or FAILED event
      docPath = `${collectionPath}/${buildStartedEventId}`;
      await setDocumentInFirestore(docPath, eventDetails);

      logger.info({
        message: `Document ${docPath} has been updated: ${JSON.stringify(
          eventDetails
        )}`
      });
      return res.status(200).send(eventDetails);
    }

    await setDocumentInFirestore(docPath, eventDetails);
    logger.info({
      message: `Stored Data for ${docPath}: ${JSON.stringify(eventDetails)}`
    });

    return res.status(201).send(eventDetails);
  } catch (err) {
    logger.error({ message: (err as Error).message });

    return res.status(500).send({
      message: "Something went wrong, try again later."
    });
  }
};

const getIsPreviewEvent = (eventType: BuildStatusType): boolean =>
  [
    BuildStatusType.PREVIEW_BUILD_STARTED,
    BuildStatusType.PREVIEW_FAILED,
    BuildStatusType.PREVIEW_SUCCEEDED,
    BuildStatusType.PREVIEW_TIMED_OUT
  ].includes(eventType);
