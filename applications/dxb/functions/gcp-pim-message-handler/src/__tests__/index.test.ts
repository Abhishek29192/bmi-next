import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import { mockRequest, mockResponse, mockResponses } from "@bmi/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const handleRequest = (req: Partial<Request>, res: Partial<Response>) =>
  require("../index").handleRequest(req, res);

const createEvent = (message = {}): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};

//pimSecret[0].payload.data.toString
const accessSecretVersion = jest.fn((request) => [
  {
    payload: {
      data: "secret"
    }
  }
]);
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const pubsubTopicPublisher = jest.fn();
jest.mock("@google-cloud/pubsub", () => ({
  PubSub: jest.fn(() => ({
    topic: jest.fn(() => ({
      publish: pubsubTopicPublisher
    }))
  }))
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("handleMessage", () => {
  it("should error if itemType is unrecognised", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "TEST"
      })
    });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(window.console.error).toHaveBeenCalledWith(
      new Error("[PIM] Unrecognised itemType [TEST]")
    );
  });

  it("should error if message type is unrecognised", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "TEST"
      })
    });
    const res = mockResponse();

    await handleRequest(req, res);
    expect(window.console.error).toHaveBeenCalledWith(
      new Error("[PIM] Undercognised message type [TEST]")
    );
  });

  it("should publish message to the GCP PubSub", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "SYSTEM",
        type: "UPDATED"
      })
    });
    const res = mockResponse();

    mockResponses(
      fetchMock,
      {
        method: "POST",
        url: "glob:*/authorizationserver/oauth/token",
        body: JSON.stringify({
          access_token: "test"
        })
      },
      {
        method: "GET",
        url: "glob:*/export/systems*",
        body: JSON.stringify({
          products: [{ name: "Test Product 1" }, { name: "Test Product 2" }]
        })
      }
    );

    await handleRequest(req, res);
    expect(accessSecretVersion).toHaveBeenCalledTimes(1);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(1);
  });
});
