import { Buffer } from "buffer";
import { PubSub } from "@google-cloud/pubsub";

export const enum TOPICS {
  TRANSACTIONAL_EMAIL = "transactional-email",
  GUARANTEE_PDF = "guarantee-pdf"
}

const transactionalEmail = (payload: any) => {
  return Buffer.from(
    JSON.stringify({
      data: {
        title: payload.title,
        text: payload.text,
        html: payload.html,
        email: payload.email
      }
    }),
    "utf8"
  );
};
const guaranteePdf = (payload: any) => {
  return Buffer.from(JSON.stringify(payload), "utf8");
};

export const publish = async (
  pubSub: PubSub,
  topicName: TOPICS,
  payload: any
) => {
  if (!topicName || !payload) {
    throw new Error(
      'Missing parameter(s); include "topic" and "message" properties in your request.'
    );
  }
  const topic = pubSub.topic(topicName);

  let messageBuffer: Buffer;
  switch (topicName) {
    case TOPICS.TRANSACTIONAL_EMAIL:
      messageBuffer = transactionalEmail(payload);
      break;
    case TOPICS.GUARANTEE_PDF:
      messageBuffer = guaranteePdf(payload);
      break;
    default:
      throw new Error("Missing topicName");
  }
  return topic.publish(messageBuffer);
};
