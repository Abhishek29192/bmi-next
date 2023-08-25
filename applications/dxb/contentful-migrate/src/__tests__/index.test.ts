import { jest } from "@jest/globals";
import { createSpace } from "@bmi/functions-contentful-management-client";
import { createEnvironmentAliasWithEnvironmentId } from "./helpers/EnvironmentAliasHelper.js";
import createEnvironment, {
  createEnvironmentWithId,
  createEnvironmentWithStatus
} from "./helpers/EnvironmentHelper.js";
import type { ClientAPI, Environment, Space } from "contentful-management";
import type { cleanupOldEnvironments } from "../cleanup.js";
import type { runMigrationScripts } from "../migrationScripts.js";

jest.unstable_mockModule("dotenv/config", () => ({ config: jest.fn() }));

const mockCreateClient = jest.fn();
jest.unstable_mockModule("contentful-management", () => ({
  __esModule: true,
  default: {
    createClient: (...args: unknown[]) => mockCreateClient(...args)
  }
}));

const mockCleanupOldEnvironments = jest.fn<typeof cleanupOldEnvironments>();
jest.unstable_mockModule("../cleanup.js", () => ({
  cleanupOldEnvironments: (tag: string, space: Space) =>
    mockCleanupOldEnvironments(tag, space)
}));

const mockRunMigrationScripts = jest.fn<typeof runMigrationScripts>();
jest.unstable_mockModule("../migrationScripts.js", () => ({
  runMigrationScripts: (
    spaceId: string,
    contentfulAlias: string,
    managementAccessToken: string
  ) => mockRunMigrationScripts(spaceId, contentfulAlias, managementAccessToken)
}));

const main = async () => (await import("../index.js")).main();

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.SPACE_ID = "spaceId";
  process.env.CONTENTFUL_ENVIRONMENT = "contentfulEnvironment";
  process.env.CONTENTFUL_ALIAS = "contentfulAlias";
  process.env.MANAGEMENT_ACCESS_TOKEN = "managementAccessToken";
  process.env.DELETE_OLD_ENVIRONMENTS = "false";
  process.env.NEW_ENVIRONMENT_NAME = "newEnvironmentName";
  process.env.TIMEOUT = "1000";
  process.env.TIMEOUT_CHECKS = "100";
});

describe("main", () => {
  it("should throw an error if SPACE_ID environment variable is not set", async () => {
    delete process.env.SPACE_ID;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing SPACE_ID environment variable."
      );
    }

    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
  });

  it("should throw an error if CONTENTFUL_ENVIRONMENT environment variable is not set", async () => {
    delete process.env.CONTENTFUL_ENVIRONMENT;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing CONTENTFUL_ENVIRONMENT environment variable."
      );
    }

    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
  });

  it("should throw an error if MANAGEMENT_ACCESS_TOKEN environment variable is not set", async () => {
    delete process.env.MANAGEMENT_ACCESS_TOKEN;

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "Missing MANAGEMENT_ACCESS_TOKEN environment variable."
      );
    }

    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
  });

  it("should only run migration scripts if NEW_ENVIRONMENT_NAME is not set", async () => {
    delete process.env.NEW_ENVIRONMENT_NAME;

    await main();

    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.CONTENTFUL_ENVIRONMENT,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockCreateClient).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts nor point alias to it if environment already exists", async () => {
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockResolvedValueOnce(createEnvironment())
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    await main();

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts nor point alias to it if an error is thrown getting the environment", async () => {
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 500 })))
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual('{"status":500}');
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts nor point alias to it if the alias cannot be found", async () => {
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 }))),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `You must have the alias ${process.env.CONTENTFUL_ALIAS} created in Contentful`
      );
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts nor point alias to it if the alias cannot be found using the environment name when alias is not provided", async () => {
    delete process.env.CONTENTFUL_ALIAS;

    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 }))),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `You must have the alias ${process.env.CONTENTFUL_ENVIRONMENT} created in Contentful`
      );
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts nor point alias to it if an error is thrown getting the alias", async () => {
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 }))),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 500 })))
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual('{"status":500}');
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should not create new environment, run migration scripts and point alias to it if alias does not exist", async () => {
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 }))),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 500 })))
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual('{"status":500}');
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should create new environment, run migration scripts and point alias to it if new environment name is provided", async () => {
    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValueOnce(
          createEnvironment(createEnvironmentWithStatus("ready"))
        ),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(
          createEnvironmentWithId(mockAlias.environment.sys.id)
        )
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    await main();

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.NEW_ENVIRONMENT_NAME,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockAlias.update).toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should create new environment, run migration scripts and point alias (as the environment name) to it if new environment name is provided and alias is not provided", async () => {
    delete process.env.CONTENTFUL_ALIAS;

    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValueOnce(createEnvironmentWithStatus("ready")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(
          createEnvironmentWithId(mockAlias.environment.sys.id)
        )
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    await main();

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.NEW_ENVIRONMENT_NAME,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockAlias.update).toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should delete old environments if DELETE_OLD_ENVIRONMENTS environment variable is set to true", async () => {
    process.env.DELETE_OLD_ENVIRONMENTS = "true";

    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValueOnce(createEnvironmentWithStatus("ready")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(
          createEnvironmentWithId(mockAlias.environment.sys.id)
        )
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    await main();

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.NEW_ENVIRONMENT_NAME,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockAlias.update).toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      mockSpace
    );
  });

  it("should delete the new environment without changing the alias and throw an error if the migration scripts fail", async () => {
    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockNewEnvironment = createEnvironmentWithId(
      mockAlias.environment.sys.id
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValueOnce(createEnvironmentWithStatus("ready")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(mockNewEnvironment)
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);
    mockRunMigrationScripts.mockRejectedValueOnce(new Error("Expected error"));

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Migration failed on contentful environment ${process.env.NEW_ENVIRONMENT_NAME}, please check the error log above.`
      );
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.NEW_ENVIRONMENT_NAME,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockNewEnvironment.delete).toHaveBeenCalled();
    expect(mockAlias.update).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should throw an error after hitting the maximum number of retries and unable to delete environment", async () => {
    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockNewEnvironment = createEnvironmentWithId(
      mockAlias.environment.sys.id
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValue(createEnvironmentWithStatus("waiting")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(mockNewEnvironment)
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);
    (
      mockNewEnvironment.delete as jest.Mock<Environment["delete"]>
    ).mockRejectedValueOnce(new Error("Expected Error"));

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected Error");
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockNewEnvironment.delete).toHaveBeenCalled();
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockAlias.update).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should throw an error after hitting the maximum number of retries and delete the new environment", async () => {
    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockNewEnvironment = createEnvironmentWithId(
      mockAlias.environment.sys.id
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValue(createEnvironmentWithStatus("waiting")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(mockNewEnvironment)
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    try {
      await main();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        `Hit the max attempts whilst waiting for the Contentful environment ${process.env.NEW_ENVIRONMENT_NAME} to be created.`
      );
    }

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockNewEnvironment.delete).toHaveBeenCalled();
    expect(mockRunMigrationScripts).not.toHaveBeenCalled();
    expect(mockAlias.update).not.toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });

  it("should carry on after retrying, but before maximum number of retries hit", async () => {
    const mockAlias = createEnvironmentAliasWithEnvironmentId(
      process.env.NEW_ENVIRONMENT_NAME!
    );
    const mockNewEnvironment = createEnvironmentWithId(
      mockAlias.environment.sys.id
    );
    const mockSpace = createSpace({
      getEnvironment: jest
        .fn<Space["getEnvironment"]>()
        .mockRejectedValueOnce(new Error(JSON.stringify({ status: 404 })))
        .mockResolvedValueOnce(createEnvironmentWithStatus("waiting"))
        .mockResolvedValueOnce(createEnvironmentWithStatus("ready")),
      getEnvironmentAlias: jest
        .fn<Space["getEnvironmentAlias"]>()
        .mockResolvedValueOnce(mockAlias),
      createEnvironmentWithId: jest
        .fn<Space["createEnvironmentWithId"]>()
        .mockResolvedValueOnce(mockNewEnvironment)
    });
    const mockClient = {
      getSpace: jest
        .fn<ClientAPI["getSpace"]>()
        .mockResolvedValueOnce(mockSpace)
    };
    mockCreateClient.mockReturnValueOnce(mockClient);

    await main();

    expect(mockCreateClient).toHaveBeenCalledWith({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN
    });
    expect(mockClient.getSpace).toHaveBeenCalledWith(process.env.SPACE_ID);
    expect(mockSpace.getEnvironment).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME
    );
    expect(mockSpace.getEnvironmentAlias).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ALIAS
    );
    expect(mockSpace.createEnvironmentWithId).toHaveBeenCalledWith(
      process.env.NEW_ENVIRONMENT_NAME,
      { name: process.env.NEW_ENVIRONMENT_NAME },
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(mockRunMigrationScripts).toHaveBeenCalledWith(
      process.env.SPACE_ID,
      process.env.NEW_ENVIRONMENT_NAME,
      process.env.MANAGEMENT_ACCESS_TOKEN
    );
    expect(mockNewEnvironment.delete).not.toHaveBeenCalled();
    expect(mockAlias.update).toHaveBeenCalled();
    expect(mockCleanupOldEnvironments).not.toHaveBeenCalled();
  });
});
