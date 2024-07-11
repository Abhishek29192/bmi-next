import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import getContentfulData from "../getContentfulData";

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock as typeof fetch;

jest.mock("gqlmin", () => ({
  __esModule: true,
  default: (query: string) => query
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("getContentfulData", () => {
  it("should fetch data with the correct parameters", async () => {
    const responseData = { data: { example: "exampleData" } };
    mockResponses(fetchMock, {
      url: `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      method: "POST",
      status: 200,
      body: responseData
    });

    const query = "query { example }";
    const variables = { exampleVar: "exampleValue" };

    const result = await getContentfulData(query, variables);

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      }
    );

    expect(result).toEqual(responseData);
  });

  it("should handle errors response correctly", async () => {
    const query = "query { example }";
    const variables = { exampleVar: "exampleValue" };
    const responseData = {
      errors: ["error-1", "error-2"]
    };

    mockResponses(fetchMock, {
      url: `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      method: "POST",
      status: 200,
      body: responseData
    });

    const result = await getContentfulData(query, variables);

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      }
    );

    expect(result).toEqual(responseData);
  });

  it("should send variables as an empty object if not provided", async () => {
    const query = "query { example }";

    mockResponses(fetchMock, {
      url: `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      method: "POST",
      status: 200,
      body: {}
    });

    await getContentfulData(query);

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      }
    );
  });

  it("should throw an error if fetch request fails", async () => {
    const error = new Error("Something went wrong");
    const query = "query { example }";
    const variables = { exampleVar: "exampleValue" };

    mockResponses(fetchMock, {
      url: `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      method: "POST",
      body: {},
      status: 401,
      error
    });

    await expect(getContentfulData(query, variables)).rejects.toThrow(error);

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          query,
          variables
        })
      }
    );
  });
});
