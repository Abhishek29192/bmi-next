import { protos } from "@google-cloud/secret-manager";

const accessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager/build/src/v1", () => {
  const mSecretManagerServiceClient = jest.fn(() => ({
    accessSecretVersion: (
      request: protos.google.cloud.secretmanager.v1.IAccessSecretVersionRequest
    ) => accessSecretVersion(request)
  }));
  return { SecretManagerServiceClient: mSecretManagerServiceClient };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const getSecret = async (secretName: string): Promise<string> =>
  (await import("..")).getSecret(secretName);

describe("getSecret", () => {
  it("should throw an error if SECRET_MAN_GCP_PROJECT_NAME is not set", async () => {
    const secretManGcpProjectName = process.env.SECRET_MAN_GCP_PROJECT_NAME;
    delete process.env.SECRET_MAN_GCP_PROJECT_NAME;

    try {
      await getSecret("secret");
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        "SECRET_MAN_GCP_PROJECT_NAME has not been set."
      );
    }

    expect(accessSecretVersion).not.toHaveBeenCalled();

    process.env.SECRET_MAN_GCP_PROJECT_NAME = secretManGcpProjectName;
  });

  it("should throw an error if accessSecretVersion returns undefined payload", async () => {
    const secretName = "secret";

    accessSecretVersion.mockResolvedValue([{}]);

    try {
      await getSecret(secretName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `Unable to get secret for key ${secretName}.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
  });

  it("should throw an error if accessSecretVersion returns null payload", async () => {
    const secretName = "secret";

    accessSecretVersion.mockResolvedValue([{ payload: null }]);

    try {
      await getSecret(secretName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `Unable to get secret for key ${secretName}.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
  });

  it("should throw an error if accessSecretVersion returns payload with undefined data", async () => {
    const secretName = "secret";

    accessSecretVersion.mockResolvedValue([{ payload: {} }]);

    try {
      await getSecret(secretName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `Unable to get secret for key ${secretName}.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
  });

  it("should throw an error if accessSecretVersion returns payload with null data", async () => {
    const secretName = "secret";

    accessSecretVersion.mockResolvedValue([{ payload: { data: null } }]);

    try {
      await getSecret(secretName);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        `Unable to get secret for key ${secretName}.`
      );
    }

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
  });

  it("should return secret if accessSecretVersion returns payload with string data", async () => {
    const secretName = "secret";
    const expectedSecret = "expected secret";

    accessSecretVersion.mockResolvedValue([
      { payload: { data: expectedSecret } }
    ]);

    const secret = await getSecret(secretName);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
    expect(secret).toStrictEqual(expectedSecret);
  });

  it("should return secret if accessSecretVersion returns payload with Uint8Array data", async () => {
    const secretName = "secret";
    const storedSecret = new Uint8Array([42, 21, 32]);
    const expectedSecret = "42,21,32";

    accessSecretVersion.mockResolvedValue([
      { payload: { data: storedSecret } }
    ]);

    const secret = await getSecret(secretName);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
    expect(secret).toStrictEqual(expectedSecret);
  });

  it("should return secret if from cache if already been successfully returned", async () => {
    const secretName = "secret";
    const expectedSecret = "expected secret";

    accessSecretVersion.mockResolvedValue([
      { payload: { data: expectedSecret } }
    ]);

    const firstSecret = await getSecret(secretName);
    const secondSecret = await getSecret(secretName);

    expect(accessSecretVersion).toHaveBeenCalledWith({
      name: `projects/${process.env.SECRET_MAN_GCP_PROJECT_NAME}/secrets/${secretName}/versions/latest`
    });
    expect(accessSecretVersion).toHaveBeenCalledTimes(1);
    expect(firstSecret).toStrictEqual(expectedSecret);
    expect(secondSecret).toStrictEqual(expectedSecret);
  });
});
