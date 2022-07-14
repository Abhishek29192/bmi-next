import type { RequestInfo, RequestInit, Response } from "node-fetch";
import fetch from "node-fetch";
import { RetryOptions } from "./types";

/**
 *
 * @param url RequestInfo of the request
 * @param body RequestInit for the request
 * @param retryOptions options for customising the retry behaviour
 * @returns a resolved promise with the response or a rejection with the error that occured.
 */
const fetchRetry = async (
  url: RequestInfo,
  body?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> => {
  let numberOfRetries = 0;
  let response: Response;

  const errors = [];

  do {
    response = await fetch(url, body);

    if (response.ok) {
      return response;
    } else {
      errors.push(`${response.statusText} - ${await response.text()}`);
    }
    numberOfRetries++;
  } while (
    numberOfRetries < (retryOptions?.maxRetries || 5) &&
    (retryOptions?.retryableStatusCodes || [429]).find(
      (statusCode) => statusCode === response.status
    )
  );
  throw new Error(
    `Failed request for ${JSON.stringify(
      url
    )} after ${numberOfRetries} retries with the following errors: ${JSON.stringify(
      errors
    )}`
  );
};

export default fetchRetry;
