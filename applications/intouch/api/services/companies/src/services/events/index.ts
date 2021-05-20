import { Buffer } from "buffer";
import { PubSub } from "@google-cloud/pubsub";

export const enum TOPICS {
  TRANSACTIONAL_EMAIL = "transactional-email",
  GUARANTEE_PDF = "guarantee-pdf"
}

export const publish = async (
  pubSub: PubSub,
  topicName: TOPICS,
  payload: any
) => {
  if (!topicName || !payload) {
    const errorMEssage =
      'Missing parameter(s); include "topic" and "message" properties in your request.';
    // eslint-disable-next-line no-console
    console.error(errorMEssage);
    throw new Error(errorMEssage);
  }

  try {
    const data = Buffer.from(JSON.stringify(payload), "utf8");
    return pubSub.topic(topicName).publish(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Error pusblishing an event in pubSub with topic: ${topicName}`,
      error
    );
  }
};
