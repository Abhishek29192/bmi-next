import { Buffer } from "buffer";
import { Readable, Duplex } from "stream";
import FormData from "form-data";
import { Logger } from "winston";
import axios from "axios";

class Auth0 {
  logger: Logger;
  accessToken: string;

  constructor(logger) {
    this.logger = logger("Auth0");
  }

  public static async init(logger) {
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
      this.logger.error("Error getting access_token:", error.message);
    }
  };

  getUsersByEmail = async (emailAddress) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `https://${
          process.env.AUTH0_API_DOMAIN
        }/api/v2/users-by-email?include_fields=true&fields=user_id,user_metadata,email_verified&email=${encodeURIComponent(
          emailAddress
        )}`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        }
      });

      return data;
    } catch (error) {
      this.logger.error("Get user by email:", error.message);
    }
  };

  getUserByEmail = async (emailAddress) => {
    const users = await this.getUsersByEmail(emailAddress);

    return users.length ? users[0] : null;
  };

  createUser = async (body) => {
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
      this.logger.error("Create user:", error.message);
    }
  };

  deleteUser = async (id) => {
    try {
      const { data } = await axios({
        method: "DELETE",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users/${id}`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        }
      });

      return data;
    } catch (error) {
      this.logger.error("Delete user:", error.message);
    }
  };

  updateUser = async (id, body) => {
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
      this.logger.error("Update user:", error.message);
    }
  };

  createResetPasswordTicket = async ({ user_id, result_url }) => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/tickets/password-change`,
        headers: {
          authorization: `Bearer ${this.accessToken}`
        },
        data: {
          user_id,
          result_url,
          mark_email_as_verified: true
        }
      });

      return data;
    } catch (error) {
      this.logger.error("Create reset password ticket:", error.message);
    }
  };

  changePassword = async (email: String) => {
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
      this.logger.error("Change password:", error.message);
    }
  };

  importUserFromJson = async (users) => {
    try {
      const formData = new FormData();
      formData.append("connection_id", "con_0Z9pDsN759ae5Z8U");
      const buffer = Buffer.from(JSON.stringify(users));
      formData.append("users", buffer, {
        filename: "users.json",
        contentType: "application/json"
      });

      const { data } = await axios.post(
        `https://${process.env.AUTH0_API_DOMAIN}/api/v2/jobs/users-imports`,
        formData,
        {
          headers: {
            authorization: `Bearer ${this.accessToken}`,
            ...formData.getHeaders()
          }
        }
      );

      return data;
    } catch (error) {
      this.logger.error("Change password:", error.message);
    }
  };
}

export default Auth0;
