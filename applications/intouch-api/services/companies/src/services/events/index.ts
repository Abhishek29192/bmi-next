import { Buffer } from "buffer";
import { PubSub } from "@google-cloud/pubsub";

export const TOPICS = {
  TRANSACTIONAL_EMAIL: "transactional-email"
};

// Instantiates a client
const pubsub = new PubSub({
  projectId: process.env.GCP_PROJECT
});

export const publish = async (topicName: string, payload: any) => {
  if (!topicName || !payload) {
    throw new Error(
      'Missing parameter(s); include "topic" and "message" properties in your request.'
    );
  }

  const topic = pubsub.topic(topicName);

  const messageBuffer = Buffer.from(
    JSON.stringify({
      data: {
        message: payload.message,
        email: payload.email
      }
    }),
    "utf8"
  );

  // Publishes a message
  await topic.publish(messageBuffer);
};
