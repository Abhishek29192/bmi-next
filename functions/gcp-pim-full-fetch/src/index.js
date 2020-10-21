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
    console.log("ERROR!", response.status, response.statusText);
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
};

const fetchData = async (path = "/") => {
  const { access_token } = await getAuthToken();

  var options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    redirect: "follow"
  };

  const fullPath = `${process.env.PIM_HOST}/bmiwebservices/v2/norwayBmi${path}`;

  console.log(`FETCH: ${fullPath}`);
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    console.log("ERROR!", response.status, response.statusText);
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
};

async function* getProducts() {
  let totalPageCount = 1;
  let currentPage = 0;

  while (currentPage < totalPageCount) {
    const messageResponse = await fetchData(
      `/export/products?currentPage=${currentPage}`
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

    yield { products: messageResponse.products };

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
    // TODO: Delete entire firestore database, if flag passed in request

    console.log(`Getting the whole catalogue.`);

    const messagePages = getProducts();
    for await (const page of messagePages) {
      if (page.products) {
        console.log(`GET: Updating ${(page.products || []).length}`);

        try {
          publishMessage("UPDATED", "PRODUCTS", page.products);
        } catch (e) {
          console.log(e);
          break;
        }
      }
    }

    res.status(200).send("ok");
  } else {
    console.log("no data received.");
    res.status(404).send("not-ok");
  }
};

// NOTE: GCP likes the export this way 🤷‍♂️
exports.handleRequest = handleRequest;
