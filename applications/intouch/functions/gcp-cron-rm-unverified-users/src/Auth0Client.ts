import axios, { AxiosError } from "axios";
import "dotenv/config";
import { getSecret } from "./utils/secrets";

export default class Auht0Client {
  private token = undefined;

  private errorLogger(error: AxiosError, message: string) {
    const responseMessage = error.response
      ? error.response.data.message
      : error.message;
    // console.debug(error.response?.data?.message);
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

  async getUnverifiedUser() {
    const { AUTH0_ISSUER_BASE_URL } = process.env;
    try {
      const { data } = await this.requestCall({
        method: "GET",
        url: `${AUTH0_ISSUER_BASE_URL}/api/v2/users?q=email_verified:false`
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
      this.errorLogger(error, `Error deleting user with ${email}:`);
      throw error;
    }
  }
}
