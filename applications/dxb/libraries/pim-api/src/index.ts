import { URLSearchParams } from "url";
import logger from "@bmi-digital/functions-logger";
import {
  AuthResponse,
  CatalogVersion,
  ErrorResponse,
  PimTypes,
  Product,
  ProductsApiResponse,
  System,
  SystemsApiResponse
} from "@bmi/pim-types";
import fetch, { RequestRedirect, Response } from "node-fetch";

const {
  PIM_CLIENT_ID,
  PIM_OAUTH_CLIENT_SECRET,
  PIM_OAUTH_TOKEN_URL,
  PIM_CATALOG_API_URL
} = process.env;

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

  // All environment variables should be validated in the implementing function
  const response = await fetch(PIM_OAUTH_TOKEN_URL!, requestOptions);

  if (!response.ok) {
    logger.error({
      message: `[PIM] Error getting auth token: ${response.status} ${response.statusText}`
    });
    throw new Error(
      `[PIM] Error getting auth token: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as AuthResponse;
};

const handlePimResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 400) {
      const body = (await response.json()) as ErrorResponse;
      const errorMessage = [
        "[PIM] Error getting catalogue:",
        ...body.errors.map(({ type, message }) => `${type}: ${message}`)
      ].join("\n\n");
      logger.error({ message: errorMessage });
      throw new Error(errorMessage);
    }
    logger.error({
      message: `[PIM] Error getting data: ${response.status} ${response.statusText}`
    });
    throw new Error(
      `[PIM] Error getting data: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

export const fetchDataByCode = async (
  type: PimTypes,
  locale: string,
  code: string,
  version: CatalogVersion,
  allowPreviewProducts?: boolean
): Promise<Product | System> => {
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

  const itemStatus =
    type === PimTypes.Systems
      ? "?status=approved"
      : `?status=approved,discontinued${
          allowPreviewProducts ? ",preview" : ""
        }`;

  const fullPath = `${PIM_CATALOG_API_URL}/${type}/${code}${itemStatus}&version=${version}&lang=${locale}`;
  logger.info({ message: `FETCH: ${fullPath}` });

  const response = await fetch(fullPath, options);
  return handlePimResponse<Product | System>(response);
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

  const statusOfPimType =
    type === PimTypes.Systems
      ? `&status=approved`
      : `&status=approved,discontinued`;
  const fullPath = `${PIM_CATALOG_API_URL}/${type}?currentPage=${currentPage}${statusOfPimType}&lang=${locale}`;

  logger.info({ message: `FETCH: ${fullPath}` });
  const response = await fetch(fullPath, options);
  return handlePimResponse<ProductsApiResponse | SystemsApiResponse>(response);
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

  const fullPath = `${PIM_CATALOG_API_URL}/${type}?messageId=${messageId}&token=${token}&currentPage=${currentPage}&lang=${locale}`;

  logger.info({ message: `FETCH: ${fullPath}` });
  const response = await fetch(fullPath, options);
  return handlePimResponse<ProductsApiResponse | SystemsApiResponse>(response);
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
