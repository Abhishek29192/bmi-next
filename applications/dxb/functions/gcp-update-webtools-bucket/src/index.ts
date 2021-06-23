/* eslint-disable no-console */
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { Storage } from "@google-cloud/storage";
import fetch from "node-fetch";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import {
  transformGutterHookProduct,
  transformGutteringProduct,
  transformMainTileProduct,
  transformUnderlayProduct
} from "./transform";
import {
  GET_MAIN_TILES_QUERY,
  getMainTileQuery,
  GET_GUTTERING_RELATED_PRODUCT_QUERY,
  GET_UNDERLAYS_QUERY
} from "./queries";

const {
  WEBTOOLS_UPDATE_REQUEST_SECRET,
  WEBTOOLS_CONTENTFUL_TOKEN_SECRET,
  SECRET_MAN_GCP_PROJECT_NAME,
  WEBTOOLS_CALCULATOR_BUCKET,
  WEBTOOLS_CONTENTFUL_SPACE,
  WEBTOOLS_CONTENTFUL_ENVIRONMENT
} = process.env;

let contentfulToken;

const secretManagerClient = new SecretManagerServiceClient();

const getAuthToken = async () => {
  const contentfulSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${WEBTOOLS_CONTENTFUL_TOKEN_SECRET}/versions/latest`
  });

  return contentfulSecret[0].payload.data.toString();
};

const getRequestSecret = async () => {
  const requestSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${WEBTOOLS_UPDATE_REQUEST_SECRET}/versions/latest`
  });

  return requestSecret[0].payload.data.toString();
};

const fetchData = async (body: object, remainingRetries = 5) => {
  if (!contentfulToken) {
    contentfulToken = await getAuthToken();
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${contentfulToken}`
    },
    body: JSON.stringify(body)
  };

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${WEBTOOLS_CONTENTFUL_SPACE}/environments/${WEBTOOLS_CONTENTFUL_ENVIRONMENT}`,
    requestOptions
  );

  if (response.status === 429 && remainingRetries) {
    return new Promise((resolve) =>
      setTimeout(
        () => fetchData(body, remainingRetries - 1).then(resolve),
        1000
      )
    );
  }

  // Errors other than 429
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error("ERROR!", response.status, response.statusText);
    throw new Error(response.statusText);
  }

  const data = await response.json();

  return data;
};

const getMainTileProducts = async () => {
  const mainTiles = [];

  const productsResponse = await fetchData({
    query: GET_MAIN_TILES_QUERY
  });

  const products = productsResponse.data.mainTileCollection.items;

  for (const {
    code,
    sys: { id }
  } of products) {
    const {
      data: { mainTile: product }
    } = await fetchData({
      query: getMainTileQuery(id)
    });

    try {
      mainTiles.push(transformMainTileProduct(product));
    } catch (error) {
      console.warn(
        `Failed to transform ${code}, skipping for this build.`,
        error.message
      );
    }
  }

  return mainTiles;
};

const getGutteringRelatedProducts = async () => {
  const productsResponse = await fetchData({
    query: GET_GUTTERING_RELATED_PRODUCT_QUERY
  });

  const {
    data: { gutterCollection, gutterHookCollection }
  } = productsResponse;

  const gutters = [];
  for (const product of gutterCollection.items) {
    try {
      gutters.push(transformGutteringProduct(product));
    } catch (error) {
      console.warn(
        `Failed to transform ${product["code"]}, skipping for this build.`,
        error.message
      );
    }
  }

  const gutterHooks = [];
  for (const product of gutterHookCollection.items) {
    try {
      gutterHooks.push(transformGutterHookProduct(product));
    } catch (error) {
      console.warn(
        `Failed to transform ${product["code"]}, skipping for this build.`,
        error.message
      );
    }
  }

  return {
    gutters,
    gutterHooks
  };
};

const getUnderlayProducts = async () => {
  const productsResponse = await fetchData({
    query: GET_UNDERLAYS_QUERY
  });

  const {
    data: { underlayCollection }
  } = productsResponse;

  const underlays = [];
  for (const product of underlayCollection.items) {
    try {
      underlays.push(transformUnderlayProduct(product));
    } catch (error) {
      console.warn(
        `Failed to transform ${product["code"]}, skipping for this build.`,
        error.message
      );
    }
  }

  return underlays;
};

const storage = new Storage();
const bucket = storage.bucket(WEBTOOLS_CALCULATOR_BUCKET);

let requestSecret;

const handleRequest: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
    res.set("Access-Control-Max-Age", "3600");

    return res.status(204).send("");
  }

  if (!requestSecret) {
    requestSecret = await getRequestSecret();
  }
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ") ||
    req.headers.authorization.substr("Bearer ".length) !== requestSecret
  ) {
    console.log("Failed authorization");
    return res.status(401).send("Unauthorized");
  }

  console.log("Fetching new data");

  try {
    const mainTiles = await getMainTileProducts();
    const { gutters, gutterHooks } = await getGutteringRelatedProducts();
    const underlays = await getUnderlayProducts();

    const results = JSON.stringify({
      mainTiles,
      gutters,
      gutterHooks,
      underlays
    });

    console.log("Saving file");

    const file = bucket.file("data.json");
    await file.save(results, {
      public: true
    });

    res.status(200).send("ok");
    console.log("Succeeded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    console.log("Failed");
  }
};

export { handleRequest };
