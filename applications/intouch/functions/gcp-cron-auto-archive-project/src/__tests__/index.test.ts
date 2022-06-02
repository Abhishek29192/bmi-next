import { Request, Response } from "express";
import { mockResponse } from "@bmi-digital/fetch-mocks";
import { handleRequest } from "..";

const createSpy = jest.fn();
const archiveGuaranteeSpy = jest.fn();
jest.mock("../utils/GatewayClient.ts", () => ({
  create: () => createSpy(),
  archiveGuarantee: () => archiveGuaranteeSpy()
}));
const loggerInfo = jest.fn();
const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));

describe("gcp-cron-auto-archive-project", () => {
  const response = mockResponse() as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    createSpy.mockImplementationOnce(() => ({
      archiveGuarantee: () => archiveGuaranteeSpy()
    }));
    archiveGuaranteeSpy.mockReturnValueOnce({
      ok: true,
      json: () => ({ data: { archiveProjects: "test" } })
    });
    await handleRequest({} as Request, response);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(archiveGuaranteeSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenCalledWith({ message: "test" });
  });

  it("show statusText when fetch fails", async () => {
    const statusText = "statusText";
    createSpy.mockImplementationOnce(() => ({
      archiveGuarantee: () => archiveGuaranteeSpy()
    }));
    archiveGuaranteeSpy.mockReturnValueOnce({
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
