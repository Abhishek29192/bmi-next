import { ProductVariant } from "@bmi/es-model/src";
import { Product } from "@bmi/es-model/src/pim";
import { RequestParams } from "@elastic/elasticsearch";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import { ProductMessage } from "..";
import createProductVariant from "./helpers/ProductVariantHelper";
import createPimProduct from "./helpers/PimProductHelper";

const {
  ES_INDEX_PREFIX,
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_PASSWORD_SECRET
} = process.env;

const esPassword = "es-password";

const createEvent = (message?: ProductMessage): { data: string } => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};
const createContext = (): { message: { data: object } } => ({
  message: { data: {} }
});

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

const ping = jest.fn();
const bulk = jest.fn();
const count = jest.fn();
jest.mock("@elastic/elasticsearch", () => {
  const mClient = jest.fn(() => ({
    ping: (callback: () => any) => ping(callback),
    bulk: (params: RequestParams.Bulk) => bulk(params),
    count: (params: RequestParams.Count) => count(params)
  }));
  return { Client: mClient };
});

const transformProduct = jest.fn();
jest.mock("../transform", () => ({
  transformProduct: (product: Product): ProductVariant[] =>
    transformProduct(product)
}));

let handleMessage;
beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  const index = require("../index");
  handleMessage = index.handleMessage;
});

describe("handleMessage", () => {
  it("should do nothing if secret could not be found", async () => {
    accessSecretVersion.mockResolvedValue([]);

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if ES cluster is not available", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args({});
    });

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if event data is empty", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns empty array", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([]);

    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns transformed products but type is invalid", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([createProductVariant()]);

    const message = {
      type: "INVALID",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should perform a bulk update for approved variants on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { index: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check variants on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({ approvalStatus: "check" });
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { delete: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved variants on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({
      approvalStatus: "unapproved"
    });
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { delete: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for approved variants on delete message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { delete: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check variants on deleted message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({ approvalStatus: "check" });
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { delete: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved variants on deleted message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant({
      approvalStatus: "unapproved"
    });
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "DELETED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { delete: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should handle errors being returned", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    const index = `${ES_INDEX_PREFIX}_${message.itemType}`.toLowerCase();
    bulk.mockResolvedValue({
      body: {
        status: "OK",
        errors: [
          {
            something: "went",
            horribly: "wrong"
          }
        ]
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [
        { index: { _index: index, _id: productVariant.code } },
        productVariant
      ]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("shouldn't create the ES client if it has already created it before", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const productVariant = createProductVariant();
    transformProduct.mockReturnValue([productVariant]);
    const message = {
      type: "UPDATED",
      itemType: "PRODUCTS",
      items: [createPimProduct()]
    };
    bulk.mockResolvedValue({
      body: {
        status: "OK"
      }
    });
    count.mockResolvedValue({
      body: {
        count: {
          count: 1,
          _shards: { total: 1, successful: 1, skipped: 0, failed: 0 }
        }
      }
    });

    await handleMessage(createEvent(message), createContext());
    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledTimes(1);
  });
});
