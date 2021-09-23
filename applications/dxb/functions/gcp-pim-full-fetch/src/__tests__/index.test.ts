import { handleRequest } from "..";

const ENV = process.env;
const accessSecretVersion = jest.fn();
const mockPimClientSecret = "secret";
const GCPMessagepublisher = jest.fn();
const statusText = "statusText";
const serverRequest = { body: {} };
const serverResponseSend = jest.fn();
const serverResponse = jest.fn(() => ({
  status: jest.fn(() => ({
    send: jest.fn((message) => serverResponseSend(message))
  })),
  statusText
}));
const deleteElasticSearchIndex = jest.fn();
const deleteFirestoreCollection = jest.fn();
const fetch = jest.fn();
const mockAuthToken = "token";

jest.mock("@google-cloud/pubsub", () => ({
  PubSub: jest.fn(() => ({
    topic: jest.fn(() => ({
      publish: jest.fn((messageBuffer) => GCPMessagepublisher(messageBuffer))
    }))
  }))
}));
jest.mock("@google-cloud/secret-manager", () => ({
  SecretManagerServiceClient: jest.fn(() => ({
    accessSecretVersion: jest.fn((request) => accessSecretVersion(request))
  }))
}));
jest.mock("../reset/elasticSearch.ts", () => ({
  deleteElasticSearchIndex: jest.fn(() => deleteElasticSearchIndex())
}));
jest.mock("../reset/firestore.ts", () => ({
  FIRESTORE_COLLECTIONS: {
    PRODUCTS: "root/products",
    SYSTEMS: "root/systems"
  },
  deleteFirestoreCollection: jest.fn(() => deleteFirestoreCollection())
}));
jest.mock("node-fetch", () => jest.fn(() => fetch()));

accessSecretVersion.mockReturnValue([
  { payload: { data: mockPimClientSecret } }
]);

fetch.mockReturnValue({
  ok: true,
  json: jest.fn(() => ({
    access_token: mockAuthToken
  }))
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env = { ...ENV };
});

afterEach(() => {
  process.env = ENV;
});

describe("handleRequest", () => {
  it("should throw error when failed to request oauth", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    const status = 404;
    fetch.mockReturnValueOnce({ ok: false, status, statusText });
    let error;
    try {
      await handleRequest(serverRequest, serverResponse());
    } catch (err) {
      error = err;
    }

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${ENV.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ENV.PIM_CLIENT_SECRET}/versions/latest`
    });
    expect(consoleSpy).toBeCalledWith("ERROR!", status, statusText);
    expect(error.toString()).toContain(statusText);
  });

  describe("should publishMessage", () => {
    it("trigger GCPMessagepublisher when messagePages is not empty", async () => {
      const products = [{ id: 1 }];
      const systems = [{ id: 2 }];
      fetch
        .mockReturnValueOnce({
          ok: true,
          json: jest.fn(() => ({
            access_token: mockAuthToken
          }))
        })
        .mockReturnValueOnce({
          ok: true,
          json: jest.fn(() => ({
            products
          }))
        })
        .mockReturnValueOnce({
          ok: true,
          json: jest.fn(() => ({
            access_token: mockAuthToken
          }))
        })
        .mockReturnValueOnce({
          ok: true,
          json: jest.fn(() => ({
            systems
          }))
        });
      await handleRequest(serverRequest, serverResponse());

      expect(accessSecretVersion).toBeCalledWith({
        name: `projects/${ENV.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ENV.PIM_CLIENT_SECRET}/versions/latest`
      });
      expect(deleteElasticSearchIndex).toBeCalled();
      expect(deleteFirestoreCollection).toBeCalledTimes(2);
      expect(GCPMessagepublisher).nthCalledWith(
        1,
        Buffer.from(
          JSON.stringify({
            type: "UPDATED",
            itemType: "PRODUCTS",
            items: products
          })
        )
      );
      expect(GCPMessagepublisher).nthCalledWith(
        2,
        Buffer.from(
          JSON.stringify({
            type: "UPDATED",
            itemType: "SYSTEMS",
            items: systems
          })
        )
      );
      expect(GCPMessagepublisher).toBeCalledTimes(2);
      expect(serverResponseSend).toBeCalledWith("ok");
    });

    it("throw error when failed to run topicPublisher.publish", async () => {
      const errorMessage = "errorMessage";
      let error;
      fetch
        .mockReturnValueOnce({
          ok: true,
          json: jest.fn(() => ({
            access_token: mockAuthToken
          }))
        })
        .mockRejectedValueOnce(new Error(errorMessage));
      try {
        await handleRequest(serverRequest, serverResponse());
      } catch (err) {
        error = err;
      }

      expect(accessSecretVersion).toBeCalledWith({
        name: `projects/${ENV.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ENV.PIM_CLIENT_SECRET}/versions/latest`
      });
      expect(deleteElasticSearchIndex).toBeCalled();
      expect(deleteFirestoreCollection).toBeCalledTimes(2);
      expect(error.toString()).toContain(errorMessage);
    });

    it("not being called if messagePages for products and systems is empty", async () => {
      await handleRequest(serverRequest, serverResponse());

      expect(accessSecretVersion).toBeCalledWith({
        name: `projects/${ENV.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ENV.PIM_CLIENT_SECRET}/versions/latest`
      });
      expect(deleteElasticSearchIndex).toBeCalled();
      expect(deleteFirestoreCollection).toBeCalledTimes(2);
      expect(GCPMessagepublisher).not.toBeCalled();
      expect(serverResponseSend).toBeCalledWith("ok");
    });
  });
});
