import { PubSub } from "@google-cloud/pubsub";
import { Request, Response } from "express";
import { fetchData } from "./pim";
import { FullFetchRequest } from "./types";

const { TRANSITIONAL_TOPIC_NAME, GCP_PROJECT_ID } = process.env;

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
const topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME);

async function publishMessage(type, itemType, items) {
  // eslint-disable-next-line no-console
  console.log(`Publishing ${type} ${items.length} ${itemType}`);
  const messageBuffer = Buffer.from(JSON.stringify({ type, itemType, items }));

  const messageId = await topicPublisher.publish(messageBuffer);
  // eslint-disable-next-line no-console
  console.log(`Published: ${messageId}`);
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request<any, any, FullFetchRequest>} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest = async (
  req: Request<any, any, FullFetchRequest>,
  res: Response
) => {
  const body = req.body;

  if (!body) {
    res
      .status(400)
      .send({ error: "type, startPage and numberOfPages was not provided." });
    return;
  }
  if (!body.type) {
    res.status(400).send({ error: "type was not provided." });
    return;
  }
  if ((!body.startPage && body.startPage !== 0) || body.startPage < 0) {
    res.status(400).send({
      error: "startPage must be a number greater than or equal to 0."
    });
    return;
  }
  if (!body.numberOfPages || body.numberOfPages < 1) {
    res
      .status(400)
      .send({ error: "numberOfPages must be a number greater than 0." });
    return;
  }

  const promises = [];
  for (let i = body.startPage; i < body.startPage + body.numberOfPages; i++) {
    const response = await fetchData(body.type, i);

    const promise = publishMessage(
      "UPDATED",
      body.type.toUpperCase(),
      response[body.type]
    );
    promises.push(promise);
  }
  await Promise.all(promises);
  res.sendStatus(200);
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
