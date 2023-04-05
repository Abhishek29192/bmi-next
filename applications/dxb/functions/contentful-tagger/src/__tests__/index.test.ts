import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import {
  Asset,
  ClientAPI,
  EntityMetaSysProps,
  Entry,
  Environment,
  Space
} from "contentful-management";
import { Request, Response } from "express";
import SampleAssetWebhook from "./resources/contentfulWebhook_asset.json";
import SampleEntryWebhook from "./resources/contentfulWebhook_entry.json";
import SampleContentfulAsset from "./resources/sample_asset.json";
import SampleContentfulEntry from "./resources/sample_entry.json";

const tagMock = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  await (
    await import("../index")
  ).tag(request as Request, response as Response);

const REQUEST_SECRET = "some secret";

const findOwner = jest.fn().mockReturnValue({});
const findMembership = jest.fn().mockReturnValue({
  roles: [{ sys: { id: "123" } }, { sys: { id: "1235" } }],
  sys: { id: "123" }
});
const findMarketRole = jest.fn().mockReturnValue({});
const getMarketName = jest.fn().mockReturnValue("market1");
jest.mock("../membership", () => {
  return {
    findOwner,
    findMembership,
    findMarketRole,
    getMarketName
  };
});

const update = jest.fn();
const getAsset = jest
  .fn()
  .mockReturnValue({ sys: SampleContentfulAsset.sys, update });
const getEntry = jest
  .fn()
  .mockReturnValue({ sys: SampleContentfulEntry.sys, update });
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.getEntry = getEntry;
  env.getAsset = getAsset;
  return env;
};
const getEnvironment = jest.fn().mockResolvedValue(mockEnvironment());
const mockSpace = (): Partial<Space> => {
  const space: Partial<Space> = {};
  space.getEnvironment = getEnvironment;
  return space;
};

const mockClient = (): Partial<ClientAPI> => {
  const client: Partial<ClientAPI> = {};
  client.getSpace = jest.fn().mockReturnValue(mockSpace());
  return client;
};
const createClient = jest.fn().mockReturnValue(mockClient());

jest.mock("contentful-management", () => {
  return {
    createClient
  };
});

const tagEntity = jest.fn().mockReturnValue(true);
jest.mock("@bmi/cms-consolidation-utility", () => {
  return {
    tagEntity
  };
});

describe("Tag", () => {
  it.each([
    "TAGGER_REQUEST",
    "MANAGEMENT_ACCESS_TOKEN",
    "SPACE_ID",
    "CONTENTFUL_ENVIRONMENT"
  ])("Returns 500, when %s is not set", async (name) => {
    // eslint-disable-next-line security/detect-object-injection
    const original = process.env[name];
    // eslint-disable-next-line security/detect-object-injection
    delete process.env[name];

    const request = mockRequest({ method: "POST" });
    const response = mockResponse();

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);

    // eslint-disable-next-line security/detect-object-injection
    process.env[name] = original;
  });

  it.each([
    "GET",
    "HEAD",
    "PUT",
    "DELETE",
    "CONNECT",
    "TRACE",
    "PATCH",
    "OPTIONS"
  ])("Returns 405, when %s method is used", async (method) => {
    const request = mockRequest({ method });
    const response = mockResponse();

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(405);
  });

  it("Returns 401 when authorisation header is empty", async () => {
    const mockReq = mockRequest({ method: "POST" });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when 'Bearer ' string is missing", async () => {
    const mockReq = mockRequest({
      method: "POST",
      headers: { authorization: "some value" }
    });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is missing", async () => {
    const mockReq = mockRequest({
      method: "POST",
      headers: { authorization: "Bearer " }
    });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    const mockReq = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${shortSecret}`
      }
    });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 400 if the owner of the entry/asset could not be found", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      }
    });
    const response = mockResponse();
    findOwner.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 400 if a membership for the user could not be found", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      }
    });
    const response = mockResponse();
    findMembership.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 400 if DXB market role could not be found", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      }
    });
    const response = mockResponse();
    findMarketRole.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 500 if DXB market name could not be extracted", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      }
    });
    const response = mockResponse();
    getMarketName.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if entry is not found", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleEntryWebhook
    });
    const response = mockResponse();
    getEntry.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if asset is not found", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleAssetWebhook
    });
    const response = mockResponse();
    getAsset.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if request body is not correctly formatted", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      }
    });
    const response = mockResponse();

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 200 if entry is already tagged", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleEntryWebhook
    });
    const response = mockResponse();
    getEntry.mockReturnValueOnce(SampleContentfulEntry);
    tagEntity.mockReturnValueOnce(false);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  it("Returns 200 if asset is already tagged", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleAssetWebhook
    });
    const response = mockResponse();
    getAsset.mockReturnValueOnce(SampleContentfulAsset);
    tagEntity.mockReturnValueOnce(false);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  it("Update the entry if it is tagged now", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleEntryWebhook
    });
    const response = mockResponse();

    const update = jest.fn();
    const entityMock = (): Partial<Entry> => {
      const entity: Partial<Entry> = {};
      entity.update = update;
      entity.sys = SampleContentfulEntry.sys;
      return entity;
    };

    const entity = entityMock();
    getEntry.mockReturnValueOnce(entity);

    tagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(entity.update).toBeCalled();
  });

  it("Update the asset if it is tagged now", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleAssetWebhook
    });
    const response = mockResponse();

    const update = jest.fn();
    const assetMock = (): Partial<Asset> => {
      const asset: Partial<Asset> = {};
      const sys: Partial<EntityMetaSysProps> = {};
      asset.update = update;
      asset.sys = sys as EntityMetaSysProps;
      return asset;
    };

    const asset = assetMock();
    getAsset.mockReturnValueOnce(asset);
    tagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(asset.update).toBeCalledTimes(1);
  });

  it("Returns 201 response", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleEntryWebhook
    });
    const response = mockResponse();
    tagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(201);
  });

  it("Returns 500 if update fails", async () => {
    const request = mockRequest({
      method: "POST",
      headers: {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      body: SampleEntryWebhook
    });
    const response = mockResponse();
    update.mockRejectedValueOnce({});

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });
});
