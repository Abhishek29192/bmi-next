import { mockRequest, mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import mockConsole from "jest-mock-console";
import {
  Space,
  ClientAPI,
  Environment,
  Entry,
  Asset,
  EntityMetaSysProps
} from "contentful-management";
import SampleEntryWebhook from "./resources/contentfulWebhook_entry.json";
import SampleAssetWebhook from "./resources/contentfulWebhook_asset.json";
import SampleContentfulEntry from "./resources/sample_entry.json";
import SampleContentfulAsset from "./resources/sample_asset.json";

const tagMock = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  await await (
    await import("../index")
  ).tag(request as Request, response as Response);

const REQUEST_SECRET = "some secret";
const getSecret = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});
getSecret.mockReturnValue(REQUEST_SECRET);

const FindOwner = jest.fn().mockReturnValue({});
const FindMembership = jest.fn().mockReturnValue({
  roles: [{ sys: { id: "123" } }, { sys: { id: "1235" } }],
  sys: { id: "123" }
});
const FindMarketRole = jest.fn().mockReturnValue({});
const GetMarketName = jest.fn().mockReturnValue("market1");
jest.mock("../membership", () => {
  return {
    FindOwner,
    FindMembership,
    FindMarketRole,
    GetMarketName
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

const TagEntity = jest.fn().mockReturnValue(true);
jest.mock("@bmi/contentful-tag-utility", () => {
  return {
    TagEntity
  };
});

beforeEach(() => {
  mockConsole();
});

describe("Tag", () => {
  it.each([
    "TAGGER_REQUEST_SECRET",
    "MANAGEMENT_ACCESS_TOKEN",
    "SPACE_ID",
    "CONTENTFUL_ENVIRONMENT"
  ])("Returns 500, when %s is not set", async (name) => {
    // eslint-disable-next-line security/detect-object-injection
    const original = process.env[name];
    // eslint-disable-next-line security/detect-object-injection
    delete process.env[name];

    const request = mockRequest("POST");
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
    const request = mockRequest(method);
    const response = mockResponse();

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(405);
  });

  it("Returns 401 when authorisation header is empty", async () => {
    const mockReq = mockRequest("POST");
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when 'Bearer ' string is missing", async () => {
    const mockReq = mockRequest("POST", { authorization: "some value" });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is missing", async () => {
    getSecret.mockReturnValueOnce("");
    const mockReq = mockRequest("POST", { authorization: "Bearer " });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 401 when Bearer token is less than 10 characters long", async () => {
    const shortSecret = "123";
    getSecret.mockReturnValueOnce(shortSecret);
    const mockReq = mockRequest("POST", {
      authorization: `Bearer ${shortSecret}`
    });
    const mockRes = mockResponse();

    await tagMock(mockReq, mockRes);

    expect(mockRes.sendStatus).toBeCalledWith(401);
  });

  it("Returns 400 if the owner of the entry/asset could not be found", async () => {
    const request = mockRequest("POST", {
      authorization: `Bearer ${REQUEST_SECRET}`
    });
    const response = mockResponse();
    FindOwner.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 400 if a membership for the user could not be found", async () => {
    const request = mockRequest("POST", {
      authorization: `Bearer ${REQUEST_SECRET}`
    });
    const response = mockResponse();
    FindMembership.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 400 if DXB market role could not be found", async () => {
    const request = mockRequest("POST", {
      authorization: `Bearer ${REQUEST_SECRET}`
    });
    const response = mockResponse();
    FindMarketRole.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(400);
  });

  it("Returns 500 if DXB market name could not be extracted", async () => {
    const request = mockRequest("POST", {
      authorization: `Bearer ${REQUEST_SECRET}`
    });
    const response = mockResponse();
    GetMarketName.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if entry is not found", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    getEntry.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if asset is not found", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleAssetWebhook
    );
    const response = mockResponse();
    getAsset.mockReturnValueOnce(undefined);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it("Returns 500 if request body is not correclty formatted", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      undefined
    );
    const response = mockResponse();

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });

  it.each([SampleContentfulAsset, SampleContentfulEntry])(
    "Returns 200 if entry/asset is already tagged",
    async (entity) => {
      const request = mockRequest(
        "POST",
        {
          authorization: `Bearer ${REQUEST_SECRET}`
        },
        undefined,
        SampleAssetWebhook
      );
      const response = mockResponse();
      getAsset.mockReturnValueOnce(entity); //TODO fix
      TagEntity.mockReturnValueOnce(false);

      await tagMock(request, response);

      expect(response.sendStatus).toBeCalledWith(200);
    }
  );

  it("Update the entry if it is tagged now", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
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

    TagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(entity.update).toBeCalled();
  });

  it("Update the asset if it is tagged now", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleAssetWebhook
    );
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
    TagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(asset.update).toBeCalledTimes(1);
  });

  it("Returns 201 response", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    TagEntity.mockReturnValueOnce(true);

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(201);
  });

  it("Returns 500 if update failes", async () => {
    const request = mockRequest(
      "POST",
      {
        authorization: `Bearer ${REQUEST_SECRET}`
      },
      undefined,
      SampleEntryWebhook
    );
    const response = mockResponse();
    update.mockRejectedValueOnce({});

    await tagMock(request, response);

    expect(response.sendStatus).toBeCalledWith(500);
  });
});
