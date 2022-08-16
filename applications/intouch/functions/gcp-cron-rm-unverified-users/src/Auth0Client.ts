import logger from "@bmi-digital/functions-logger";
import fetch, {
  FetchError,
  RequestInfo,
  RequestInit,
  Response
} from "node-fetch";

type fetchConfig = {
  url: RequestInfo;
} & RequestInit;

type SearchQuery = {
  q: string;
  per_page: number;
  include_totals: boolean;
  page: number;
};

class HTTPResponseError extends Error {
  response: Response;
  constructor(response: Response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
    this.message = response.statusText;
  }
}

export default class Auht0Client {
  private token = undefined;

  private errorLogger(error: HTTPResponseError | FetchError, message: string) {
    const responseMessage = error.message ? error.message : error;
    logger.error({ message: `${message} ${responseMessage}` });
  }

  private async getManagementToken() {
    const {
      AUTH0_MANAGEMENT_CLIENT_ID,
      AUTH0_ISSUER_BASE_URL,
      AUTH0_AUDIENCE,
      AUTH0_API_CLIENT_SECRET
    } = process.env;

    try {
      const response = await fetch(`${AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: AUTH0_MANAGEMENT_CLIENT_ID,
          client_secret: AUTH0_API_CLIENT_SECRET,
          audience: AUTH0_AUDIENCE
        })
      });

      if (!response.ok) {
        throw new HTTPResponseError(response);
      }

      return await response.json();
    } catch (error) {
      this.errorLogger(error as HTTPResponseError, "Error fetching token:");
      throw error;
    }
  }

  private async requestCall(config: fetchConfig): Promise<Response> {
    const { url, ...restConfig } = config;
    if (!this.token) {
      const { access_token: token } = await this.getManagementToken();
      this.token = token;
    }
    return await fetch(url, {
      ...restConfig,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...config.headers
      }
    });
  }

  async getUnverifiedUser(page = 0, perPage = 100) {
    const { AUTH0_ISSUER_BASE_URL } = process.env;
    const config: SearchQuery = {
      q: "email_verified:false",
      per_page: perPage,
      include_totals: true,
      page
    };
    const queryString = Object.keys(config)
      .map((key) => {
        const value = config[`${key}` as keyof typeof config];
        return `${key}=${value}`;
      })
      .join("&");
    try {
      const response = await this.requestCall({
        method: "GET",
        url: `${AUTH0_ISSUER_BASE_URL}/api/v2/users?${queryString}`
      });

      if (!response.ok) {
        throw new HTTPResponseError(response);
      }

      return await response.json();
    } catch (error) {
      this.errorLogger(error as FetchError, "Error fetching unverified users:");
      throw error;
    }
  }

  async deleteUser({ email }: { email: string }) {
    const { FRONTEND_BASE_URL } = process.env;
    const deleteUserCall = () =>
      fetch(`${FRONTEND_BASE_URL}/api/confirm-signup`, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          email
        })
      });
    try {
      const response = await deleteUserCall();
      if (!response.ok) {
        if (response.status === 429) {
          // if it reaches rate limit, then retry
          return await deleteUserCall();
        }
        throw new HTTPResponseError(response);
      }
      return "ok";
    } catch (error) {
      this.errorLogger(
        error as FetchError,
        `Error deleting user with ${email}:`
      );
      throw error;
    }
  }
}
