import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { ObjType } from "@bmi/pub-sub-types";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const getProductsByMessageId = jest.fn();
const getSystemsByMessageId = jest.fn();
jest.mock("@bmi/pim-api", () => ({
  getProductsByMessageId: () => getProductsByMessageId(),
  getSystemsByMessageId: () => getSystemsByMessageId()
}));

const pubsubTopicPublisher = jest.fn();
jest.mock("@google-cloud/pubsub", () => ({
  PubSub: jest.fn(() => ({
    topic: jest.fn(() => ({
      publishMessage: pubsubTopicPublisher
    }))
  }))
}));

const handleRequest = async (req: Partial<Request>, res: Partial<Response>) =>
  (await import("../index")).handleRequest(req as Request, res as Response);

const createEvent = (message = {}): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("handleMessage", () => {
  it("should return 500 if BUILD_TRIGGER_ENDPOINT is not set", async () => {
    const originalBuildTriggerEndpoint = process.env.BUILD_TRIGGER_ENDPOINT;
    delete process.env.BUILD_TRIGGER_ENDPOINT;

    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "TEST",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.BUILD_TRIGGER_ENDPOINT = originalBuildTriggerEndpoint;
  });

  it("should return 500 if TRANSITIONAL_TOPIC_NAME is not set", async () => {
    const originalTransitionalTopicName = process.env.TRANSITIONAL_TOPIC_NAME;
    delete process.env.TRANSITIONAL_TOPIC_NAME;

    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "TEST",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.TRANSITIONAL_TOPIC_NAME = originalTransitionalTopicName;
  });

  it("should return 500 if LOCALE is not set", async () => {
    const originalLocale = process.env.LOCALE;
    delete process.env.LOCALE;

    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "TEST",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.sendStatus).toHaveBeenCalledWith(500);

    process.env.LOCALE = originalLocale;
  });

  it("should return 404 if request body not sent", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: undefined
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("not-ok");
  });

  it("should error if itemType is unrecognised", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "TEST",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should error if message type is unrecognised", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "TEST"
        })
      }
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish UPDATED PRODUCTS message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 2" }]
      });
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(2);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 1" }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 2" }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should handle UPDATED message when no products returned from API", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId.mockResolvedValueOnce({
      totalPageCount: 1
    });
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(1);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish DELETED PRODUCTS message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "DELETED",
          base: ["BP1", "BPÉ2"],
          variant: ["VP1", "VP2"]
        })
      }
    });
    const res = mockResponse();
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(4);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "PRODUCTS",
        item: { code: "BP1", objType: ObjType.Base_product }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "PRODUCTS",
        item: { code: "BPÉ2", objType: ObjType.Base_product }
      }
    });

    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "PRODUCTS",
        item: { code: "VP1", objType: ObjType.Variant }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "PRODUCTS",
        item: { code: "VP2", objType: ObjType.Variant }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should handle DELETED message when no products returned from API", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "DELETED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish UPDATED SYSTEMS message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "SYSTEMS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getSystemsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        systems: [{ name: "Test System 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        systems: [{ name: "Test System 2" }]
      });
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "SYSTEMS",
        item: { name: "Test System 1" }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "SYSTEMS",
        item: { name: "Test System 2" }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should handle UPDATED message when no systems returned from API", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "SYSTEMS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getSystemsByMessageId.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(1);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish DELETED SYSTEMS message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "SYSTEMS",
          type: "DELETED",
          system: ["System1", "System2"],
          layer: ["Layer1", "Layer2"]
        })
      }
    });
    const res = mockResponse();
    getSystemsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        systems: [{ name: "Test System 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        systems: [{ name: "Test System 2" }]
      });
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(4);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "SYSTEMS",
        item: { code: "System1", objType: ObjType.System }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "SYSTEMS",
        item: { code: "System2", objType: ObjType.System }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "SYSTEMS",
        item: { code: "Layer1", objType: ObjType.Layer }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "SYSTEMS",
        item: { code: "Layer2", objType: ObjType.Layer }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should handle DELETED message when no systems returned from API", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "SYSTEMS",
          type: "DELETED",
          system: ["System1", "System2"],
          layer: ["Layer1", "Layer2"]
        })
      }
    });
    const res = mockResponse();
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should not publish UPDATED CATEGORIES message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "CATEGORIES",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Category 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Category 2" }]
      });
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should not publish DELETED CATEGORIES message to the GCP PubSub", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "CATEGORIES",
          type: "DELETED",
          base: ["BP1", "BPÉ2"],
          variant: ["VP1", "VP2"],
          system: ["System1", "System2"],
          layer: ["Layer1", "Layer2"]
        })
      }
    });
    const res = mockResponse();
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(0);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should ignore errors when messages fail to publish", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 2" }]
      });
    pubsubTopicPublisher.mockRejectedValue(new Error("Expected error"));
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(2);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 1" }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 2" }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should ignore error when get authentication token", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 2" }]
      });
    pubsubTopicPublisher.mockResolvedValue("1");
    mockResponses(fetchMock, {
      method: "GET",
      url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      error: new Error("Expected error")
    });

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(2);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 1" }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 2" }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(1);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should ignore error when triggering build function", async () => {
    const req = mockRequest({
      method: "GET",
      headers: {},
      url: "/",
      body: {
        message: createEvent({
          itemType: "PRODUCTS",
          type: "UPDATED"
        })
      }
    });
    const res = mockResponse();
    getProductsByMessageId
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 1" }]
      })
      .mockResolvedValueOnce({
        totalPageCount: 2,
        products: [{ name: "Test Product 2" }]
      });
    pubsubTopicPublisher.mockResolvedValue("1");
    const token = "authentication-token";
    mockResponses(
      fetchMock,
      {
        method: "GET",
        url: `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
        body: token
      },
      {
        method: "POST",
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        error: new Error("Expected error")
      }
    );

    await handleRequest(req, res);

    expect(getProductsByMessageId).toHaveBeenCalledTimes(2);
    expect(getSystemsByMessageId).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 1" }
      }
    });
    expect(pubsubTopicPublisher).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: { name: "Test Product 2" }
      }
    });
    expect(fetchMock).toHaveFetchedTimes(2);
    expect(fetchMock).toHaveFetched(
      `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`,
      {
        method: "GET",
        headers: {
          "Metadata-Flavor": "Google"
        }
      }
    );
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: { data: "filler data" }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });
});
