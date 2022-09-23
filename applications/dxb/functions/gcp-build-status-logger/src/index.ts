import { IncomingHttpHeaders } from "http";
import logger from "@bmi-digital/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Status } from "simple-http-status";
import { getList, saveBuildStatus } from "./db";

type BuildStatusBase = {
  timestamp: string;
  event: string;
};

export type BuildStatusData = BuildStatusBase & {
  body: string;
  isError: boolean;
};
export type ContentfulTriggeredBuildStatusData = BuildStatusBase & {
  userId: string;
};

const getIsValidToken = (headers: IncomingHttpHeaders) => {
  const auth = headers.authorization || headers.Authorization;
  return Boolean(auth && auth === `Bearer ${process.env.BEARER_TOKEN_SECRET}`);
};

export const buildStatusLogger: HttpFunction = async (req, res) => {
  if (!process.env.FIRESTORE_BUILD_STATUS_COLLECTION) {
    logger.error({
      message: "FIRESTORE_BUILD_STATUS_COLLECTION has not been set"
    });
    return res.sendStatus(Status.HTTP_500_INTERNAL_SERVER_ERROR);
  }

  if (!process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION) {
    logger.error({
      message: "FIRESTORE_BUILD_STATUS_COLLECTION has not been set"
    });
    return res.sendStatus(Status.HTTP_500_INTERNAL_SERVER_ERROR);
  }

  if (!process.env.BEARER_TOKEN_SECRET) {
    logger.error({ message: "BEARER_TOKEN_SECRET has not been set" });
    return res.sendStatus(Status.HTTP_500_INTERNAL_SERVER_ERROR);
  }

  try {
    res.set("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST,GET");
      res.set("Access-Control-Allow-Headers", [
        "Content-Type",
        "Access-Control-Allow-Origin",
        "Authorization"
      ]);
      res.set("Access-Control-Max-Age", "3600");
      return res.sendStatus(Status.HTTP_204_NO_CONTENT);
    }

    if (req.body && req.method === "POST") {
      res.set("Content-Type", "application/json");
      let eventDetails: ContentfulTriggeredBuildStatusData | BuildStatusData;
      let collectionId;
      if (req.headers["x-contentful-webhook-name"]) {
        eventDetails = {
          event: "BUILD TRIGGRED",
          timestamp: new Date(req.body.sys.updatedAt).toLocaleString(),
          userId: req.body.sys.updatedBy.sys.id
        };
        collectionId = process.env.FIRESTORE_TRIGGERED_BUILDS_COLLECTION!;
      } else {
        const { event, body } = req.body;

        eventDetails = {
          event: event.replace("_", " "),
          isError: event.includes("FAILED"),
          timestamp: new Date().toLocaleString(),
          body: body
        };
        collectionId = process.env.FIRESTORE_BUILD_STATUS_COLLECTION!;
      }

      await saveBuildStatus(eventDetails, collectionId);

      logger.info({
        message: `Stored Data for ${collectionId}: ${JSON.stringify(
          eventDetails
        )}`
      });

      return res.status(Status.HTTP_201_CREATED).send(eventDetails);
    } else if (req.method === "GET") {
      const valid = getIsValidToken(req.headers);
      if (!valid) {
        return res.status(Status.HTTP_401_UNAUTHORIZED).send({
          message: "Please provide a valid access token."
        });
      }
      const buildStatusDetailsResponse = await getList(
        Number(process.env.LOGS_LIST_SIZE) || 5
      );
      if (buildStatusDetailsResponse) {
        return res.status(Status.HTTP_200_OK).send(buildStatusDetailsResponse);
      }
    }
  } catch (err: any) {
    logger.error({ message: (err as Error).message });

    return res.status(Status.HTTP_500_INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong, try again later."
    });
  }
};
