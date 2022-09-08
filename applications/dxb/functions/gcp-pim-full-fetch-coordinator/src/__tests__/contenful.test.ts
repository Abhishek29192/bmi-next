import { processContentfulDocuments } from "../contentful";
import {
  contenfulDocumentsResponseMock,
  getEsDocumentMock
} from "../__mocks__/contentful.mock";

const getEntriesMock = jest.fn();

jest.mock("contentful", () => {
  return {
    createClient: jest.fn().mockImplementation(() => ({
      getEntries: (params: Record<string, string>) => getEntriesMock(params)
    }))
  };
});

const loggerError = jest.fn();
const loggerInfo = jest.fn();
const loggerDebug = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message),
  debug: (message: any) => loggerDebug(message)
}));

describe("processContentfulDocuments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return transformed documents if no errors", async () => {
    getEntriesMock.mockResolvedValueOnce({
      items: contenfulDocumentsResponseMock
    });
    const result = await processContentfulDocuments();
    expect(getEntriesMock).toBeCalledWith({
      content_type: "document",
      locale: process.env.LOCALE
    });
    expect(loggerInfo).toBeCalled();
    expect(result).toEqual([getEsDocumentMock()]);
  });
  it("should throw an error", async () => {
    getEntriesMock.mockRejectedValue(Error("test error"));
    try {
      await processContentfulDocuments();

      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(loggerError).toBeCalledWith({ message: "test error" });
      expect((error as Error).message).toEqual("test error");
    }
    expect(getEntriesMock).toBeCalledWith({
      content_type: "document",
      locale: process.env.LOCALE
    });
    expect(loggerInfo).not.toBeCalledWith({
      message: "Received 1 contentful documents."
    });
  });
  it("should return empty array if contenful API returns nothing", async () => {
    getEntriesMock.mockResolvedValueOnce({
      items: []
    });
    const result = await processContentfulDocuments();
    expect(loggerInfo).toBeCalled();
    expect(result).toEqual([]);
  });
});
