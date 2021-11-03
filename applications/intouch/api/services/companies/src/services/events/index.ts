import { Buffer } from "buffer";
import { PostGraphileContext } from "../../types";

export const enum TOPICS {
  TRANSACTIONAL_EMAIL = "TOPIC_TRANSACTIONAL_EMAIL",
  GUARANTEE_PDF = "TOPIC_GUARANTEE_PDF"
}

export const publish = async (
  context: PostGraphileContext,
  topicKey: TOPICS,
  payload: any
) => {
  const { pubSub } = context;
  const logger = context.logger("event:publisher");

  if (!topicKey || !payload) {
    const errorMEssage =
      'Missing parameter(s); include "topic" and "message" properties in your request.';
    logger.error(errorMEssage);
    throw new Error(errorMEssage);
  }

  const topicName = process.env[`${topicKey}`];

  if (!topicName) {
    const errorMessage = `Missing '${topicKey}' environment variable.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const data = Buffer.from(JSON.stringify(payload), "utf8");
    const result = await pubSub.topic(topicName).publish(data);
    logger.info(
      `Event with topic: ${topicName} pusblished by user: ${context.user.id}`
    );
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.error(
      `Error pusblishing an event in pubSub with topic: ${topicName}`,
      error
    );
  }
};
