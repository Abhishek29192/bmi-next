import { Request, Response } from "express";
import { mockResponse } from "@bmi-digital/fetch-mocks";
import { updateCertificates } from "../";
import DoceboClient from "../DoceboClient";
import {
  generateReportRecordFactory,
  generateGetDoceboUsersResponseFactory,
  fetchResponseFactory
} from "./helper";

const getCertificationsReportSpy = jest.spyOn(
  DoceboClient.prototype,
  "getCertificationsReport"
);
const createSpy = jest.fn();
const getDoceboUsersSpy = jest.fn();
const insertCertificationSpy = jest.fn();
jest.mock("../GatewayClient.ts", () => ({
  create: () => createSpy()
}));
const loggerInfo = jest.fn();
const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));

describe("gcp-cron-certification", () => {
  const response = mockResponse() as Response;

  beforeEach(() => {
    createSpy.mockImplementationOnce(() => ({
      getDoceboUsers: () => getDoceboUsersSpy(),
      insertCertification: (certs: any) => insertCertificationSpy(certs)
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    const message = "successMessage";
    const certs = [generateReportRecordFactory()];
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    getDoceboUsersSpy.mockReturnValueOnce(
      fetchResponseFactory({
        response: generateGetDoceboUsersResponseFactory()
      })
    );
    insertCertificationSpy.mockReturnValueOnce(
      fetchResponseFactory({
        response: {
          data: {
            truncateAndInsertCertification: message
          }
        }
      })
    );
    await updateCertificates({} as Request, response);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(getCertificationsReportSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenCalledWith({
      message: `${certs.length} certificates matches existing users account`
    });
    expect(insertCertificationSpy).toHaveBeenCalledWith(certs);
    expect(loggerInfo).toHaveBeenCalledWith({ message });
  });

  it("emtpy certificates returns from getCertificationsReport", async () => {
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve([]));
    getDoceboUsersSpy.mockReturnValueOnce(
      fetchResponseFactory({
        response: generateGetDoceboUsersResponseFactory()
      })
    );
    await updateCertificates({} as Request, response);

    expect(loggerInfo).toHaveBeenCalledWith({
      message: `No certificate to be inserted`
    });
  });

  it("no certifications matches accountDoceboUserIds", async () => {
    const certs = [generateReportRecordFactory({ userId: "2" })];
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    getDoceboUsersSpy.mockReturnValueOnce(
      fetchResponseFactory({
        response: generateGetDoceboUsersResponseFactory()
      })
    );
    await updateCertificates({} as Request, response);

    expect(loggerInfo).toHaveBeenCalledWith({
      message: `No certificate to be inserted`
    });
  });

  it("fails to get getDoceboUsers", async () => {
    createSpy.mockImplementationOnce(() => ({
      getDoceboUsers: () => getDoceboUsersSpy(),
      insertCertification: (certs: any) => insertCertificationSpy(certs)
    }));
    const certs = [generateReportRecordFactory()];
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    getDoceboUsersSpy.mockReturnValueOnce(
      fetchResponseFactory({
        ok: false
      })
    );
    await updateCertificates({} as Request, response);

    expect(loggerError).toHaveBeenCalledWith({
      message: `fails to fetch doceboId from account table`
    });
  });

  it("error returns from insertCertification", async () => {
    const certs = [generateReportRecordFactory()];
    const responseError = { status: 400, statusText: "statusText" };
    createSpy.mockImplementationOnce(() => ({
      getDoceboUsers: () => getDoceboUsersSpy(),
      insertCertification: (certs: any) => insertCertificationSpy(certs)
    }));
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    getDoceboUsersSpy.mockReturnValueOnce(
      fetchResponseFactory({
        response: generateGetDoceboUsersResponseFactory()
      })
    );
    insertCertificationSpy.mockReturnValueOnce(
      Promise.resolve(fetchResponseFactory({ ok: false, ...responseError }))
    );
    await updateCertificates({} as Request, response);

    expect(loggerError).toHaveBeenCalledWith({
      message: `fails to truncate and insert certificates into DB, error: ${responseError.status} ${responseError.statusText}`
    });
  });

  it("fetch throw error", async () => {
    const error = new Error("error");
    getCertificationsReportSpy.mockImplementationOnce(() =>
      Promise.reject(error)
    );
    try {
      await updateCertificates({} as Request, response);
    } catch (error) {
      expect(error).toBe(error);
    }
    expect(loggerError).toHaveBeenCalledWith({ message: error.message });
  });
});
