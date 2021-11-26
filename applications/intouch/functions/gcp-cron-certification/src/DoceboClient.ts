import axios from "axios";
import { getSecret } from "./utils/secrets";

export default class DoceboClient {
  private async getTokenByUserInfo() {
    const { DOCEBO_API_URL, GCP_SECRET_PROJECT } = process.env;

    try {
      const DOCEBO_API_CLIENT_ID = await getSecret(
        GCP_SECRET_PROJECT,
        "DOCEBO_API_CLIENT_ID"
      );
      const DOCEBO_API_CLIENT_SECRET = await getSecret(
        GCP_SECRET_PROJECT,
        "DOCEBO_API_CLIENT_SECRET"
      );
      const DOCEBO_API_USERNAME = await getSecret(
        GCP_SECRET_PROJECT,
        "DOCEBO_API_USERNAME"
      );
      const DOCEBO_API_PASSWORD = await getSecret(
        GCP_SECRET_PROJECT,
        "DOCEBO_API_PASSWORD"
      );

      const { data } = await axios({
        method: "POST",
        url: `${DOCEBO_API_URL}/oauth2/token`,
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "password",
          client_id: DOCEBO_API_CLIENT_ID,
          client_secret: DOCEBO_API_CLIENT_SECRET,
          username: DOCEBO_API_USERNAME,
          password: DOCEBO_API_PASSWORD
        }
      });
      return data;
    } catch (error) {
      // eslint-disable-next-line
      console.log("Error fetching token:", error.message);
      throw error;
    }
  }

  async getCertificationsReport() {
    const { USER_CERTIFICATION_REPORT_ID, DOCEBO_API_URL } = process.env;

    const { access_token } = await this.getTokenByUserInfo();

    try {
      const {
        data: {
          data: { rows = [] }
        }
      } = await axios({
        method: "GET",
        url: `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data`,
        headers: {
          authorization: `Bearer ${access_token}`
        }
      });

      return rows.map((item) => ({
        userId: item["user.idUser"],
        title: item["certification.title"],
        code: item["certification.code"],
        expiration: item["certification.expiration"],
        to_renew_in: item["enrollment.to_renew_in"]
      }));
    } catch (error) {
      // eslint-disable-next-line
      console.log("Error getting the certifications: ", error.message);
      throw error;
    }
  }
}
