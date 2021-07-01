import axios from "axios";

const {
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD,
  USER_CERTIFICATION_REPORT_ID
} = process.env;

export default class DoceboClient {
  private async getTokenByUserInfo() {
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
  }

  async getCertificationsReport() {
    const { access_token } = await this.getTokenByUserInfo();
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
  }
}