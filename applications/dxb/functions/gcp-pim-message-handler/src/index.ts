import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch from "node-fetch";
import { PubSub, Topic } from "@google-cloud/pubsub";
import { getProducts, getSystems } from "./pim";
import { itemType as ItemType, messageType as MessageType } from "./types";

const { TRANSITIONAL_TOPIC_NAME, GCP_PROJECT_ID, BUILD_TRIGGER_ENDPOINT } =
  process.env;

// @ts-ignore TODO: NOPE HACK!
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
let topicPublisher: Topic;
const getTopicPublisher = () => {
  if (!topicPublisher) {
    topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME!);
  }
  return topicPublisher;
};

const publishMessage = async (
  type: MessageType,
  itemType: ItemType,
  items: any[]
) => {
  const messageBuffer = Buffer.from(JSON.stringify({ type, itemType, items }));

  try {
    const messageId = await getTopicPublisher().publish(messageBuffer);
    // eslint-disable-next-line no-console
    console.log(`PUB SUB MESSAGE PUBLISHED: ${messageId}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

function getItemsFromMessageGenerator(
  itemType: string
): (
  messageId: string,
  messageData: any
) => AsyncGenerator<{ items: any }, void, unknown> {
  if (itemType === "PRODUCTS") {
    return getProductsFromMessage;
  } else {
    return getSystemsFromMessage;
  }
}

async function* getProductsFromMessage(messageId: string, messageData: any) {
  // TODO: type could stay outside of this function
  const { token, type, itemType } = messageData;

  // TODO: IS this somehow being kept in scope?!??!??!??!
  let totalPageCount = 1;
  let currentPage = 0;

  while (currentPage < totalPageCount) {
    const messageResponse = await getProducts(messageId, token, currentPage);

    // eslint-disable-next-line no-console
    console.log(
      "Message page:",
      JSON.stringify({
        currentPage: messageResponse.currentPage,
        productsCount: (messageResponse.products || []).length,
        // products: messageResponse.products,
        totalPageCount: messageResponse.totalPageCount,
        totalProductCount: messageResponse.totalProductCount
      })
    );
    // eslint-disable-next-line no-console
    console.log(
      `[${type}][${itemType}]: [${(messageResponse.products || [])
        .map(({ code }: any) => code)
        .join(", ")}]`
    );

    yield { items: messageResponse.products };

    ++currentPage;
    totalPageCount = messageResponse.totalPageCount;
  }
}

async function* getSystemsFromMessage(messageId: string, messageData: any) {
  // TODO: type could stay outside of this function
  const { token, type, itemType } = messageData;

  // TODO: IS this somehow being kept in scope?!??!??!??!
  let totalPageCount = 1;
  let currentPage = 0;

  while (currentPage < totalPageCount) {
    const messageResponse = await getSystems(messageId, token, currentPage);

    // eslint-disable-next-line no-console
    console.log(
      "Message page:",
      JSON.stringify({
        currentPage: messageResponse.currentPage,
        systemsCount: (messageResponse.systems || []).length,
        // products: messageResponse.products,
        totalPageCount: messageResponse.totalPageCount,
        totalSystemCount: messageResponse.totalSystemsCount
      })
    );
    // eslint-disable-next-line no-console
    console.log(
      `[${type}][${itemType}]: [${(messageResponse.systems || [])
        .map(({ code }) => code)
        .join(", ")}]`
    );

    yield { items: messageResponse.systems };

    ++currentPage;
    totalPageCount = messageResponse.totalPageCount;
  }
}

export const handleRequest: HttpFunction = async (req, res) => {
  if (!BUILD_TRIGGER_ENDPOINT) {
    // eslint-disable-next-line no-console
    console.error("BUILD_TRIGGER_ENDPOINT has not been set.");
    return res.sendStatus(500);
  }

  if (!TRANSITIONAL_TOPIC_NAME) {
    // eslint-disable-next-line no-console
    console.error("TRANSITIONAL_TOPIC_NAME has not been set.");
    return res.sendStatus(500);
  }

  if (!req.body) {
    // eslint-disable-next-line no-console
    console.log("No data received");
    res.status(404).send("not-ok");
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`Received: ${JSON.stringify(req.body, null, 2)}`);

  const { message } = req.body;

  const messageData = JSON.parse(
    Buffer.from(message.data, "base64").toString("ascii")
  );

  // eslint-disable-next-line no-console
  console.log("Message data:", message.messageId, messageData);

  try {
    const { type, itemType } = messageData;

    if (!["PRODUCTS", "SYSTEMS"].includes(itemType)) {
      throw new Error(`[PIM] Unrecognised itemType [${itemType}]`);
    }

    if (!["UPDATED", "DELETED"].includes(type)) {
      throw new Error(`[PIM] Undercognised message type [${type}]`);
    }

    const messagePages = getItemsFromMessageGenerator(itemType)(
      message.messageId,
      messageData
    );

    // Awaiting each message being published per page so logs are intelligible
    // Could Promise.all possibly if performance becomes an issue
    for await (const page of messagePages) {
      if (page.items) {
        await publishMessage(type, itemType, page.items);
      }
    }

    // Constants for setting up metadata server request
    // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
    const tokenUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${BUILD_TRIGGER_ENDPOINT}`;

    // fetch the auth token
    const tokenResponse = await fetch(tokenUrl, {
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    const token = await tokenResponse.text();

    // call netlify build trigger function - fire and forget
    // Provide the token in the request to the receiving function
    fetch(BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ data: "filler data" })
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(200).send("ok");
};
