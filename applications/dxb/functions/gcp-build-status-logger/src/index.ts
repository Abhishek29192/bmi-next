import logger from "@bmi-digital/functions-logger";
import { Status } from "simple-http-status";
import { BuildLog } from "@bmi/firestore-types";
import { getFirestore } from "@bmi/functions-firestore";
import { GatsbyLog as RequestBody, BuildStatusType } from "./types";
import type { HttpFunction } from "@google-cloud/functions-framework";

const firestore = getFirestore();

export const buildStatusLogger: HttpFunction = async (req, res) => {
  if (!process.env.GCP_PROJECT_ID) {
    logger.error({
      message: "GCP_PROJECT_ID has not been set"
    });
    return res.sendStatus(Status.HTTP_500_INTERNAL_SERVER_ERROR);
  }

  if (!process.env.FIRESTORE_ROOT_COLLECTION) {
    logger.error({
      message: "FIRESTORE_ROOT_COLLECTION has not been set"
    });
    return res.sendStatus(Status.HTTP_500_INTERNAL_SERVER_ERROR);
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
      return res.sendStatus(Status.HTTP_204_NO_CONTENT);
    }
    res.set("Content-Type", "application/json");

    const { event: eventType, body, buildId }: RequestBody = req.body;

    if (!eventType || !body || !buildId) {
      return res
        .status(Status.HTTP_400_BAD_REQUEST)
        .send("Fields 'event', 'body', and 'buildId' are required");
    }

    const eventDetails: BuildLog = {
      eventType,
      timestamp: new Date().getTime(),
      body,
      buildId
    };

    const isPreviewEvent = getIsPreviewEvent(eventType);
    const docPath = `${process.env.FIRESTORE_ROOT_COLLECTION}/root/${
      isPreviewEvent ? "preview" : "production"
    }/${buildId}`;

    await firestore.doc(docPath).set(eventDetails);

    logger.info({
      message: `Stored Data for ${docPath}: ${JSON.stringify(eventDetails)}`
    });

    return res.status(Status.HTTP_201_CREATED).send(eventDetails);
  } catch (err) {
    logger.error({ message: (err as Error).message });

    return res.status(Status.HTTP_500_INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong, try again later."
    });
  }
};

const getIsPreviewEvent = (eventType: BuildStatusType): boolean =>
  [
    BuildStatusType.PREVIEW_FAILED,
    BuildStatusType.PREVIEW_SUCCEEDED,
    BuildStatusType.PREVIEW_TIMED_OUT
  ].includes(eventType);
