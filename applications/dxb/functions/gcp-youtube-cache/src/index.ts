import { IncomingHttpHeaders } from "http";
import logger from "@bmi/functions-logger";
import { getSecret } from "@bmi/functions-secret-client";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Status } from "simple-http-status";
import { getById, getYoutubeDetails, saveById } from "./db";

const getIsValidToken = async (headers: IncomingHttpHeaders) => {
  const auth = headers.authorization || headers.Authorization;
  return Boolean(
    auth && auth === `Bearer ${await getSecret("bearerTokenSecret")}`
  );
};

export const youtubeCache: HttpFunction = async (req, res) => {
  if (!process.env.FIRESTORE_ROOT_COLLECTION) {
    logger.error({ message: "FIRESTORE_ROOT_COLLECTION has not been set" });
    return res.sendStatus(500);
  }

  try {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", "application/json");

    const valid = await getIsValidToken(req.headers);

    if (!valid) {
      return res.status(Status.HTTP_401_UNAUTHORIZED).send({
        message: "Please provide a valid access token."
      });
    }

    const youtubeId = req.query.youtubeId as string;
    if (!youtubeId) {
      return res.status(Status.HTTP_400_BAD_REQUEST).send({
        message: "youtubeId query param is required."
      });
    }

    const cachedYoutubeDetails = await getById(youtubeId);

    if (cachedYoutubeDetails) {
      return res.status(Status.HTTP_200_OK).send(cachedYoutubeDetails);
    }

    const youtubeDetails = await getYoutubeDetails(youtubeId);

    if (!youtubeDetails.items || youtubeDetails.items.length === 0) {
      return res.status(Status.HTTP_404_NOT_FOUND).send({
        message: `Youtube video with id: "${youtubeId}" not found.`
      });
    }
    await saveById(youtubeId, youtubeDetails);

    return res.status(Status.HTTP_201_CREATED).send(youtubeDetails);
  } catch (err) {
    logger.error({ message: err.message });

    return res.status(Status.HTTP_500_INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong, try again later."
    });
  }
};
