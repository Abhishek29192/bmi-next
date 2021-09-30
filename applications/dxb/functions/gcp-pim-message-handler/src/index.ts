import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { config } from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV || "development"}`
});

const secretManagerClient = new SecretManagerServiceClient();
const {
  SECRET_MAN_GCP_PROJECT_NAME,
  PIM_CLIENT_SECRET,
  TRANSITIONAL_TOPIC_NAME,
  PIM_CLIENT_ID,
  PIM_HOST,
  PIM_CATALOG_NAME,
  GCP_PROJECT_ID,
  BUILD_TRIGGER_ENDPOINT
} = process.env;

// @ts-ignore TODO: NOPE HACK!
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

import fetch, { RequestInit, BodyInit } from "node-fetch";
import { PubSub } from "@google-cloud/pubsub";

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
const topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME);

const ENDPOINTS = {
  // NOTE: Not handling categories for now because DXB doesn't need this
  // CATEGORIES: "/export/categories",
  PRODUCTS: "/export/products",
  SYSTEMS: "/export/systems"
};

const base64ToAscii = (base64String: string) => {
  return Buffer.from(base64String, "base64").toString("ascii");
};

async function publishMessage(type, itemType, items) {
  const messageBuffer = Buffer.from(JSON.stringify({ type, itemType, items }));

  try {
    const messageId = await topicPublisher.publish(messageBuffer);
    // eslint-disable-next-line no-console
    console.log(`PUB SUB MESSAGE PUBLISHED: ${messageId}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

const getAuthToken = async () => {
  // get PIM secret from Secret Manager
  const pimSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${PIM_CLIENT_SECRET}/versions/latest`
  });
  const pimClientSecret = pimSecret[0].payload.data.toString();

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", PIM_CLIENT_ID);
  urlencoded.append("client_secret", pimClientSecret);
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: urlencoded as BodyInit,
    redirect: "follow"
  };

  const response = await fetch(
    `${PIM_HOST}/authorizationserver/oauth/token`,
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
  var options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    redirect: "follow"
  };

  const response = await fetch(
    `${PIM_HOST}/bmiwebservices/v2/${PIM_CATALOG_NAME}${path}`,
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

async function* getProductsFromMessage(
  endpoint: string,
  messageId: string,
  messageData
) {
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
        .map(({ code }) => code)
        .join(", ")}]`
    );

    yield { items: messageResponse.products };

    ++currentPage;
    totalPageCount = messageResponse.totalPageCount;
  }
}

export const handleRequest: HttpFunction = async (req, res) => {
  if (req.body) {
    // eslint-disable-next-line no-console
    console.log(`Received: ${JSON.stringify(req.body, null, 2)}`);

    const { message } = req.body;

    const messageData = JSON.parse(base64ToAscii(message.data));

    // Request data, which may then run over an async generator which
    // callback to push a message per page
    // eslint-disable-next-line no-console
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

      // Constants for setting up metadata server request
      // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
      const metadataServerURL =
        "http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=";
      const tokenUrl = metadataServerURL + BUILD_TRIGGER_ENDPOINT;

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
  } else {
    // eslint-disable-next-line no-console
    console.log("No data received");
    res.status(404).send("not-ok");
  }
};
