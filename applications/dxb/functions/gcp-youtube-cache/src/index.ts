import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Status } from "simple-http-status";
import { config } from "./config";
import { getById, getYoutubeDetails, saveById } from "./db";

const getIsValidToken = (headers) => {
  const auth = headers.authorization || headers.Authorization;
  return Boolean(auth && auth === `Bearer ${config.SECURITY_KEY}`);
};

export const youtubeCache: HttpFunction = async (req, res) => {
  try {
    const valid = getIsValidToken(req.headers);

    if (!valid) {
      return res.status(Status.HTTP_401_UNAUTHORIZED).json({
        message: "Please provide a valid access token."
      });
    }

    const youtubeId = req.query.youtubeId as string;
    if (!youtubeId) {
      return res.status(Status.HTTP_400_BAD_REQUEST).json({
        message: "youtubeId query param is required."
      });
    }

    const cachedYoutubeDetails = await getById(youtubeId);

    if (cachedYoutubeDetails) {
      return res.status(Status.HTTP_200_OK).json(cachedYoutubeDetails);
    }

    const youtubeDetails = await getYoutubeDetails(youtubeId);

    if (youtubeDetails.items.length === 0) {
      return res.status(Status.HTTP_404_NOT_FOUND).json({
        message: `Youtube video with id: "${youtubeId}" not found.`
      });
    }
    await saveById(youtubeId, youtubeDetails);

    return res.status(Status.HTTP_201_CREATED).json(youtubeDetails);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    return res.status(Status.HTTP_500_INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong, try again later."
    });
  }
};
