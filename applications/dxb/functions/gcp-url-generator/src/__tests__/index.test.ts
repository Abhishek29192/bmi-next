import {
  createDeleteProductMessage,
  createDeleteSystemMessage,
  createUpdateCategoryMessage,
  createUpdateProductMessage,
  createUpdateSystemMessage,
  Message
} from "@bmi/pub-sub-types";
import { createProduct, createSystem } from "@bmi/firestore-types";
import { Product, System } from "@bmi/pim-types";
import { jest } from "@jest/globals";
import { Context } from "@google-cloud/functions-framework";
import { MessageOptions } from "@google-cloud/pubsub/build/src/topic";
import type {
  transformProduct,
  transformSystem
} from "@bmi/pim-transformation";
import type { PubSub, Topic } from "@google-cloud/pubsub";

jest.mock("@bmi-digital/functions-logger");

const createEvent = (message?: Message) => {
  if (!message) {
    return { data: "" };
  }
  const objJsonStr = JSON.stringify(message);
  const objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return { data: objJsonB64 };
};

const mockTransformProduct = jest.fn<typeof transformProduct>();
const mockTransformSystem = jest.fn<typeof transformSystem>();
jest.unstable_mockModule("@bmi/pim-transformation", () => ({
  transformProduct: (product: Product) => mockTransformProduct(product),
  transformSystem: (system: System) => mockTransformSystem(system)
}));

const publishMessage = jest.fn<(message: MessageOptions) => Promise<string>>();
const topic = jest.fn<PubSub["topic"]>().mockReturnValue({
  publishMessage: (message) => publishMessage(message)
} as Topic);
jest.mock("@google-cloud/pubsub", () => {
  const mPubSub = jest.fn(() => ({
    topic: (topicName: string) => topic(topicName)
  }));
  return { PubSub: mPubSub };
});

const handleMessage = async (data: any, context: Context) =>
  (await import("../index.js")).handleMessage(data, context);

beforeEach(() => {
  process.env.GCP_PROJECT_ID = "TEST_GCP_PROJECT_ID";
  process.env.NON_PROD_ENV_NAME = "qa";
  process.env.GATSBY_SITE_URL = "http://localhost:8000";
  process.env.COUNTRY_CODE = "no";
  jest.clearAllMocks();
  jest.resetModules();
});

describe("handleMessage", () => {
  it("should throw error if message has no data", async () => {
    await expect(async () => {
      await handleMessage({}, {});
    }).rejects.toThrowError("Unrecognised itemType [undefined]");

    expect(mockTransformProduct).not.toHaveBeenCalled();
    expect(mockTransformSystem).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should throw error if itemType is not PRODUCT or SYSTEM", async () => {
    const data = createEvent(createUpdateCategoryMessage());

    await expect(async () => {
      await handleMessage(data, {});
    }).rejects.toThrowError("Unrecognised itemType [CATEGORIES]");

    expect(mockTransformProduct).not.toHaveBeenCalled();
    expect(mockTransformSystem).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should do nothing if message is a delete product message", async () => {
    const data = createEvent(createDeleteProductMessage());

    await handleMessage(data, {});

    expect(mockTransformProduct).not.toHaveBeenCalled();
    expect(mockTransformSystem).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should do nothing if message is a delete system message", async () => {
    const data = createEvent(createDeleteSystemMessage());

    await handleMessage(data, {});

    expect(mockTransformProduct).not.toHaveBeenCalled();
    expect(mockTransformSystem).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should not publish any messages if product transformation returns an empty array", async () => {
    mockTransformProduct.mockReturnValueOnce([]);

    const productMessage = createUpdateProductMessage();
    const data = createEvent(productMessage);

    await handleMessage(data, {});

    expect(mockTransformProduct).toHaveBeenCalledWith(productMessage.item);
    expect(mockTransformSystem).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should not publish any messages if system transformation returns an empty array", async () => {
    mockTransformSystem.mockReturnValueOnce([]);

    const systemMessage = createUpdateSystemMessage();
    const data = createEvent(systemMessage);

    await handleMessage(data, {});

    expect(mockTransformSystem).toHaveBeenCalledWith(systemMessage.item);
    expect(mockTransformProduct).not.toHaveBeenCalled();
    expect(topic).not.toHaveBeenCalled();
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should publish message with variant code, url and catalog for each transformed product variant", async () => {
    const variant1 = createProduct({ code: "variant1" });
    const variant2 = createProduct({ code: "variant2" });
    mockTransformProduct.mockReturnValueOnce([variant1, variant2]);

    const productMessage = createUpdateProductMessage();
    const data = createEvent(productMessage);

    await handleMessage(data, {});

    expect(mockTransformProduct).toHaveBeenCalledWith(productMessage.item);
    expect(topic).toHaveBeenCalledWith(
      `bmi-${process.env.ENV_PREFIX}-dxb-pim-${process.env.NON_PROD_ENV_NAME}-URLGeneration-topic`
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: [
        {
          variantCode: variant1.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${variant1.path}`
        },
        {
          variantCode: variant2.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${variant2.path}`
        }
      ]
    });
    expect(mockTransformSystem).not.toHaveBeenCalled();
  });

  it("should publish message with variant code, url and catalog for each transformed system", async () => {
    const system1 = createSystem({ code: "system1" });
    const system2 = createSystem({ code: "system2" });
    mockTransformSystem.mockReturnValueOnce([system1, system2]);

    const productMessage = createUpdateSystemMessage();
    const data = createEvent(productMessage);

    await handleMessage(data, {});

    expect(mockTransformSystem).toHaveBeenCalledWith(productMessage.item);
    expect(topic).toHaveBeenCalledWith(
      `bmi-${process.env.ENV_PREFIX}-dxb-pim-${process.env.NON_PROD_ENV_NAME}-URLGeneration-topic`
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: [
        {
          variantCode: system1.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${system1.path}`
        },
        {
          variantCode: system2.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${system2.path}`
        }
      ]
    });
    expect(mockTransformProduct).not.toHaveBeenCalled();
  });

  it("should throw error if error thrown whilst publishing the message", async () => {
    const variant = createProduct();
    mockTransformProduct.mockReturnValueOnce([variant]);
    publishMessage.mockRejectedValueOnce(new Error("Expected error"));

    const productMessage = createUpdateProductMessage();
    const data = createEvent(productMessage);

    await expect(async () => {
      await handleMessage(data, {});
    }).rejects.toThrowError("Expected error");

    expect(mockTransformProduct).toHaveBeenCalledWith(productMessage.item);
    expect(topic).toHaveBeenCalledWith(
      `bmi-${process.env.ENV_PREFIX}-dxb-pim-${process.env.NON_PROD_ENV_NAME}-URLGeneration-topic`
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: [
        {
          variantCode: variant.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${variant.path}`
        }
      ]
    });
    expect(mockTransformSystem).not.toHaveBeenCalled();
  });

  it("should not use NON_PROD_ENV_NAME in topic name if not provided", async () => {
    const originalNonProdEnvName = process.env.NON_PROD_ENV_NAME;
    delete process.env.NON_PROD_ENV_NAME;

    const system1 = createSystem({ code: "system1" });
    const system2 = createSystem({ code: "system2" });
    mockTransformSystem.mockReturnValueOnce([system1, system2]);

    const productMessage = createUpdateSystemMessage();
    const data = createEvent(productMessage);

    await handleMessage(data, {});

    expect(mockTransformSystem).toHaveBeenCalledWith(productMessage.item);
    expect(topic).toHaveBeenCalledWith(
      `bmi-${process.env.ENV_PREFIX}-dxb-pim-URLGeneration-topic`
    );
    expect(publishMessage).toHaveBeenCalledWith({
      json: [
        {
          variantCode: system1.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${system1.path}`
        },
        {
          variantCode: system2.code,
          catalog: process.env.PIM_CATALOG_NAME,
          url: `${process.env.GATSBY_SITE_URL}/${process.env.COUNTRY_CODE}${system2.path}`
        }
      ]
    });
    expect(mockTransformProduct).not.toHaveBeenCalled();

    process.env.NON_PROD_ENV_NAME = originalNonProdEnvName;
  });
});
