import { ProductVariant } from "@bmi/es-model/src";
import { Product } from "@bmi/es-model/src/pim";
import { protos } from "@google-cloud/secret-manager";
import mockConsole from "jest-mock-console";
import { ProductMessage } from "..";
import createPimProduct from "../../test/PimProductHelper";

const {
  ES_INDEX_PREFIX,
  SECRET_MAN_GCP_PROJECT_NAME,
  ES_PASSWORD_SECRET,
  ES_CLOUD_ID,
  ES_USERNAME,
  BATCH_SIZE = "250"
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
jest.mock("@elastic/elasticsearch", () => {
  const mClient = jest.fn(() => ({
    ping: (callback: () => any) => ping(callback)
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
    expect(ping).toBeCalledTimes(0);
  });

  it("should do nothing if ES_CLOUD_ID is not set", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalledTimes(0);
  });

  it("should do nothing if ES cluster is not available", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
  });

  it("should do nothing if event data is empty", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);

    await handleMessage(createEvent(), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
  });

  it("should do nothing if transform returns empty array", async () => {
    accessSecretVersion.mockResolvedValue([{ payload: { data: esPassword } }]);
    transformProduct.mockResolvedValue([]);

    const message = { type: "", itemType: "", items: [createPimProduct()] };
    await handleMessage(createEvent(message), createContext());

    expect(accessSecretVersion).toBeCalledWith({
      name: `projects/${SECRET_MAN_GCP_PROJECT_NAME}/secrets/${ES_PASSWORD_SECRET}/versions/latest`
    });
    expect(ping).toBeCalled();
    expect(transformProduct).toBeCalledWith(message.items[0]);
  });

  it("shouldn't create the ES client if it has already created it before", async () => {
    await handleMessage(createEvent(), createContext());
    await handleMessage(createEvent(), createContext());
  });
});
