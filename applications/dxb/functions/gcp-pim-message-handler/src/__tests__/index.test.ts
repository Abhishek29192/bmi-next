import mockConsole from "jest-mock-console";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import {
  mockRequest,
  mockResponse,
  mockResponses
} from "../../../../../../libraries/fetch-mocks/src/index";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const getProducts = jest.fn();
const getSystems = jest.fn();
jest.mock("../pim", () => ({
  getProducts: () => getProducts(),
  getSystems: () => getSystems()
}));

const pubsubTopicPublisher = jest.fn();
jest.mock("@google-cloud/pubsub", () => ({
  PubSub: jest.fn(() => ({
    topic: jest.fn(() => ({
      publish: pubsubTopicPublisher
    }))
  }))
}));

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

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("handleMessage", () => {
  it("should return 404 if request body not sent", async () => {
    const req = mockRequest("GET", {}, "/");
    const res = mockResponse();

    await handleRequest(req, res);

    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("not-ok");
  });

  it("should error if itemType is unrecognised", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "TEST",
        type: "UPDATED"
      })
    });
    const res = mockResponse();

    await handleRequest(req, res);

    expect(window.console.error).toHaveBeenCalledWith(
      new Error("[PIM] Unrecognised itemType [TEST]")
    );
    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
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
    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish UPDATED PRODUCTS message to the GCP PubSub", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getProducts
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

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getProducts.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish DELETED PRODUCTS message to the GCP PubSub", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "DELETED"
      })
    });
    const res = mockResponse();
    getProducts
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

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "DELETED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "DELETED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "DELETED"
      })
    });
    const res = mockResponse();
    getProducts.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish UPDATED SYSTEMS message to the GCP PubSub", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "SYSTEMS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getSystems
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

    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "SYSTEMS",
          items: [{ name: "Test System 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "SYSTEMS",
          items: [{ name: "Test System 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "SYSTEMS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getSystems.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(1);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should publish DELETED SYSTEMS message to the GCP PubSub", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "SYSTEMS",
        type: "DELETED"
      })
    });
    const res = mockResponse();
    getSystems
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

    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "DELETED",
          itemType: "SYSTEMS",
          items: [{ name: "Test System 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "DELETED",
          itemType: "SYSTEMS",
          items: [{ name: "Test System 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "SYSTEMS",
        type: "DELETED"
      })
    });
    const res = mockResponse();
    getSystems.mockResolvedValueOnce({
      totalPageCount: 1
    });

    await handleRequest(req, res);

    expect(getProducts).toHaveBeenCalledTimes(0);
    expect(getSystems).toHaveBeenCalledTimes(1);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveFetchedTimes(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("ok");
  });

  it("should ignore errors when messages fail to publish", async () => {
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getProducts
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

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getProducts
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

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 2" }]
        })
      )
    );
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
    const req = mockRequest("GET", {}, "/", {
      message: createEvent({
        itemType: "PRODUCTS",
        type: "UPDATED"
      })
    });
    const res = mockResponse();
    getProducts
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

    expect(getProducts).toHaveBeenCalledTimes(2);
    expect(getSystems).toHaveBeenCalledTimes(0);
    expect(pubsubTopicPublisher).toHaveBeenCalledTimes(2);
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 1" }]
        })
      )
    );
    expect(pubsubTopicPublisher).toHaveBeenCalledWith(
      Buffer.from(
        JSON.stringify({
          type: "UPDATED",
          itemType: "PRODUCTS",
          items: [{ name: "Test Product 2" }]
        })
      )
    );
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
