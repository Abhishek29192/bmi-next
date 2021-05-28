import { Logger } from "winston";
import axios from "axios";

export default class Auth0 {
  logger: Logger;
  accessToken: string;

  constructor(logger) {
    this.logger = logger;
  }

  static async init(logger) {
    const auth0 = new Auth0(logger);

    const { access_token } = await auth0.getAccessToken();

    auth0.accessToken = access_token;

    return auth0;
  }

  getAccessToken = async () => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_API_DOMAIN}/oauth/token`,
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_API_CLIENT_ID,
          client_secret: process.env.AUTH0_API_CLIENT_SECRET,
          audience: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/`
        }
      });

      return data;
    } catch (error) {
      this.logger.error(error.stack);
    }
  };

  async getUserByEmail(emailAddress) {
    try {
      const { data } = await axios({
        method: "GET",
        url: `https://${
          process.env.AUTH0_API_DOMAIN
        }/api/v2/users-by-email?fields=user_id&email=${encodeURIComponent(
          emailAddress
        )}`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        }
      });

      return data;
    } catch (error) {
      this.logger.error(error.stack);
    }
  }

  async createUser(body) {
    try {
      const { data } = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        },
        data: body
      });

      return data;
    } catch (error) {
      this.logger.error(error.stack);
    }
  }

  async updateUser(id, body) {
    try {
      const { data } = await axios({
        method: "PATCH",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users/${id}`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        },
        data: body
      });

      return data;
    } catch (error) {
      this.logger.error(error.stack);
    }
  }

  async createResetPasswordTicket(user_id: String) {
    try {
      const { data } = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/tickets/password-change`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        },
        data: {
          user_id
        }
      });

      return data;
    } catch (error) {
      console.log("error", error);
      this.logger.error(
        "Error creating reset password ticket: ",
        error.message
      );
    }
  }

  async changePassword(email: String) {
    try {
      const { data } = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_API_DOMAIN}/dbconnections/change_password`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        },
        data: {
          email,
          connection: "Username-Password-Authentication"
        }
      });

      return data;
    } catch (error) {
      console.log("error", error);
      this.logger.error(
        "Error creating reset password ticket: ",
        error.message
      );
    }
  }
}
