import { Request, Response } from "express";
import { mockResponse } from "@bmi-digital/fetch-mocks";
import { handleRequest } from "..";

const createSpy = jest.fn();
const annualInspectionSpy = jest.fn();
jest.mock("../utils/GatewayClient.ts", () => ({
  create: () => createSpy(),
  annualInspection: () => annualInspectionSpy()
}));

const createMarketsSpy = jest.fn();
const marketsSpy = jest.fn();
jest.mock("../utils/GetMarkets.ts", () => ({
  create: () => createMarketsSpy(),
  getMarkets: () => marketsSpy()
}));

const loggerInfo = jest.fn();
const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));

describe("gcp-cron-annual-inspection", () => {
  const response = mockResponse() as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const marketsJson = {
    data: {
      markets: {
        nodes: [{ domain: "en" }]
      }
    }
  };

  it("normal case", async () => {
    createMarketsSpy.mockImplementationOnce(() => ({
      getMarkets: () => marketsSpy()
    }));
    marketsSpy.mockReturnValueOnce({
      ok: true,
      json: () => marketsJson
    });
    createSpy.mockImplementationOnce(() => ({
      annualInspection: () => annualInspectionSpy()
    }));
    annualInspectionSpy.mockReturnValueOnce({
      ok: true,
      json: () => ({
        data: {
          annualProjectsInspection: "ok"
        }
      })
    });
    await handleRequest({} as Request, response);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(annualInspectionSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenCalledWith({ message: "ok" });
  });

  it("show statusText when fetch fails", async () => {
    const statusText = "statusText";
    createMarketsSpy.mockImplementationOnce(() => ({
      getMarkets: () => marketsSpy()
    }));
    marketsSpy.mockReturnValueOnce({
      ok: true,
      json: () => marketsJson
    });
    createSpy.mockImplementationOnce(() => ({
      annualInspection: () => annualInspectionSpy()
    }));
    annualInspectionSpy.mockReturnValueOnce({
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
    createMarketsSpy.mockImplementationOnce(() => ({
      getMarkets: () => marketsSpy()
    }));
    marketsSpy.mockReturnValueOnce({
      ok: true,
      json: () => marketsJson
    });
    createSpy.mockImplementationOnce(() => Promise.reject(error));
    try {
      await handleRequest({} as Request, response);
    } catch (error) {
      expect(error).toBe(error);
    }
    expect(loggerError).toHaveBeenCalledWith({ message: error.message });
  });
});
