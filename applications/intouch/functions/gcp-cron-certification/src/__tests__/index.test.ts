import { Request, Response } from "express";
import { mockResponse } from "@bmi-digital/fetch-mocks";
import { updateCertificates } from "../";
import DoceboClient from "../DoceboClient";
import { generateReportRecordFactory } from "./helper";

const getCertificationsReportSpy = jest.spyOn(
  DoceboClient.prototype,
  "getCertificationsReport"
);
const insertCertificationSpy = jest.fn();
jest.mock("../PostgreSqlClient.ts", () => ({
  insertCertification: (certs: any) => insertCertificationSpy(certs)
}));
const loggerInfo = jest.fn();
const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));

describe("gcp-cron-certification", () => {
  const response = mockResponse() as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    const message = "successMessage";
    const certs = [generateReportRecordFactory()];
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    insertCertificationSpy.mockReturnValueOnce(message);
    await updateCertificates({} as Request, response);

    expect(getCertificationsReportSpy).toHaveBeenCalledTimes(1);
    expect(insertCertificationSpy).toHaveBeenCalledWith(certs);
    expect(loggerInfo).toHaveBeenCalledWith({ message });
  });

  it("show statusText when fetch fails", async () => {
    const certs = [generateReportRecordFactory()];
    getCertificationsReportSpy.mockReturnValueOnce(Promise.resolve(certs));
    insertCertificationSpy.mockReturnValueOnce(null);
    await updateCertificates({} as Request, response);

    expect(loggerError).toHaveBeenCalledWith({
      message: `failed to insert certificates into DB`
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
