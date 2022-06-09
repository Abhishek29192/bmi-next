import { sendGuaranteePdf } from "..";
import { mockGuarantee, mockSolutionGuarantee } from "../../mocks/guarantee";
import StorageClient from "../storage-client";

process.env.GATEWAY_API_URL = "GATEWAY_API_URL";
process.env.GCP_PRIVATE_BUCKET_NAME = "GCP_PRIVATE_BUCKET_NAME";
process.env.GCP_SECRET_PROJECT = "GCP_SECRET_PROJECT";

const uploadFileSpy = jest.spyOn(StorageClient.prototype, "uploadFile");

const updateGuaranteeFileStorageSpy = jest.fn();

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

const loggerError = jest.fn();
const loggerInfo = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message)
}));

const getSecret = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => {
  return { getSecret };
});

const mockAccessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => ({
  SecretManagerServiceClient: jest.fn(() => ({
    accessSecretVersion: mockAccessSecretVersion
  }))
}));

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Success", async () => {
    const event = {
      data: Buffer.from(JSON.stringify(mockGuarantee)).toString("base64")
    };

    uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
    updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
      Promise.resolve("ok")
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
  it("SG Failure", async () => {
    const event = {
      data: Buffer.from(JSON.stringify(mockSolutionGuarantee)).toString(
        "base64"
      )
    };

    uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
    updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
      Promise.resolve("ok")
    );
    mockAccessSecretVersion.mockRejectedValue("error");
    setApiKey.mockImplementationOnce(() => {});
    send.mockImplementationOnce(() => {});

    await sendGuaranteePdf(event);

    expect(updateGuaranteeFileStorageSpy).toHaveBeenCalledTimes(1);
    expect(send).toBeCalledTimes(0);
    expect(loggerError).toHaveBeenCalledWith("error");
  });
});
