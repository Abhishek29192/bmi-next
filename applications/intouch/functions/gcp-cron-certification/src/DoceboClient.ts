import { getSecret } from "@bmi-digital/functions-secret-client";
import logger from "@bmi-digital/functions-logger";
import fetch from "node-fetch";
import { APIReportRecord } from "./__tests__/helper";

export default class DoceboClient {
  private async getTokenByUserInfo() {
    const { DOCEBO_API_URL } = process.env;

    const DOCEBO_API_CLIENT_ID = await getSecret("DOCEBO_API_CLIENT_ID");
    const DOCEBO_API_CLIENT_SECRET = await getSecret(
      "DOCEBO_API_CLIENT_SECRET"
    );
    const DOCEBO_API_USERNAME = await getSecret("DOCEBO_API_USERNAME");
    const DOCEBO_API_PASSWORD = await getSecret("DOCEBO_API_PASSWORD");

    const body = JSON.stringify({
      grant_type: "password",
      client_id: DOCEBO_API_CLIENT_ID,
      client_secret: DOCEBO_API_CLIENT_SECRET,
      username: DOCEBO_API_USERNAME,
      password: DOCEBO_API_PASSWORD
    });
    const response = await fetch(`${DOCEBO_API_URL}/oauth2/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body
    });
    return await response.json();
  }

  async getCertificationsReport() {
    const {
      USER_CERTIFICATION_REPORT_ID,
      DOCEBO_API_URL,
      DOCEBO_API_MAX_RECORD_LIMIT
    } = process.env;
    const { access_token } = await this.getTokenByUserInfo();
    const request = {
      method: "GET",
      headers: {
        authorization: `Bearer ${access_token}`
      }
    };
    const response = await fetch(
      `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/count`,
      request
    );
    if (response.ok) {
      const {
        data: { count }
      } = await response.json();
      const doceboMaxRecord = parseInt(DOCEBO_API_MAX_RECORD_LIMIT || "500");
      const results = await Promise.allSettled(
        new Array(Math.ceil(count / doceboMaxRecord)).fill("").map((_, id) => {
          return fetch(
            `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${
              doceboMaxRecord * id
            }`,
            request
          );
        })
      );
      const certificates = await results.reduce(
        async (prev: Promise<APIReportRecord[] | []>, cur) => {
          let certs: APIReportRecord[] = [];
          if (cur.status === "fulfilled") {
            const { value } = cur;
            if (value.ok) {
              const {
                data: { rows }
              } = await value.json();
              certs = [...rows];
            } else {
              logger.error({
                message: `failed to fetched certificates from the report with id ${USER_CERTIFICATION_REPORT_ID}, ${value.status} ${value.statusText}}`
              });
            }
          }
          const prevValue = await prev;

          return Promise.resolve([...prevValue, ...certs]);
        },
        Promise.resolve([])
      );

      if (certificates.length) {
        logger.info({
          message: `successfully fetched ${certificates.length} certificates from the report with id ${USER_CERTIFICATION_REPORT_ID}`
        });

        return certificates.map((item) => ({
          userId: item["user.idUser"],
          title: item["certification.title"],
          code: item["certification.code"],
          expiration: item["certification.expiration"],
          to_renew_in: item["enrollment.to_renew_in"]
        }));
      }
    }

    logger.error({
      message: `${response.status} ${response.statusText}`
    });
    return [];
  }
}
