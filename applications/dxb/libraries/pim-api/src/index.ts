import { URLSearchParams } from "url";
import {
  AuthResponse,
  ErrorResponse,
  PimTypes,
  ProductsApiResponse,
  SystemsApiResponse
} from "@bmi/pim-types";
import fetch, { RequestRedirect } from "node-fetch";

const { PIM_CLIENT_ID, PIM_OAUTH_CLIENT_SECRET, PIM_HOST, PIM_CATALOG_NAME } =
  process.env;

// TODO: NOPE HACK!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const getAuthToken = async (): Promise<AuthResponse> => {
  if (!PIM_CLIENT_ID) {
    throw Error("PIM_CLIENT_ID has not been set.");
  }

  if (!PIM_OAUTH_CLIENT_SECRET) {
    throw Error("PIM_OAUTH_CLIENT_SECRET has not been set.");
  }

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", PIM_CLIENT_ID);
  urlencoded.append("client_secret", PIM_OAUTH_CLIENT_SECRET);
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

  return (await response.json()) as AuthResponse;
};

export const fetchData = async (
  type: PimTypes,
  locale: string,
  currentPage = 0
): Promise<ProductsApiResponse | SystemsApiResponse> => {
  const { access_token } = await getAuthToken();

  const redirect: RequestRedirect = "follow";

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    redirect
  };

  const fullPath = `${PIM_HOST}/bmiwebservices/v2/${PIM_CATALOG_NAME}/export/${type}?currentPage=${currentPage}&status=approved&lang=${locale}`;

  // eslint-disable-next-line no-console
  console.log(`FETCH: ${fullPath}`);
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    if (response.status === 400) {
      const body = (await response.json()) as ErrorResponse;
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

  return (await response.json()) as ProductsApiResponse | SystemsApiResponse;
};

const fetchDataByMessageId = async (
  type: PimTypes,
  messageId: string,
  token: string,
  currentPage: number,
  locale: string
): Promise<ProductsApiResponse | SystemsApiResponse> => {
  const { access_token } = await getAuthToken();

  const redirect: RequestRedirect = "follow";

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    redirect
  };

  const fullPath = `${PIM_HOST}/bmiwebservices/v2/${PIM_CATALOG_NAME}/export/${type}?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${locale}`;

  // eslint-disable-next-line no-console
  console.log(`FETCH: ${fullPath}`);
  const response = await fetch(fullPath, options);

  if (!response.ok) {
    if (response.status === 400) {
      const body = (await response.json()) as ErrorResponse;
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

  return (await response.json()) as ProductsApiResponse | SystemsApiResponse;
};

export const getProductsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number,
  locale: string
): Promise<ProductsApiResponse> =>
  fetchDataByMessageId(
    PimTypes.Products,
    messageId,
    token,
    currentPage,
    locale
  ) as Promise<ProductsApiResponse>;

export const getSystemsByMessageId = async (
  messageId: string,
  token: string,
  currentPage: number,
  locale: string
): Promise<SystemsApiResponse> =>
  fetchDataByMessageId(
    PimTypes.Systems,
    messageId,
    token,
    currentPage,
    locale
  ) as Promise<SystemsApiResponse>;
