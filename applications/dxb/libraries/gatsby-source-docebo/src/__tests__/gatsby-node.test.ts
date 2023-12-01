import { testPluginOptionsSchema } from "gatsby-plugin-utils";
import {
  CourseCategory,
  createCatalogue,
  createCategory,
  createCertification,
  createCourse,
  createSession
} from "@bmi/docebo-types";
import { sourceNodes, pluginOptionsSchema } from "../gatsby-node";
import { nodeBuilder, transformCourse } from "../utils";
import { NODE_TYPES } from "../types";
import type { PluginOptions, SourceNodesArgs } from "gatsby";

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  nodeBuilder: jest.fn()
}));

const fetchCoursesMock = jest.fn();
const fetchCatalogueMock = jest.fn();
const fetchCategoriesMock = jest.fn();
const fetchCertificationsMock = jest.fn();
const fetchSessionMock = jest.fn();

jest.mock("@bmi/docebo-api", () => ({
  DoceboApiService: function () {
    return {
      fetchSessions: fetchSessionMock,
      fetchCourses: fetchCoursesMock,
      fetchCategories: fetchCategoriesMock,
      fetchCatalogues: fetchCatalogueMock,
      fetchCertifications: fetchCertificationsMock
    };
  },
  transformCourseCategory: (category: CourseCategory) => category.name
}));

const mockCallback = jest.fn();
const mockGatsbyApi = {
  reporter: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
} as unknown as SourceNodesArgs;

const mockConfigOptions: PluginOptions = {
  apiUrl: "api.com",
  clientId: "abc-123",
  clientSecret: "secret",
  username: "username",
  password: "password",
  plugins: []
};

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  fetchCoursesMock.mockReturnValue([]);
  fetchCatalogueMock.mockReturnValue([]);
  fetchCategoriesMock.mockReturnValue([]);
  fetchCertificationsMock.mockReturnValue([]);
  fetchSessionMock.mockReturnValue([]);
});

describe("source-nodes", () => {
  it("should write categories", async () => {
    const category = createCategory();
    fetchCategoriesMock.mockReturnValue([category]);
    await sourceNodes!(mockGatsbyApi, mockConfigOptions, mockCallback);
    expect(nodeBuilder).toHaveBeenCalledWith({
      itemId: category.id,
      gatsbyApi: mockGatsbyApi,
      input: {
        type: NODE_TYPES.Categories,
        data: category
      }
    });
  });

  it("should write certification", async () => {
    const certification = createCertification();
    fetchCertificationsMock.mockReturnValue([certification]);
    await sourceNodes!(mockGatsbyApi, mockConfigOptions, mockCallback);
    expect(nodeBuilder).toHaveBeenCalledWith({
      gatsbyApi: mockGatsbyApi,
      input: {
        type: NODE_TYPES.Certifications,
        data: certification
      },
      itemId: certification.id_cert
    });
  });

  it("should write courses", async () => {
    const course = createCourse();
    const session = createSession();

    fetchCoursesMock.mockReturnValue([course]);
    fetchSessionMock.mockReturnValue([session]);

    await sourceNodes!(mockGatsbyApi, mockConfigOptions, mockCallback);
    expect(nodeBuilder).toHaveBeenCalledWith({
      gatsbyApi: mockGatsbyApi,
      input: {
        type: NODE_TYPES.Courses,
        data: transformCourse({ ...course, sessions: [session] })
      },
      itemId: course.id_course
    });
  });

  it("should fetch only needed catalogs", async () => {
    const catalogue = createCatalogue();
    fetchCatalogueMock.mockResolvedValue([catalogue]);
    const catalogueIds = "1,2,3,4";

    const configOptions: PluginOptions = {
      ...mockConfigOptions,
      catalogueIds
    };

    await sourceNodes!(mockGatsbyApi, configOptions, mockCallback);

    expect(fetchCatalogueMock).toBeCalledWith({
      catalogueIds: [1, 2, 3, 4]
    });
    expect(nodeBuilder).toHaveBeenCalledWith({
      gatsbyApi: mockGatsbyApi,
      input: {
        type: NODE_TYPES.Catalogues,
        data: catalogue
      },
      itemId: catalogue.catalogue_id
    });
  });

  it("should handle an error correctly", async () => {
    const error = new Error();
    fetchCatalogueMock.mockRejectedValue(error);
    const catalogueIds = "1";

    const configOptions: PluginOptions = {
      ...mockConfigOptions,
      catalogueIds
    };

    await sourceNodes!(mockGatsbyApi, configOptions, mockCallback);
    expect(mockGatsbyApi.reporter.error).toHaveBeenCalledTimes(1);
    expect(mockGatsbyApi.reporter.error).toHaveBeenCalledWith(
      `Did not manage to pull Docebo data. ${JSON.stringify(error)}`
    );
  });
});

describe("pluginOptionsSchema", () => {
  const data = {
    apiUrl: "https://api-url",
    clientId: "client-id",
    clientSecret: "client-secret",
    username: "username",
    password: "password",
    catalogueIds: "1,2,4"
  };

  it("throws an error if 'apiUrl' does not exist", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        apiUrl: undefined
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"apiUrl" is required`]);
  });

  it("throws an error if 'apiUrl' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        apiUrl: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"apiUrl" must be a string`]);
  });

  it("throws an error if 'clientId' does not exist", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        clientId: undefined
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"clientId" is required`]);
  });

  it("throws an error if 'clientId' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        clientId: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"clientId" must be a string`]);
  });

  it("throws an error if 'clientSecret' does not exist", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        clientSecret: undefined
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"clientSecret" is required`]);
  });

  it("throws an error if 'clientSecret' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        clientSecret: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"clientSecret" must be a string`]);
  });

  it("throws an error if 'username' does not exist", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        username: undefined
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"username" is required`]);
  });

  it("throws an error if 'username' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        username: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"username" must be a string`]);
  });

  it("throws an error if 'password' does not exist", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        password: undefined
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"password" is required`]);
  });

  it("throws an error if 'password' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        password: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"password" must be a string`]);
  });

  it("should not throw an error if 'catalogueIds' does not exist", async () => {
    const { isValid } = await testPluginOptionsSchema(pluginOptionsSchema!, {
      ...data,
      catalogueIds: undefined
    });
    expect(isValid).toBeTruthy();
  });

  it("throws an error if 'catalogueIds' is not a string", async () => {
    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema!,
      {
        ...data,
        catalogueIds: {}
      }
    );
    expect(isValid).toBe(false);
    expect(errors).toEqual([`"catalogueIds" must be a string`]);
  });
});
