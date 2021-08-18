import { Buffer } from "buffer";
import { PostGraphileContext } from "../../types";

export const enum TOPICS {
  TRANSACTIONAL_EMAIL = "transactional-email",
  GUARANTEE_PDF = "guarantee-pdf"
}

export const publish = async (
  context: PostGraphileContext,
  topicName: TOPICS,
  payload: any
) => {
  const { pubSub } = context;
  const logger = context.logger("event:publisher");

  if (!topicName || !payload) {
    const errorMEssage =
      'Missing parameter(s); include "topic" and "message" properties in your request.';
    // eslint-disable-next-line no-console
    logger.error(errorMEssage);
    throw new Error(errorMEssage);
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
