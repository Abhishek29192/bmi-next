import { RequestParams } from "@elastic/elasticsearch";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import { ProductVariant } from "../es-model";
import { Product, System } from "../pim";
import { ProductMessage, SystemMessage } from "../types";
import { EsSystem } from "../transformSystems";
import createProductVariant from "./helpers/ProductVariantHelper";
import createPimProduct from "./helpers/PimProductHelper";
import { createEsSystem } from "./helpers/EsSystemHelper";
import createSystem from "./helpers/SystemHelper";

const { ES_INDEX_PREFIX, SECRET_MAN_GCP_PROJECT_NAME, ES_PASSWORD_SECRET } =
  process.env;

const esPassword = "es-password";

const createEvent = (
  message?: ProductMessage | SystemMessage
): { data: string } => {
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
jest.mock("../transformProducts", () => ({
  transformProduct: (product: Product): ProductVariant[] =>
    transformProduct(product)
}));

const transformSystem = jest.fn();
jest.mock("../transformSystems", () => ({
  transformSystem: (system: System): EsSystem => transformSystem(system)
}));

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const handleMessage = (
  event: { data: string },
  context: {
    message: {
      data: object;
    };
  }
): Promise<any> => require("../index").handleMessage(event, context);

describe("handleMessage", () => {
  it("should error if ES_CLOUD_ID is not set", async () => {
    const esCloudID = process.env.ES_CLOUD_ID;
    delete process.env.ES_CLOUD_ID;

    try {
      await handleMessage(createEvent(), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("ES_CLOUD_ID was not provided");
    }

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(ping).toBeCalledTimes(0);
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);

    process.env.ES_CLOUD_ID = esCloudID;
  });

  it("should error if ES_USERNAME is not set", async () => {
    const esUsername = process.env.ES_USERNAME;
    delete process.env.ES_USERNAME;

    try {
      await handleMessage(createEvent(), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("ES_USERNAME was not provided");
    }

    expect(accessSecretVersion).toBeCalledTimes(0);
    expect(ping).toBeCalledTimes(0);
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);

    process.env.ES_USERNAME = esUsername;
  });

  it("should error if secret could not be found", async () => {
    accessSecretVersion.mockResolvedValue([]);

    try {
      await handleMessage(createEvent(), createContext());
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect(error.message).toEqual("Unable to retrieve ES password");
    }

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalledTimes(0);
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledTimes(0);
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
    expect(transformSystem).toBeCalledTimes(0);
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform product returns empty array", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([]);

    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns transformed products but type is invalid", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    transformProduct.mockReturnValue([createProductVariant()]);

    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledTimes(0);
    expect(count).toBeCalledTimes(0);
  });

  it("should do nothing if transform returns transformed systems but type is invalid", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    transformSystem.mockReturnValue(createEsSystem());

    const message: SystemMessage = {
      type: "INVALID",
      itemType: "SYSTEMS",
      items: [createSystem()]
    };
    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
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

  it("should perform a bulk update for approved systems on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem();
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ index: { _index: index, _id: esSystem.code } }, esSystem]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check systems on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({ approvalStatus: "check" });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved systems on updated message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({
      approvalStatus: "unapproved"
    });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "UPDATED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for approved systems on delete message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem();
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for check systems on deleted message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({ approvalStatus: "check" });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: productVariant.code } }]
    });
    expect(count).toBeCalledWith({ index });
  });

  it("should perform a bulk delete for unapproved systems on deleted message", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    ping.mockImplementation((args) => {
      args();
    });
    const esSystem = createEsSystem({
      approvalStatus: "unapproved"
    });
    transformSystem.mockReturnValue(esSystem);
    const message: SystemMessage = {
      type: "DELETED",
      itemType: "SYSTEMS",
      items: [createSystem()]
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
    expect(transformProduct).toBeCalledTimes(0);
    expect(transformSystem).toBeCalledWith(message.items[0]);
    expect(bulk).toBeCalledWith({
      index: index,
      refresh: true,
      body: [{ delete: { _index: index, _id: esSystem.code } }]
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
    const message: ProductMessage = {
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
    expect(transformSystem).toBeCalledTimes(0);
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
    const message: ProductMessage = {
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
