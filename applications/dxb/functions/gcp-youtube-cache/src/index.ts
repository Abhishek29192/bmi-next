import { IncomingHttpHeaders } from "http";
import logger from "@bmi-digital/functions-logger";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Status } from "simple-http-status";
import { getById, getYoutubeDetails, saveById } from "./db";

const getIsValidToken = async (headers: IncomingHttpHeaders) => {
  const auth = headers.authorization || headers.Authorization;
  return Boolean(auth && auth === `Bearer ${process.env.BEARER_TOKEN}`);
};

export const youtubeCache: HttpFunction = async (req, res) => {
  if (!process.env.FIRESTORE_ROOT_COLLECTION) {
    logger.error({ message: "FIRESTORE_ROOT_COLLECTION has not been set" });
    return res.sendStatus(500);
  }

  if (!process.env.BEARER_TOKEN) {
    logger.error({ message: "BEARER_TOKEN has not been set" });
    return res.sendStatus(500);
  }

  if (!process.env.GOOGLE_YOUTUBE_API_KEY) {
    logger.error({ message: "GOOGLE_YOUTUBE_API_KEY has not been set" });
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

    const youtubeId = req.query.youtubeId as string | undefined;
    if (!youtubeId) {
      logger.error({ message: "youtubeId query param is required." });
      return res.status(Status.HTTP_400_BAD_REQUEST).send({
        message: "youtubeId query param is required."
      });
    }

    const cachedYoutubeDetails = await getById(youtubeId);

    if (cachedYoutubeDetails) {
      return res.status(Status.HTTP_200_OK).send(cachedYoutubeDetails);
    }

    const youtubeDetails = await getYoutubeDetails(youtubeId);

    if (!youtubeDetails) {
      return res.status(Status.HTTP_404_NOT_FOUND).send({
        message: `Youtube video with id: "${youtubeId}" not found.`
      });
    }
    await saveById(youtubeId, youtubeDetails);

    return res.status(Status.HTTP_201_CREATED).send(youtubeDetails);
  } catch (error) {
    logger.error({ message: (error as Error).message });

    return res.status(Status.HTTP_500_INTERNAL_SERVER_ERROR).send({
      message: "Something went wrong, try again later."
    });
  }
};
