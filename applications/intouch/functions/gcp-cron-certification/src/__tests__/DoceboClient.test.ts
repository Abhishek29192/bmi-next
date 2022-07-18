process.env.DOCEBO_API_URL = "DOCEBO_API_URL";
process.env.USER_CERTIFICATION_REPORT_ID = "1";
process.env.DOCEBO_API_MAX_RECORD_LIMIT = "1";
process.env.DOCEBO_API_CLIENT_ID = "DOCEBO_API_CLIENT_ID";
process.env.DOCEBO_API_CLIENT_SECRET = "DOCEBO_API_CLIENT_SECRET";
process.env.DOCEBO_API_USERNAME = "DOCEBO_API_USERNAME";
process.env.DOCEBO_API_PASSWORD = "DOCEBO_API_PASSWORD";

import { fetchSpy, loggerError, loggerInfo } from "../../__mocks__";
import DoceboClient from "../DoceboClient";
import {
  countApiReponseFactory,
  fetchResponseFactory,
  generateReportAPIRecordFactory,
  generateReportAPIResponseFactory,
  generateReportRecordFactory
} from "./helper";

describe("DoceboClient", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("getCertificationsReport", () => {
    const {
      DOCEBO_API_URL,
      USER_CERTIFICATION_REPORT_ID,
      DOCEBO_API_CLIENT_ID,
      DOCEBO_API_CLIENT_SECRET,
      DOCEBO_API_USERNAME,
      DOCEBO_API_PASSWORD
    } = process.env;

    it("normal case", async () => {
      const countResponse = countApiReponseFactory();
      const record = generateReportAPIRecordFactory();
      const reportReponse = generateReportAPIResponseFactory();
      const accessToken = "access_token";
      const tokenRequestBody = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          client_id: DOCEBO_API_CLIENT_ID,
          client_secret: DOCEBO_API_CLIENT_SECRET,
          username: DOCEBO_API_USERNAME,
          password: DOCEBO_API_PASSWORD
        })
      };
      const request = {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      };
      fetchSpy
        .mockReturnValueOnce(
          fetchResponseFactory({ response: { access_token: accessToken } })
        )
        .mockReturnValueOnce(fetchResponseFactory({ response: countResponse }))
        .mockReturnValueOnce(fetchResponseFactory({ response: reportReponse }));
      const certificates = await new DoceboClient().getCertificationsReport();

      expect(fetchSpy).toHaveBeenNthCalledWith(1, [
        `${DOCEBO_API_URL}/oauth2/token`,
        tokenRequestBody
      ]);
      expect(fetchSpy).toHaveBeenNthCalledWith(2, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/count`,
        request
      ]);
      expect(fetchSpy).toHaveBeenNthCalledWith(3, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${0}`,
        request
      ]);
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `successfully fetched ${countResponse.data.count} certificates from the report with id ${USER_CERTIFICATION_REPORT_ID}`
      });
      expect(certificates).toEqual([
        generateReportRecordFactory({
          userId: record["user.idUser"],
          title: record["certification.title"],
          code: record["certification.code"],
          toNewIn: record["enrollment.to_renew_in"]
        })
      ]);
    });

    it("multiple get record calls", async () => {
      const countResponse = countApiReponseFactory(2);
      const reportReponse = generateReportAPIResponseFactory();

      const accessToken = "access_token";
      const request = {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      };
      fetchSpy
        .mockReturnValueOnce(
          fetchResponseFactory({ response: { access_token: accessToken } })
        )
        .mockReturnValueOnce(fetchResponseFactory({ response: countResponse }))
        .mockReturnValueOnce(fetchResponseFactory({ response: reportReponse }))
        .mockReturnValueOnce(fetchResponseFactory({ response: reportReponse }));
      const certificates = await new DoceboClient().getCertificationsReport();

      expect(fetchSpy).toHaveBeenNthCalledWith(3, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${0}`,
        request
      ]);
      expect(fetchSpy).toHaveBeenNthCalledWith(4, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${1}`,
        request
      ]);
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `successfully fetched ${countResponse.data.count} certificates from the report with id ${USER_CERTIFICATION_REPORT_ID}`
      });
      expect(certificates.length).toBe(2);
    });

    it("failed to get token", async () => {
      const response = { ok: false, status: 400, statusText: "statusText" };
      fetchSpy
        .mockReturnValueOnce(fetchResponseFactory(response))
        .mockReturnValueOnce(fetchResponseFactory(response));
      const certificates = await new DoceboClient().getCertificationsReport();

      expect(loggerError).toHaveBeenCalledWith({
        message: `${response.status} ${response.statusText}`
      });
      expect(certificates).toEqual([]);
    });

    it("failed to get record count", async () => {
      const accessToken = "access_token";
      const response = { ok: false, status: 400, statusText: "statusText" };
      fetchSpy
        .mockReturnValueOnce(
          fetchResponseFactory({ response: { access_token: accessToken } })
        )
        .mockReturnValueOnce(fetchResponseFactory(response));
      const certificates = await new DoceboClient().getCertificationsReport();

      expect(loggerError).toHaveBeenCalledWith({
        message: `${response.status} ${response.statusText}`
      });
      expect(certificates).toEqual([]);
    });

    it("failed to get records", async () => {
      const accessToken = "access_token";
      const response = { ok: false, status: 400, statusText: "statusText" };
      fetchSpy
        .mockReturnValueOnce(
          fetchResponseFactory({ response: { access_token: accessToken } })
        )
        .mockReturnValueOnce(
          fetchResponseFactory({ response: countApiReponseFactory() })
        )
        .mockReturnValueOnce(fetchResponseFactory(response));
      const certificates = await new DoceboClient().getCertificationsReport();

      expect(loggerError).toHaveBeenCalledWith({
        message: `failed to fetched certificates from the report with id ${USER_CERTIFICATION_REPORT_ID}, ${response.status} ${response.statusText}}`
      });
      expect(certificates).toEqual([]);
    });

    it("DOCEBO_API_MAX_RECORD_LIMIT is not refined", async () => {
      delete process.env.DOCEBO_API_MAX_RECORD_LIMIT;
      const countResponse = countApiReponseFactory(600);
      const reportReponse = generateReportAPIResponseFactory();
      const accessToken = "access_token";
      const request = {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      };
      fetchSpy
        .mockReturnValueOnce(
          fetchResponseFactory({ response: { access_token: accessToken } })
        )
        .mockReturnValueOnce(fetchResponseFactory({ response: countResponse }))
        .mockReturnValueOnce(fetchResponseFactory({ response: reportReponse }))
        .mockReturnValueOnce(fetchResponseFactory({ response: reportReponse }));

      await new DoceboClient().getCertificationsReport();

      expect(fetchSpy).toHaveBeenNthCalledWith(3, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${0}`,
        request
      ]);
      expect(fetchSpy).toHaveBeenNthCalledWith(4, [
        `${DOCEBO_API_URL}/report/v1/report/${USER_CERTIFICATION_REPORT_ID}/data?from=${500}`,
        request
      ]);
    });
  });
});
