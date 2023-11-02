import { getFirestore } from "@bmi/functions-firestore";
import logger from "@bmi-digital/functions-logger";
import { BuildLog } from "@bmi/firestore-types";
import type { HttpFunction } from "@google-cloud/functions-framework";

const firestore = getFirestore();
// By default will return only last 3 build events
const DEFAULT_LIMIT = 3;

export const getGatsbyBuildEvents: HttpFunction = async (req, res) => {
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

  try {
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", ["Content-Type"]);
      res.set("Access-Control-Max-Age", "3600");

      return res.sendStatus(204);
    }

    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const buildEvents = await getBuildEvents(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/production`,
      limit
    );
    const previewEvents = await getBuildEvents(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/root/preview`,
      limit
    );

    logger.info({
      message: `Build/preview events: ${JSON.stringify({
        buildEvents,
        previewEvents
      })}`
    });
    return res.status(200).send({ buildEvents, previewEvents });
  } catch (err) {
    logger.error({ message: (err as Error).message });

    return res.status(500).send({
      message: "Something went wrong, try again later."
    });
  }
};

const getBuildEvents = async (
  collectionId: string,
  mostRecentX: number
): Promise<BuildLog[]> => {
  const result = await firestore
    .collection(collectionId)
    .orderBy("timestamp", "desc")
    .limit(mostRecentX)
    .get();

  return result.docs.map((doc) => doc.data()) as BuildLog[];
};
