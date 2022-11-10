import {
  createFullyPopulatedProduct,
  createFullyPopulatedSystem
} from "@bmi/pim-types";
import {
  createUpdateProductMessage,
  Message,
  createUpdateSystemMessage,
  createDeleteProductMessage,
  createDeleteSystemMessage
} from "@bmi/pub-sub-types";
import { handleMessage } from "../";

jest.mock("@bmi-digital/functions-logger");

const createEvent = (message?: Message) => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};

const transformProduct = jest.fn();
jest.mock("../productTransformer", () => ({
  transformProduct: () => transformProduct()
}));

const publishMessage = jest.fn();
jest.mock("@google-cloud/pubsub", () => {
  const mPubSub = jest.fn(() => ({
    topic: () => ({
      publishMessage: (...args: any) => publishMessage(...args)
    })
  }));
  return { PubSub: mPubSub };
});

beforeEach(() => {
  process.env.GCP_PROJECT_ID = "TEST_GCP_PROJECT_ID";
  process.env.NON_PROD_ENV_NAME = "qa";
  jest.resetAllMocks();
  jest.resetModules();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("handleMessage", () => {
  it("should execute correctly if type is UPDATED and itemType is PRODUCTS", async () => {
    const product = createFullyPopulatedProduct();
    const data = createEvent(
      createUpdateProductMessage({
        item: product
      })
    );

    const transformedProduct = {
      catalog: "pim-catalog-name",
      url: "/p/name-shadow-black-gloss-concrete-3464354221",
      variantCode: "variant-code"
    };
    transformProduct.mockReturnValue([transformedProduct]);

    await handleMessage(data, {});
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "PRODUCTS",
        item: [
          {
            catalog: "pim-catalog-name",
            url: "/p/name-shadow-black-gloss-concrete-3464354221",
            variantCode: "variant-code"
          }
        ]
      }
    });
  });
  it("should execute correctly if type is UPDATED and itemType is SYSTEM", async () => {
    const system = createFullyPopulatedSystem();
    const data = createEvent(
      createUpdateSystemMessage({
        item: system
      })
    );

    const transformedSystem = {
      catalog: "pim-catalog-name",
      url: "/s/name-1853176582",
      variantCode: "code"
    };
    transformProduct.mockReturnValue([transformedSystem]);

    await handleMessage(data, {});
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "UPDATED",
        itemType: "SYSTEMS",
        item: [
          {
            catalog: "pim-catalog-name",
            url: "/s/name-1853176582",
            variantCode: "code"
          }
        ]
      }
    });
  });
  it("should execute correctly if type is DELETE and itemType is PRODUCTS", async () => {
    const product = createFullyPopulatedProduct();
    const data = createEvent(
      createDeleteProductMessage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item: product
      })
    );

    const transformedProduct = {
      catalog: "pim-catalog-name",
      url: "/p/name-shadow-black-gloss-concrete-3464354221",
      variantCode: "variant-code"
    };
    transformProduct.mockReturnValue([transformedProduct]);

    await handleMessage(data, {});
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "PRODUCTS",
        item: [
          {
            catalog: "pim-catalog-name",
            url: "/p/name-shadow-black-gloss-concrete-3464354221",
            variantCode: "variant-code"
          }
        ]
      }
    });
  });
  it("should execute correctly if type is DELETE and itemType is SYSTEM", async () => {
    const system = createFullyPopulatedSystem();
    const data = createEvent(
      createDeleteSystemMessage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item: system
      })
    );

    const transformedSystem = {
      catalog: "pim-catalog-name",
      url: "/s/name-1853176582",
      variantCode: "code"
    };
    transformProduct.mockReturnValue([transformedSystem]);

    await handleMessage(data, {});
    expect(publishMessage).toHaveBeenCalledWith({
      json: {
        type: "DELETED",
        itemType: "SYSTEMS",
        item: [
          {
            catalog: "pim-catalog-name",
            url: "/s/name-1853176582",
            variantCode: "code"
          }
        ]
      }
    });
  });
});
