process.env.GATEWAY_API_URL = "GATEWAY_API_URL";
process.env.GCP_PRIVATE_BUCKET_NAME = "GCP_PRIVATE_BUCKET_NAME";
process.env.GCP_SECRET_PROJECT = "GCP_SECRET_PROJECT";
process.env.NODE_ENV = "dev";
process.env.MAIL_FROM = "MAIL_FROM";

import { sendGuaranteePdf } from "..";
import { mockGuarantee, mockSolutionGuarantee } from "../../mocks/guarantee";
import StorageClient from "../storage-client";

const uploadFileSpy = jest.spyOn(StorageClient.prototype, "uploadFile");
const updateGuaranteeFileStorageSpy = jest.fn();
jest.mock("@google-cloud/storage", () => ({
  Storage: jest.fn().mockImplementation(() => true)
}));

const createDoubleAcceptanceSpy = jest.fn();
const updateGuaranteeStatusSpy = jest.fn();
jest.mock("../GatewayClient", () => ({
  create: () => ({
    updateGuaranteeFileStorage: (id: any, fileName: any) =>
      updateGuaranteeFileStorageSpy(id, fileName),
    createDoubleAcceptance: createDoubleAcceptanceSpy,
    updateGuaranteeStatus: updateGuaranteeStatusSpy
  })
}));

const createGuaranteeMock = jest
  .fn()
  .mockImplementation(() => ({ name: "test", data: "some data" }));
const getPdfFromUrlMock = jest
  .fn()
  .mockImplementation(() => [new ArrayBuffer(8)]);
const mergePdfMock = jest.fn().mockImplementation(() => new Uint8Array(8));
jest.mock("../GuaranteePdf", () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: createGuaranteeMock,
      getPdfFromUrl: getPdfFromUrlMock,
      mergePdf: mergePdfMock
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
  const event = {
    data: Buffer.from(JSON.stringify(mockSolutionGuarantee)).toString("base64")
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("When guarantee pdf is not generated", () => {
    const event = {
      data: Buffer.from(JSON.stringify(mockGuarantee)).toString("base64")
    };

    beforeEach(() => {
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
    });

    it("Success", async () => {
      createDoubleAcceptanceSpy.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => ({
            data: {
              createDoubleAcceptance: {
                doubleAcceptance: {
                  id: 2
                }
              }
            }
          })
        })
      );

      await sendGuaranteePdf(event);

      expect(uploadFileSpy).toHaveBeenCalledTimes(1);
      expect(updateGuaranteeFileStorageSpy).toHaveBeenCalledTimes(1);
      expect(createDoubleAcceptanceSpy).toHaveBeenCalledWith(mockGuarantee.id);
      expect(loggerInfo).toHaveBeenLastCalledWith({
        message: `successfully created double acceptance with ID: 2`
      });
    });

    it("Fails to create double acceptance", async () => {
      createDoubleAcceptanceSpy.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false
        })
      );

      await sendGuaranteePdf(event);

      expect(loggerError).toHaveBeenLastCalledWith({
        message: `failed to creat double acceptance for guarantee with ID: 1`
      });
    });
  });

  describe("when guarantee pdf is generated", () => {
    it("should send guarantee email if fileStorageId and signedFileStorageUrl exist and status is APPROVED ", async () => {
      const event = {
        data: Buffer.from(
          JSON.stringify({
            ...mockSolutionGuarantee,
            fileStorageId: "fileStorageId",
            signedFileStorageUrl: "signedFileStorageUrl"
          })
        ).toString("base64")
      };
      await sendGuaranteePdf(event);

      expect(getPdfFromUrlMock).toHaveBeenCalledWith("signedFileStorageUrl");
      expect(mergePdfMock).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith({
        to: mockSolutionGuarantee.project?.buildingOwnerMail,
        from: "MAIL_FROM",
        replyTo: "no-reply@intouch.bmigroup.com",
        subject: expect.any(String),
        text: expect.any(String),
        attachments: expect.any(Array)
      });
      expect(updateGuaranteeStatusSpy).toHaveBeenCalledTimes(1);
    });

    it("should update guarantee status", async () => {
      const event = {
        data: Buffer.from(
          JSON.stringify({
            ...mockSolutionGuarantee,
            fileStorageId: "fileStorageId",
            signedFileStorageUrl: "signedFileStorageUrl"
          })
        ).toString("base64")
      };
      updateGuaranteeStatusSpy.mockReturnValueOnce({ ok: true });
      await sendGuaranteePdf(event);

      expect(updateGuaranteeStatusSpy).toHaveBeenCalledTimes(1);
      expect(loggerInfo).toHaveBeenCalledWith({
        message: `successfully update guarantee status with ID: 1`
      });
    });
    it("should log error when update guarantee status failed", async () => {
      const event = {
        data: Buffer.from(
          JSON.stringify({
            ...mockSolutionGuarantee,
            fileStorageId: "fileStorageId",
            signedFileStorageUrl: "signedFileStorageUrl"
          })
        ).toString("base64")
      };
      const errorMessage = "error message";
      updateGuaranteeStatusSpy.mockReturnValueOnce({
        ok: false,
        text: () => errorMessage
      });
      await sendGuaranteePdf(event);

      expect(updateGuaranteeStatusSpy).toHaveBeenCalledTimes(1);
      expect(loggerError).toHaveBeenCalledWith({
        message: `failed to update guarantee status with ID: 1, ERROR: ${errorMessage}`
      });
    });

    it("should not send guarantee email if fileStorageId and signedFileStorageUrl exist but status is not APPROVED ", async () => {
      const event = {
        data: Buffer.from(
          JSON.stringify({
            ...mockSolutionGuarantee,
            status: "DECLINED",
            fileStorageId: "fileStorageId",
            signedFileStorageUrl: "signedFileStorageUrl"
          })
        ).toString("base64")
      };
      await sendGuaranteePdf(event);

      expect(send).toHaveBeenCalledTimes(0);
    });
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
    beforeEach(() => {
      uploadFileSpy.mockImplementationOnce(() => Promise.resolve(true));
      updateGuaranteeFileStorageSpy.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );
    });

    it("normal case", async () => {
      process.env.NODE_ENV = "local";

      mkdirSpy.mockImplementationOnce((_, cb) => cb({ code: "EEXIST" }));

      await sendGuaranteePdf(event);

      expect(mkdirSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    });

    it("mkdir return error", async () => {
      process.env.NODE_ENV = "local";

      const error = { code: "test" };
      mkdirSpy.mockImplementationOnce((_, cb) => cb(error));

      await sendGuaranteePdf(event);

      expect(mkdirSpy).toHaveBeenCalledTimes(1);
      expect(loggerError).toHaveBeenCalledWith(error);
    });
  });
});
