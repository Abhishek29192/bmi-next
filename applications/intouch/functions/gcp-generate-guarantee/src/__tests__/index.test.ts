process.env.GATEWAY_API_URL = "GATEWAY_API_URL";
process.env.GCP_PRIVATE_BUCKET_NAME = "GCP_PRIVATE_BUCKET_NAME";
process.env.GCP_SECRET_PROJECT = "GCP_SECRET_PROJECT";
process.env.NODE_ENV = "dev";

import { sendGuaranteePdf } from "..";
import { mockGuarantee, mockSolutionGuarantee } from "../../mocks/guarantee";
import StorageClient from "../storage-client";

const uploadFileSpy = jest.spyOn(StorageClient.prototype, "uploadFile");
const updateGuaranteeFileStorageSpy = jest.fn();
jest.mock("@google-cloud/storage", () => ({
  Storage: jest.fn().mockImplementation(() => true)
}));

jest.mock("../GatewayClient", () => ({
  create: () => ({
    updateGuaranteeFileStorage: (id: any, fileName: any) =>
      updateGuaranteeFileStorageSpy(id, fileName)
  })
}));

const createGuaranteeMock = jest
  .fn()
  .mockImplementation(() => ({ name: "test", data: "some data" }));
jest.mock("../GuaranteePdf", () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: createGuaranteeMock
    };
  });
});
const mkdirSpy = jest.fn();
const writeFileSyncSpy = jest.fn();
jest.mock("fs", () => ({
  mkdir: (path, cb) => mkdirSpy(path, cb),
  writeFileSync: (path, content, option) =>
    writeFileSyncSpy(path, content, option)
}));

jest.mock("path", () => ({
  dirname: jest.fn().mockImplementation(() => true)
}));

const loggerError = jest.fn();
const loggerInfo = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message)
}));

const mockAccessSecretVersion = jest.fn();

const setApiKey = jest.fn();
const send = jest.fn();
jest.mock("@sendgrid/mail", () => {
  const mMailService = jest.fn(() => ({
    setApiKey: setApiKey,
    send: send
  }));
  return { MailService: mMailService };
});

describe("sendGuaranteePdf", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("Success", async () => {
    const event = {
      data: Buffer.from(JSON.stringify(mockGuarantee)).toString("base64")
    };

    uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
    updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );
    mockAccessSecretVersion.mockImplementationOnce(() =>
      Promise.resolve([
        {
          payload: { data: "" }
        }
      ])
    );
    setApiKey.mockImplementationOnce(() => {});
    send.mockImplementationOnce(() => {});

    await sendGuaranteePdf(event);

    expect(updateGuaranteeFileStorageSpy).toHaveBeenCalledTimes(1);
    expect(send).toBeCalledTimes(1);
  });

  it("storageClient Failure", async () => {
    const event = {
      data: Buffer.from(JSON.stringify(mockGuarantee)).toString("base64")
    };
    const errorMessage = new Error("errorMessage");
    uploadFileSpy.mockImplementationOnce(() => Promise.reject(errorMessage));

    await sendGuaranteePdf(event);

    expect(loggerError).toHaveBeenCalledWith(errorMessage);
  });

  it("SG Failure", async () => {
    const status = 500;
    const statusText = "statusText";
    const event = {
      data: Buffer.from(JSON.stringify(mockSolutionGuarantee)).toString(
        "base64"
      )
    };

    uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
    updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
      Promise.resolve({ status, statusText })
    );
    mockAccessSecretVersion.mockRejectedValue("error");
    setApiKey.mockImplementationOnce(() => {});
    send.mockImplementationOnce(() => {});

    await sendGuaranteePdf(event);

    expect(updateGuaranteeFileStorageSpy).toHaveBeenCalledTimes(1);
    expect(send).toBeCalledTimes(0);
    expect(loggerError).toHaveBeenCalledWith({
      message: `${status} ${statusText}`
    });
  });

  describe("local", () => {
    it("normal case", async () => {
      process.env.NODE_ENV = "local";
      const event = {
        data: Buffer.from(JSON.stringify(mockSolutionGuarantee)).toString(
          "base64"
        )
      };
      uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
      updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
        Promise.resolve({ ok: true })
      );
      mockAccessSecretVersion.mockImplementationOnce(() =>
        Promise.resolve([
          {
            payload: { data: "" }
          }
        ])
      );
      setApiKey.mockImplementationOnce(() => {});
      send.mockImplementationOnce(() => {});
      mkdirSpy.mockImplementationOnce((_, cb) => cb({ code: "EEXIST" }));

      await sendGuaranteePdf(event);

      expect(mkdirSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    });

    it("mkdir return error", async () => {
      process.env.NODE_ENV = "local";
      const event = {
        data: Buffer.from(JSON.stringify(mockSolutionGuarantee)).toString(
          "base64"
        )
      };
      const error = { code: "test" };
      uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
      updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
        Promise.resolve({ ok: true })
      );
      mockAccessSecretVersion.mockImplementationOnce(() =>
        Promise.resolve([
          {
            payload: { data: "" }
          }
        ])
      );
      setApiKey.mockImplementationOnce(() => {});
      send.mockImplementationOnce(() => {});
      mkdirSpy.mockImplementationOnce((_, cb) => cb(error));

      await sendGuaranteePdf(event);

      expect(loggerError).toHaveBeenCalledWith(error);
    });
  });
});
