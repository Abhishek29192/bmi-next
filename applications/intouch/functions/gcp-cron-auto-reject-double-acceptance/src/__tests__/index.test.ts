import { Request, Response } from "express";
import { mockResponse } from "@bmi-digital/fetch-mocks";
import { handleRequest } from "..";

const createSpy = jest.fn();
const autoRejectDoubleAcceptanceSpy = jest.fn();
jest.mock("../utils/GatewayClient.ts", () => ({
  create: () => createSpy()
}));
const loggerInfo = jest.fn();
const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));

describe("gcp-cron-reject-double-acceptance", () => {
  const response = mockResponse() as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    createSpy.mockImplementationOnce(() => ({
      autoRejectDoubleAcceptance: () => autoRejectDoubleAcceptanceSpy()
    }));
    autoRejectDoubleAcceptanceSpy.mockReturnValueOnce({
      ok: true,
      json: () => ({
        data: {
          autoRejectDoubleAcceptance: "ok"
        }
      })
    });
    await handleRequest({} as Request, response);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(autoRejectDoubleAcceptanceSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenCalledWith({ message: "ok" });
  });

  it("show statusText when fetch fails", async () => {
    const statusText = "statusText";
    createSpy.mockImplementationOnce(() => ({
      autoRejectDoubleAcceptance: () => autoRejectDoubleAcceptanceSpy()
    }));
    autoRejectDoubleAcceptanceSpy.mockReturnValueOnce({
      ok: false,
      statusText
    });

    try {
      await handleRequest({} as Request, response);
    } catch (error) {
      expect(error).toBe(statusText);
    }
    expect(loggerError).toHaveBeenCalledWith({ message: statusText });
  });

  it("fetch throw error", async () => {
    const error = new Error("error");
    createSpy.mockImplementationOnce(() => Promise.reject(error));
    try {
      await handleRequest({} as Request, response);
    } catch (error) {
      expect(error).toBe(error);
    }
    expect(loggerError).toHaveBeenCalledWith({ message: error.message });
  });
});
