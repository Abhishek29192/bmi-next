/**
 * Duplicated getAuthToken and fetchData is based off the fetchData in gcp-full-fetch-coordinator and gcp-full-fetch-coordinator. We should keep these in sync until we get shared libraries working for GCP Functions.
 */
import { URLSearchParams } from "url";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import fetch, { RequestRedirect } from "node-fetch";

const {
  SECRET_MAN_GCP_PROJECT_NAME,
  PIM_CLIENT_SECRET,
  PIM_CLIENT_ID,
  PIM_HOST,
  PIM_CATALOG_NAME
} = process.env;

// TODO: NOPE HACK!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export enum PimTypes {
  Products = "products",
  Systems = "systems"
}

type CatalogVersion = "Online" | "Staged";

type ApiResponse = {
  catalog: string;
  currentPage: number;
  totalPageCount: number;
};

export type ProductsApiResponse = ApiResponse & {
  products: any[];
  version: CatalogVersion;
  totalProductCount: number;
};

export type SystemsApiResponse = ApiResponse & {
  systems: any[];
  totalSystemsCount: number;
};

type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  scope: "basic openid";
};

type ErrorResponse = {
  errors: [
    {
      type: string;
      message: string;
    }
  ];
};

const secretManagerClient = new SecretManagerServiceClient();

const getAuthToken = async (): Promise<AuthResponse> => {
  if (!PIM_CLIENT_ID) {
    throw Error("PIM_CLIENT_ID has not been set.");
  }

  if (!SECRET_MAN_GCP_PROJECT_NAME) {
    throw Error("SECRET_MAN_GCP_PROJECT_NAME has not been set.");
  }

  if (!PIM_CLIENT_SECRET) {
    throw Error("PIM_CLIENT_SECRET has not been set.");
  }

  // get PIM secret from Secret Manager
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used as part of an optional chain
  const pimSecret = await secretManagerClient.accessSecretVersion({
    name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${PIM_CLIENT_SECRET}/versions/latest`
  });

  const pimClientSecret = pimSecret[0].payload?.data?.toString();
  if (!pimClientSecret) {
    throw Error("pimClientSecret could not be retrieved.");
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
    console.error(
      `[PIM] Error getting auth token: ${response.status} ${response.statusText}`
    );
    throw new Error(
      `[PIM] Error getting auth token: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return data;
};

const fetchData = async (
  type: PimTypes,
  messageId: string,
  token: string,
  currentPage: number
): Promise<ProductsApiResponse | SystemsApiResponse> => {
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

  const fullPath = `${PIM_HOST}/bmiwebservices/v2/${PIM_CATALOG_NAME}/export/${type}?messageId=${messageId}&token=${token}&currentPage=${currentPage}`;

  // eslint-disable-next-line no-console
  console.log(`FETCH: ${fullPath}`);
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    if (response.status === 400) {
      const body: ErrorResponse = await response.json();
      const errorMessage = [
        "[PIM] Error getting catalogue:",
        ...body.errors.map(({ type, message }) => `${type}: ${message}`)
      ].join("\n\n");
      // eslint-disable-next-line no-console
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    // eslint-disable-next-line no-console
    console.error(
      `[PIM] Error getting data: ${response.status} ${response.statusText}`
    );
    throw new Error(
      `[PIM] Error getting data: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return data;
};

export const getProducts = async (
  messageId: string,
  token: string,
  currentPage: number
): Promise<ProductsApiResponse> =>
  fetchData(
    PimTypes.Products,
    messageId,
    token,
    currentPage
  ) as Promise<ProductsApiResponse>;

export const getSystems = async (
  messageId: string,
  token: string,
  currentPage: number
) =>
  fetchData(
    PimTypes.Systems,
    messageId,
    token,
    currentPage
  ) as Promise<SystemsApiResponse>;
