import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { getSecret } from "../secrets";

const accessSecretVersionSpy = jest.spyOn(
  SecretManagerServiceClient.prototype,
  "accessSecretVersion"
);

describe("secrets utils", () => {
  it("normal case", async () => {
    const project = "project";
    const key = "key";
    const data = 123123123;
    accessSecretVersionSpy.mockImplementationOnce(() =>
      Promise.resolve([{ payload: { data } }])
    );

    const secret = await getSecret(project, key);

    expect(accessSecretVersionSpy).toHaveBeenCalledWith({
      name: `projects/${project}/secrets/${key}/versions/latest`
    });
    expect(secret).toBe(data.toString());
  });
});
