import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { Request, Response } from "@google-cloud/functions-framework";
import fetchMockJest from "fetch-mock-jest";
import {
  createCatalogue,
  createCatalogueSubItem,
  createExtendedCourse
} from "@bmi/docebo-types";
import {
  createCourseUpdatedEvent,
  createCourseDeletedFromCatalogueEvent,
  createCourseDeletedEvent,
  createMultipleCoursesDeletedEvent,
  createCourseDeletedPayload
} from "./helpers/createEvent";

const deleteByQueryMock = jest.fn();
const getEsClientMock = jest.fn();
const getIndexOperationMock = jest.fn();
const performBulkOperationsMock = jest.fn();

jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: () => getEsClientMock(),
  getIndexOperation: getIndexOperationMock,
  performBulkOperations: performBulkOperationsMock
}));

const fetchCataloguesMock = jest.fn();
const getCourseByIdMock = jest.fn();
jest.mock("@bmi/docebo-api", () => ({
  getCachedDoceboApi: () => ({
    fetchCatalogues: fetchCataloguesMock,
    getCourseById: getCourseByIdMock
  })
}));

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock as typeof fetch;
//needed for fetchRetry
jest.mock("node-fetch", () => fetchMock);

const metadataUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`;
const gcpAuthToken = "gcp-auth-token";
const authHeaders = {
  "php-auth-user": process.env.DOCEBO_API_USERNAME,
  "php-auth-pw": process.env.DOCEBO_API_PASSWORD
};

const catalogueIds =
  process.env.DOCEBO_API_CATALOGUE_IDS?.split(",")?.map(Number);

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  fetchMock.reset();
  getEsClientMock.mockResolvedValue({
    deleteByQuery: deleteByQueryMock
  });
  getIndexOperationMock.mockImplementation(() => []);
});

const handleRequest = async (request: Request, response: Response) =>
  (await import("../index")).handleRequest(request, response);

describe("handleRequest", () => {
  it("returns 500 if BUILD_TRIGGER_ENDPOINT is not provided", async () => {
    const originBuildTriggerEndpoint = process.env.BUILD_TRIGGER_ENDPOINT;
    delete process.env.BUILD_TRIGGER_ENDPOINT;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.BUILD_TRIGGER_ENDPOINT = originBuildTriggerEndpoint;
  });

  it("returns 500 if DOCEBO_API_URL is not provided", async () => {
    const originDoceboApiUrl = process.env.DOCEBO_API_URL;
    delete process.env.DOCEBO_API_URL;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_URL = originDoceboApiUrl;
  });

  it("returns 500 if DOCEBO_API_CLIENT_ID is not provided", async () => {
    const originDoceboApiClientId = process.env.DOCEBO_API_CLIENT_ID;
    delete process.env.DOCEBO_API_CLIENT_ID;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_CLIENT_ID = originDoceboApiClientId;
  });

  it("returns 500 if DOCEBO_API_CLIENT_SECRET is not provided", async () => {
    const originDoceboApiClientSecret = process.env.DOCEBO_API_CLIENT_SECRET;
    delete process.env.DOCEBO_API_CLIENT_SECRET;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_CLIENT_SECRET = originDoceboApiClientSecret;
  });

  it("returns 500 if DOCEBO_API_USERNAME is not provided", async () => {
    const originDoceboApiUsername = process.env.DOCEBO_API_USERNAME;
    delete process.env.DOCEBO_API_USERNAME;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_USERNAME = originDoceboApiUsername;
  });

  it("returns 500 if DOCEBO_API_PASSWORD is not provided", async () => {
    const originDoceboApiPassword = process.env.DOCEBO_API_PASSWORD;
    delete process.env.DOCEBO_API_PASSWORD;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_PASSWORD = originDoceboApiPassword;
  });

  it("returns 500 if DOCEBO_API_CATALOGUE_IDS is not provided", async () => {
    const originDoceboApiCatalogIds = process.env.DOCEBO_API_CATALOGUE_IDS;
    delete process.env.DOCEBO_API_CATALOGUE_IDS;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.DOCEBO_API_CATALOGUE_IDS = originDoceboApiCatalogIds;
  });

  it("returns 500 if ES_APIKEY is not provided", async () => {
    const originEsApiKey = process.env.ES_APIKEY;
    delete process.env.ES_APIKEY;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.ES_APIKEY = originEsApiKey;
  });

  it("returns 500 if ES_CLOUD_ID is not provided", async () => {
    const originEsCloudId = process.env.ES_CLOUD_ID;
    delete process.env.ES_CLOUD_ID;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.ES_CLOUD_ID = originEsCloudId;
  });

  it("returns 500 if ES_INDEX_NAME_TRAININGS is not provided", async () => {
    const originEsIndexNameTrainings = process.env.ES_INDEX_NAME_TRAININGS;
    delete process.env.ES_INDEX_NAME_TRAININGS;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.ES_INDEX_NAME_TRAININGS = originEsIndexNameTrainings;
  });

  it("returns 401 if 'php-auth-user' header is not correct", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: { ...authHeaders, "php-auth-user": "wrong-user-name" }
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 401 if 'php-auth-pw' header is not correct", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: { ...authHeaders, "php-auth-pw": "wrong-user-password" }
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 if request body does not contain 'event' field", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: { ...createCourseUpdatedEvent(), event: undefined },
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Event was not provided"
    });
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 if event==='course.updated' and 'course_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent({ course_id: undefined }),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "course_id was not provided"
    });
  });

  it("returns 400 if event==='catalog.course.deleted' and 'catalog_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent({ catalog_id: undefined }),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "catalog_id or course_id was not provided"
    });
  });

  it("returns 400 if event==='catalog.course.deleted' and 'course_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent({ course_id: undefined }),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "catalog_id or course_id was not provided"
    });
  });

  it("returns 400 if event==='course.deleted' and both 'payload' and 'payloads field do not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: {
        ...createCourseDeletedEvent(),
        payload: undefined,
        payloads: undefined
      },
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "payload was not provided"
    });
  });

  it("returns 500 if getEsClient function throws an error", async () => {
    const error = new Error("Did not manage to get ES client");
    getEsClientMock.mockRejectedValue(error);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(getEsClientMock).toHaveBeenCalledTimes(1);
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 400 if event==='course.deleted' with single payload and if there is no 'course_id' field", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedEvent({ course_id: undefined }),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "No courses to delete" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 400 if event==='course.deleted' with multiple payloads and if there is no 'course_id' field in all courses", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: {
        ...createMultipleCoursesDeletedEvent(),
        payloads: [
          createCourseDeletedPayload({ course_id: undefined }),
          createCourseDeletedPayload({ course_id: undefined })
        ]
      },
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "No courses to delete"
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("deletes course and returns 200 if event==='course.deleted' with single payload", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          terms: { courseId: [req.body.payload.course_id] }
        }
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("deletes course and returns 200 if event==='course.deleted' with multiple payload", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const event = createMultipleCoursesDeletedEvent();
    const idsToDelete = event.payloads.map(({ course_id }) => course_id);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleCoursesDeletedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          terms: { courseId: idsToDelete }
        }
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("filters out payloads with 'course_id: undefined' if event==='course.deleted'", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const event = createMultipleCoursesDeletedEvent([
      createCourseDeletedPayload({ course_id: undefined }),
      createCourseDeletedPayload({ course_id: undefined })
    ]);
    const idsToDelete = event.payloads
      .map(({ course_id }) => course_id)
      .filter(Boolean);

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleCoursesDeletedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          terms: { courseId: idsToDelete }
        }
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("deletes course and returns 200 if event==='catalog.course.deleted'", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(deleteByQueryMock).toHaveBeenCalledWith({
      index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
      body: {
        query: {
          match: {
            "id.keyword": `${req.body.payload.course_id}-${req.body.payload.catalog_id}`
          }
        }
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 500 if event==='course.updated' and 'getCourseById' does not return any course", async () => {
    getCourseByIdMock.mockResolvedValue(undefined);
    const event = createCourseUpdatedEvent();
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: Course with "course_id: ${event.payload.course_id}" does not exist`
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 500 if event==='course.updated' and 'getCourseById' throws an error", async () => {
    const error = new Error("expected error");
    getCourseByIdMock.mockRejectedValue(error);
    const event = createCourseUpdatedEvent();
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 500 if event==='course.updated' and 'fetchCatalogues' throws an error", async () => {
    const error = new Error("expected error");
    const course = createExtendedCourse({ id: 1 });
    getCourseByIdMock.mockResolvedValue(course);
    fetchCataloguesMock.mockRejectedValue(error);
    const event = createCourseUpdatedEvent({ course_id: course.id });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("works correctly if course does not belong to any catalogue", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );
    const course = createExtendedCourse({ id: 1 });
    getCourseByIdMock.mockResolvedValue(course);
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({ sub_items: [createCatalogueSubItem({ item_id: "2" })] })
    ]);
    const event = createCourseUpdatedEvent({ course_id: course.id });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 500 if getIndexOperation throws an error", async () => {
    getIndexOperationMock.mockRestore();
    getIndexOperationMock.mockImplementation(() => {
      throw new Error("Expected error from getIndexOperationMock");
    });
    const course = createExtendedCourse({ id: 1 });
    getCourseByIdMock.mockResolvedValue(course);
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: "1" })]
      })
    ]);
    const event = createCourseUpdatedEvent({ course_id: course.id });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong: Expected error from getIndexOperationMock"
    });
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(getIndexOperationMock).toHaveBeenCalled();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 500 if performBulkOperationsMock throws an error", async () => {
    performBulkOperationsMock.mockImplementation(() => {
      throw new Error("Expected error from performBulkOperationsMock");
    });
    const course = createExtendedCourse({ id: 1 });
    getCourseByIdMock.mockResolvedValue(course);
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: "1" })]
      })
    ]);
    const event = createCourseUpdatedEvent({ course_id: course.id });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message:
        "Something went wrong: Expected error from performBulkOperationsMock"
    });
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(getIndexOperationMock).toHaveBeenCalled();
    expect(performBulkOperationsMock).toHaveBeenCalled();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(deleteByQueryMock).not.toHaveBeenCalled();
  });

  it("updates training and returns 200 if event==='course.updated'", async () => {
    mockResponses(
      fetchMock,
      {
        url: metadataUrl,
        method: "GET",
        headers: { "Metadata-Flavor": "Google" },
        body: gcpAuthToken
      },
      {
        url: process.env.BUILD_TRIGGER_ENDPOINT,
        method: "POST"
      }
    );
    const course = createExtendedCourse({ id: 1 });
    getCourseByIdMock.mockResolvedValue(course);
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: "1" })]
      })
    ]);
    const event = createCourseUpdatedEvent({ course_id: course.id });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: event,
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(getIndexOperationMock).toHaveBeenCalled();
    expect(performBulkOperationsMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveFetched(metadataUrl, {
      method: "GET",
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    expect(fetchMock).toHaveFetched(process.env.BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${gcpAuthToken}`
      },
      body: { isFullFetch: false }
    });
    expect(deleteByQueryMock).not.toHaveBeenCalled();
  });

  it("returns 400 if unexpected event received", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: { ...createCourseDeletedEvent(), event: "unexpected-event" },
      headers: authHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: `Received unexpected event - "${req.body.event}"`
    });
    expect(getEsClientMock).not.toHaveBeenCalledTimes(1);
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });
});
