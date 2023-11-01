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
import { saveById, getMessageStatus } from "../firestore";
import { MessageStatus } from "../types";
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
  ...jest.requireActual("@bmi/docebo-api"),
  getCachedDoceboApi: () => ({
    fetchCatalogues: fetchCataloguesMock,
    getCourseById: getCourseByIdMock
  })
}));

const saveDoceboWebhookMessageMock = jest.fn();
const getDoceboWebhookMessageStatus = jest.fn();
jest.mock("../firestore", () => ({
  saveById: (...args: Parameters<typeof saveById>) =>
    saveDoceboWebhookMessageMock(...args),
  getMessageStatus: (...args: Parameters<typeof getMessageStatus>) =>
    getDoceboWebhookMessageStatus(...args)
}));

const fetchMock = fetchMockJest.sandbox();
global.fetch = fetchMock as typeof fetch;
//needed for fetchRetry
jest.mock("node-fetch", () => fetchMock);

const metadataUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${process.env.BUILD_TRIGGER_ENDPOINT}`;
const gcpAuthToken = "gcp-auth-token";
const defaultHeaders = {
  authorization: `Basic ${btoa(
    `${process.env.DOCEBO_API_USERNAME}:${process.env.DOCEBO_API_PASSWORD}`
  )}`
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
  it("returns 500 if GCP_PROJECT_ID is not provided", async () => {
    const originGcpProjectId = process.env.GCP_PROJECT_ID;
    delete process.env.GCP_PROJECT_ID;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.GCP_PROJECT_ID = originGcpProjectId;
  });

  it("returns 500 if FIRESTORE_ROOT_COLLECTION is not provided", async () => {
    const originFirestoreRootCollection = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.FIRESTORE_ROOT_COLLECTION = originFirestoreRootCollection;
  });

  it("returns 500 if BUILD_TRIGGER_ENDPOINT is not provided", async () => {
    const originBuildTriggerEndpoint = process.env.BUILD_TRIGGER_ENDPOINT;
    delete process.env.BUILD_TRIGGER_ENDPOINT;

    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
    process.env.ES_INDEX_NAME_TRAININGS = originEsIndexNameTrainings;
  });

  it("returns 400 if message_id field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: { ...createCourseUpdatedEvent(), message_id: undefined },
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "message_id was not provided"
    });
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 200 if message status is 'InProgress'", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    getDoceboWebhookMessageStatus.mockResolvedValue(MessageStatus.InProgress);

    await handleRequest(req, res);

    expect(getDoceboWebhookMessageStatus).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      req.body.message_id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "This event has been already handled"
    });
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 200 if message status is 'Succeeded'", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    getDoceboWebhookMessageStatus.mockResolvedValue(MessageStatus.Succeeded);

    await handleRequest(req, res);

    expect(getDoceboWebhookMessageStatus).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      req.body.message_id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "This event has been already handled"
    });
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 401 if 'authorization' header is not correct", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: { ...defaultHeaders, authorization: "fake auth token" }
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 if request body does not contain 'event' field", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: { ...createCourseUpdatedEvent(), event: undefined },
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Event was not provided"
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns 400 if event==='course.updated' and 'course_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent({ course_id: undefined }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(res.send).toHaveBeenCalledWith({
      message: "course_id was not provided"
    });
  });

  it("returns 400 if event==='catalog.course.deleted' and 'catalog_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent({ catalog_id: undefined }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "catalog_id or course_id was not provided"
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
  });

  it("returns 400 if event==='catalog.course.deleted' and 'course_id' field does not exist", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent({ course_id: undefined }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "catalog_id or course_id was not provided"
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "payload was not provided"
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
  });

  it("returns 500 if getEsClient function throws an error", async () => {
    const error = new Error("Did not manage to get ES client");
    getEsClientMock.mockRejectedValue(error);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent(),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: "No courses to delete" });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "No courses to delete"
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
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
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
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
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
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
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
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
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });

  it("returns 400 if event==='course.updated' and 'getCourseById' does not return any course", async () => {
    getCourseByIdMock.mockResolvedValue(undefined);
    const event = createCourseUpdatedEvent();
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent(),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: `Course with "course_id: ${event.payload.course_id}" does not exist`
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(res.send).toHaveBeenCalledWith({
      message: `Something went wrong: ${error.message}`
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(fetchMock).toHaveBeenCalledTimes(0);
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Something went wrong: Expected error from getIndexOperationMock"
    });
    expect(getCourseByIdMock).toHaveBeenCalledWith(event.payload.course_id);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({ catalogueIds });
    expect(getIndexOperationMock).toHaveBeenCalled();
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );

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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
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
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
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
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Succeeded
      }
    );
    expect(deleteByQueryMock).not.toHaveBeenCalled();
  });

  it("returns 400 if unexpected event received", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: { ...createCourseDeletedEvent(), event: "unexpected-event" },
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.InProgress
      }
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: `Received unexpected event - "${req.body.event}"`
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(getEsClientMock).not.toHaveBeenCalledTimes(1);
    expect(deleteByQueryMock).not.toHaveBeenCalled();
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
    expect(performBulkOperationsMock).not.toHaveBeenCalled();
  });
});
