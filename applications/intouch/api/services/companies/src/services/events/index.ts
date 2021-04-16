import { Buffer } from "buffer";
import { PubSub } from "@google-cloud/pubsub";

export const TOPICS = {
  TRANSACTIONAL_EMAIL: "transactional-email"
};

export const publish = async (
  pubSub: PubSub,
  topicName: string,
  payload: any
) => {
  if (!topicName || !payload) {
    throw new Error(
      'Missing parameter(s); include "topic" and "message" properties in your request.'
    );
  }

  const topic = pubSub.topic(topicName);

  const messageBuffer = Buffer.from(
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

  await topic.publish(messageBuffer);
};
