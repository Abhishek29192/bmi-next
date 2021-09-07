import { URLSearchParams } from "url";
import fetch from "node-fetch";
import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { deleteFirestoreCollection } from "./reset/firestore";
import { deleteElasticSearchIndex } from "./reset/elasticSearch";

// Hack to please TS
type RequestRedirect = "error" | "follow" | "manual";

dotenv.config();

// TODO: NOPE HACK!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const {
  TRANSITIONAL_TOPIC_NAME,
  GCP_PROJECT_ID,
  PIM_CLIENT_ID,
  PIM_CLIENT_SECRET,
  PIM_HOST,
  PIM_CATALOG_NAME,
  SECRET_MAN_GCP_PROJECT_NAME
} = process.env;

const secretManagerClient = new SecretManagerServiceClient();

const pubSubClient = new PubSub({
  projectId: GCP_PROJECT_ID
});
const topicPublisher = pubSubClient.topic(TRANSITIONAL_TOPIC_NAME);

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

  var urlencoded = new URLSearchParams();
  urlencoded.append("client_id", PIM_CLIENT_ID);
  urlencoded.append("client_secret", pimClientSecret);
  urlencoded.append("grant_type", "client_credentials");

  const redirect: RequestRedirect = "follow";

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: urlencoded,
    redirect
  };

  const response = await fetch(
    `${PIM_HOST}/authorizationserver/oauth/token`,
    requestOptions
  );

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error("ERROR!", response.status, response.statusText);
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
};

const fetchData = async (path = "/") => {
  const { access_token } = await getAuthToken();

  const redirect: RequestRedirect = "follow";

  var options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    redirect
  };

  const fullPath = `${PIM_HOST}/bmiwebservices/v2/${PIM_CATALOG_NAME}${path}`;

  // eslint-disable-next-line no-console
  console.log(`FETCH: ${fullPath}`);
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error("ERROR!", response.status, response.statusText);
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
      `/export/products?currentPage=${currentPage}&status=APPROVED`
    );

    // eslint-disable-next-line no-console
    console.log(
      "Products Message page:",
      JSON.stringify({
        currentPage: messageResponse.currentPage,
        productsCount: (messageResponse.products || []).length,
        // products: messageResponse.products,
        totalPageCount: messageResponse.totalPageCount,
        totalProductCount: messageResponse.totalProductCount
      })
    );

    yield { products: messageResponse.products, currentPage };

    ++currentPage;
    totalPageCount = messageResponse.totalPageCount;
  }
}

async function* getSystems() {
  let totalPageCount = 1;
  let currentPage = 0;

  while (currentPage < totalPageCount) {
    const messageResponse = await fetchData(
      `/export/systems?currentPage=${currentPage}&approvalStatus=APPROVED`
    );

    // eslint-disable-next-line no-console
    console.log(
      "Systems Message page:",
      JSON.stringify({
        currentPage: messageResponse.currentPage,
        systemsCount: (messageResponse.systems || []).length,
        totalPageCount: messageResponse.totalPageCount,
        totalProductCount: messageResponse.totalProductCount
      })
    );

    yield { systems: messageResponse.systems, currentPage };

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

    // eslint-disable-next-line no-console
    console.log("Clearing out data...");

    await deleteElasticSearchIndex();
    await deleteFirestoreCollection();

    // eslint-disable-next-line no-console
    console.log(`Getting the whole catalogue.`);

    const messagePages = getProducts();
    for await (const page of messagePages) {
      if (page.products) {
        // eslint-disable-next-line no-console
        console.log(
          `GET: Updating ${(page.products || []).length} products in page ${
            page.currentPage
          }`
        );

        try {
          publishMessage("UPDATED", "PRODUCTS", page.products);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          break;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Getting the whole systems.`);

    const systemMessagePages = getSystems();
    for await (const page of systemMessagePages) {
      if (page.systems) {
        // eslint-disable-next-line no-console
        console.log(
          `GET: Updating ${(page.systems || []).length} systems in page ${
            page.currentPage
          }`
        );

        try {
          publishMessage("UPDATED", "SYSTEM", page.systems);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          break;
        }
      }
    }

    // NOTE: Not awaiting this trigger
    fetch(
      "https://europe-west3-dxb-development.cloudfunctions.net/pimtodxb-buildtrigger-dev-euwest3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ foo: "bar" })
      }
    );

    res.status(200).send("ok");
  } else {
    // eslint-disable-next-line no-console
    console.log("no data received.");
    res.status(404).send("not-ok");
  }
};

// NOTE: GCP likes the export this way 🤷‍♂️
export { handleRequest };
