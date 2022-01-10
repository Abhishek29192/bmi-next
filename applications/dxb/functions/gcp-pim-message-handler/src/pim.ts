/**
 * Duplicated getAuthToken in gcp-full-fetch-coordinator and gcp-full-fetch-coordinator. We should keep these in sync until we get shared libraries working for GCP Functions.
 */
import { URLSearchParams } from "url";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import fetch, { RequestInit, RequestRedirect } from "node-fetch";

const secretManagerClient = new SecretManagerServiceClient();
const {
  SECRET_MAN_GCP_PROJECT_NAME,
  PIM_CLIENT_SECRET,
  PIM_CLIENT_ID,
  PIM_HOST,
  PIM_CATALOG_NAME
} = process.env;

const productsEndpoint = "/export/products";
const systemsEndpoint = "/export/systems";

const getAuthToken = async () => {
  if (!PIM_CLIENT_ID) {
    // eslint-disable-next-line no-console
    console.error("PIM_CLIENT_ID has not been set.");
    return undefined;
  }

  if (!SECRET_MAN_GCP_PROJECT_NAME) {
    // eslint-disable-next-line no-console
    console.error("PIM_CLIENT_ID has not been set.");
    return undefined;
  }

  if (!PIM_CLIENT_SECRET) {
    // eslint-disable-next-line no-console
    console.error("PIM_CLIENT_SECRET has not been set.");
    return undefined;
  }

  // get PIM secret from Secret Manager
  const pimSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${PIM_CLIENT_SECRET}/versions/latest`
  });

  const pimClientSecret = pimSecret?.[0]?.payload?.data?.toString();
  if (!pimClientSecret) {
    // eslint-disable-next-line no-console
    console.error("pimClientSecret could not be retrieved.");
    return undefined;
  }

  let urlencoded = new URLSearchParams();
  urlencoded.append("client_id", PIM_CLIENT_ID);
  urlencoded.append("client_secret", pimClientSecret);
  urlencoded.append("grant_type", "client_credentials");

  const redirect: RequestRedirect = "follow";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: urlencoded,
    redirect: redirect
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

const fetchData = async (path: string, accessToken: string) => {
  const options: RequestInit = {
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
      ...body.errors.map(
        ({ type, message }: { type: any; message: any }) =>
          `${type}: ${message}`
      )
    ].join("\n\n");

    throw new Error(errorMessage);
  }

  return body;
};

export const getProducts = async (
  messageId: string,
  token: string,
  currentPage: number
) => {
  // TODO: don't need to get a new token every time
  const { access_token } = await getAuthToken();
  return fetchData(
    `${productsEndpoint}?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
    access_token
  );
};

export const getSystems = async (
  messageId: string,
  token: string,
  currentPage: number
) => {
  // TODO: don't need to get a new token every time
  const { access_token } = await getAuthToken();
  return fetchData(
    `${systemsEndpoint}?messageId=${messageId}&token=${token}&currentPage=${currentPage}`,
    access_token
  );
};
