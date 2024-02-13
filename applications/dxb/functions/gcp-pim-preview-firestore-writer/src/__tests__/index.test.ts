import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { createProduct as createFirestoreProduct } from "@bmi/firestore-types";
import {
  ApprovalStatus,
  createFullyPopulatedProduct,
  createVariantOption
} from "@bmi/pim-types";
import { handlePreviewProducts } from "../index";

const setItemsInFirestoreMock = jest.fn();
jest.mock("../db", () => ({
  setItemsInFirestore: (...args: unknown[]) => setItemsInFirestoreMock(...args)
}));

const fetchDataByCodeMock = jest.fn();
jest.mock("@bmi/pim-api", () => ({
  fetchDataByCode: (...args: unknown[]) => fetchDataByCodeMock(...args)
}));

const transformProductMock = jest.fn();
jest.mock("@bmi/pim-transformation", () => ({
  transformProduct: (...args: unknown[]) => transformProductMock(...args)
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe("handlePreviewProducts", () => {
  it("should return 500 if GCP_PROJECT_ID is not set", async () => {
    const originalValue = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const req = mockRequest({ method: "GET", url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.GCP_PROJECT_ID = originalValue;
  });

  it("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const originalValue = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.FIRESTORE_ROOT_COLLECTION = originalValue;
  });

  it("should return 500 if LOCALE is not set", async () => {
    const originalValue = process.env.LOCALE;
    delete process.env.LOCALE;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.LOCALE = originalValue;
  });

  it("should return 500 if PIM_OAUTH_TOKEN_URL is not set", async () => {
    const originalValue = process.env.PIM_OAUTH_TOKEN_URL;
    delete process.env.PIM_OAUTH_TOKEN_URL;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.PIM_OAUTH_TOKEN_URL = originalValue;
  });

  it("should return 500 if PIM_CLIENT_ID is not set", async () => {
    const originalValue = process.env.PIM_CLIENT_ID;
    delete process.env.PIM_CLIENT_ID;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.PIM_CLIENT_ID = originalValue;
  });

  it("should return 500 if PIM_OAUTH_CLIENT_SECRET is not set", async () => {
    const originalValue = process.env.PIM_OAUTH_CLIENT_SECRET;
    delete process.env.PIM_OAUTH_CLIENT_SECRET;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.PIM_OAUTH_CLIENT_SECRET = originalValue;
  });

  it("should return 500 if PIM_CATALOG_API_URL is not set", async () => {
    const originalValue = process.env.PIM_CATALOG_API_URL;
    delete process.env.PIM_CATALOG_API_URL;

    const req = mockRequest({ method: "GET", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    process.env.PIM_CATALOG_API_URL = originalValue;
  });

  it("should return 204 if method is OPTIONS", async () => {
    const req = mockRequest({ method: "OPTIONS", headers: {}, url: "/" });
    const res = mockResponse();

    await handlePreviewProducts(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("should return 400 if there is no productcodes in the request query", async () => {
    const req = mockRequest({
      method: "GET",
      url: "/",
      headers: {},
      query: {
        productcodes: undefined
      }
    });
    const res = mockResponse();
    await handlePreviewProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product codes are missing"
    });
  });

  it("should return 500 if all PIM requests fail", async () => {
    fetchDataByCodeMock.mockRejectedValue(new Error("Internal Server Error"));

    const req = mockRequest({
      method: "GET",
      url: "/",
      headers: {},
      query: {
        productcodes: "product1,product2"
      }
    });
    const res = mockResponse();
    await handlePreviewProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Please try again later"
    });
  });

  it("writes products to the Firestore collection", async () => {
    const product1 = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createVariantOption({
          approvalStatus: ApprovalStatus.Preview,
          code: "product-1",
          name: "Preview product"
        })
      ]
    });
    const product2 = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createVariantOption({
          approvalStatus: ApprovalStatus.Preview,
          code: "product-1",
          name: "Preview product"
        })
      ]
    });

    fetchDataByCodeMock.mockResolvedValueOnce(product1);
    fetchDataByCodeMock.mockResolvedValueOnce(product2);

    transformProductMock.mockReturnValueOnce([
      createFirestoreProduct({
        code: "product_1",
        approvalStatus: ApprovalStatus.Preview
      })
    ]);
    transformProductMock.mockReturnValueOnce([
      createFirestoreProduct({
        code: "product_2",
        approvalStatus: ApprovalStatus.Preview
      })
    ]);
    const req = mockRequest({
      method: "GET",
      url: "/",
      headers: {},
      query: {
        productcodes: "product_1,product_2"
      }
    });
    const res = mockResponse();
    await handlePreviewProducts(req, res);
    expect(transformProductMock).toHaveBeenCalledTimes(2);
    expect(transformProductMock).toHaveBeenCalledWith(product1, true);
    expect(transformProductMock).toHaveBeenCalledWith(product2, true);

    expect(setItemsInFirestoreMock).toHaveBeenCalledWith([
      expect.objectContaining({ code: "product_1" }),
      expect.objectContaining({ code: "product_2" })
    ]);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 500 if setItemsInFirestore throws an error", async () => {
    fetchDataByCodeMock.mockResolvedValue({
      products: [
        createFullyPopulatedProduct({
          code: "product_code",
          approvalStatus: ApprovalStatus.Preview
        })
      ],
      version: "Staged",
      totalProductCount: 1
    });
    transformProductMock.mockReturnValue(
      createFirestoreProduct({
        code: "product_code",
        approvalStatus: ApprovalStatus.Preview
      })
    );
    const req = mockRequest({
      method: "GET",
      url: "/",
      headers: {},
      query: {
        productcodes: "product_code"
      }
    });
    const res = mockResponse();
    setItemsInFirestoreMock.mockRejectedValue(new Error());
    await handlePreviewProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong, try again later."
    });
  });
});
