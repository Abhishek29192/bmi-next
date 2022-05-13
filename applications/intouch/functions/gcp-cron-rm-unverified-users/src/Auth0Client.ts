import axios, { AxiosError } from "axios";
import "dotenv/config";
import { getSecret } from "./utils/secrets";

export default class Auht0Client {
  private token = undefined;

  private errorLogger(error: AxiosError, message: string) {
    const responseMessage = error.response
      ? error.response.data.message
        ? error.response.data.message
        : error.response.data.error
      : error.message
      ? error.message
      : error;
    console.log(message, responseMessage);
  }

  private async getManagementToken() {
    const {
      GCP_SECRET_PROJECT,
      AUTH0_MANAGEMENT_CLIENT_ID,
      AUTH0_ISSUER_BASE_URL,
      AUTH0_AUDIENCE
    } = process.env;

    try {
      const clientSecret = await getSecret(
        GCP_SECRET_PROJECT,
        "AUTH0_API_CLIENT_SECRET"
      );
      const { data } = await axios({
        method: "POST",
        url: `${AUTH0_ISSUER_BASE_URL}/oauth/token`,
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "client_credentials",
          client_id: AUTH0_MANAGEMENT_CLIENT_ID,
          client_secret: clientSecret,
          audience: AUTH0_AUDIENCE
        }
      });
      return data;
    } catch (error) {
      this.errorLogger(error, "Error fetching token:");
      throw error;
    }
  }

  private async requestCall(config) {
    if (!this.token) {
      const { access_token: token } = await this.getManagementToken();
      this.token = token;
    }
    return await axios({
      ...config,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...config.headers
      }
    });
  }

  async getUnverifiedUser(page = 0, perPage = 100) {
    const { AUTH0_ISSUER_BASE_URL } = process.env;
    const config = {
      q: "email_verified:false",
      per_page: perPage,
      include_totals: true,
      page
    };
    const queryString = Object.keys(config)
      .map((key) => {
        const value = config[`${key}`];
        return `${key}=${value}`;
      })
      .join("&");
    try {
      const { data } = await this.requestCall({
        method: "GET",
        url: `${AUTH0_ISSUER_BASE_URL}/api/v2/users?${queryString}`
      });
      return data;
    } catch (error) {
      this.errorLogger(error, "Error fetching unverified users:");
      throw error;
    }
  }

  async deleteUser({ id, email }: { id: string; email: string }) {
    const { AUTH0_ISSUER_BASE_URL } = process.env;
    try {
      return await this.requestCall({
        method: "DELETE",
        url: `${AUTH0_ISSUER_BASE_URL}/api/v2/users/${id}`
      });
    } catch (error) {
      // if it reaches rate limit, reset token and retry
      if (error.data?.statusCode === 429) {
        this.token = undefined;

        return await this.requestCall({
          method: "DELETE",
          url: `${AUTH0_ISSUER_BASE_URL}/api/v2/users/${id}`
        });
      } else {
        this.errorLogger(error, `Error deleting user with ${email}:`);
        throw error;
      }
    }
  }
}
