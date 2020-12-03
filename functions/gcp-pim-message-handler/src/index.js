"use strict";

require("dotenv").config();

// TODO: NOPE HACK!
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const fetch = require("node-fetch");
const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub({
  projectId: process.env.GCP_PROJECT_ID
});
const topicPublisher = pubSubClient.topic(process.env.TRANSITIONAL_TOPIC_NAME);

const ENDPOINTS = {
  CATEGORIES: "/export/categories",
  PRODUCTS: "/export/products"
};

const base64ToAscii = (base64String) => {
  return Buffer.from(base64String, "base64").toString("ascii");
};

async function publishMessage(type, itemType, items) {
  const messageBuffer = Buffer.from(JSON.stringify({ type, itemType, items }));

  try {
    const messageId = await topicPublisher.publish(messageBuffer);
    console.log(`PUB SUB MESSAGE PUBLISHED: ${messageId}`);
  } catch (err) {
    console.error(err);
  }
}

const getAuthToken = async () => {
  var urlencoded = new URLSearchParams();
  // TODO: move these into env vars
  urlencoded.append("client_id", process.env.PIM_CLIENT_ID);
  urlencoded.append("client_secret", process.env.PIM_CLIENT_SECRET);
  urlencoded.append("grant_type", "client_credentials");

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: urlencoded,
    redirect: "follow"
  };

  const response = await fetch(
    `${process.env.PIM_HOST}/authorizationserver/oauth/token`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error(
      `[PIM] Error getting auth token: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return data;
};

const fetchData = async (path = "/", accessToken) => {
  var options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    redirect: "follow"
  };

  const response = await fetch(
    `${process.env.PIM_HOST}/bmiwebservices/v2/norwayBmi${path}`,
    options
  );

  const body = await response.json();

  if (!response.ok) {
    const errorMessage = [
      "[PIM] Error fetching catalogue:",
      ...body.errors.map(({ type, message }) => `${type}: ${message}`)
    ].join("\n\n");

    throw new Error(errorMessage);
  }

  return body;
};

async function* getProductsFromMessage(endpoint, messageId, messageData) {
  // TODO: type could stay outside of this function
  const { token, type, itemType } = messageData;

  // TODO: IS this somehow being kept in scope?!??!??!??!
  let totalPageCount = 1;
  let currentPage = 0;

  // TODO: don't need to get a new token every time
  const { access_token } = await getAuthToken();

  while (currentPage < totalPageCount) {
    const messageResponse = await fetchData(
      `${endpoint}?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
      access_token
    );

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
    console.log(
      `[${type}][${itemType}]: [${(messageResponse.products || [])
        .map(({ code }) => code)
        .join(", ")}]`
    );

    yield { items: messageResponse.products };

    ++currentPage;
    totalPageCount = messageResponse.totalPageCount;
  }
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const handleRequest = async (req, res) => {
  if (req.body) {
    console.log(`Received: ${JSON.stringify(req.body, null, 2)}`);

    const { message } = req.body;

    const messageData = JSON.parse(base64ToAscii(message.data));

    // Request data, which may then run over an async generator which
    // callback to push a message per page
    console.log("Message data:", message.messageId, messageData);

    try {
      const { type, itemType } = messageData;
      const endpoint = ENDPOINTS[itemType];

      if (!endpoint) {
        throw new Error(`[PIM] Unrecognised itemType [${itemType}]`);
      }

      if (!["UPDATED", "DELETED"].includes(type)) {
        throw new Error(`[PIM] Undercognised message type [${type}]`);
      }

      const messagePages = getProductsFromMessage(
        endpoint,
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
    } catch (error) {
      console.error(error);
    }

    res.status(200).send("ok");
  } else {
    console.log("No data received");
    res.status(404).send("not-ok");
  }
};

// NOTE: GCP likes the export this way 🤷‍♂️
exports.handleRequest = handleRequest;
