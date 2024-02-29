import {
  mockRequest,
  mockResponse,
  mockResponses
} from "@bmi-digital/fetch-mocks";
import { createCatalogue, createCatalogueSubItem } from "@bmi/docebo-types";
import { Request, Response } from "@google-cloud/functions-framework";
import fetchMockJest from "fetch-mock-jest";
import {
  deleteCourses,
  deleteCoursesFromCatalogue,
  deleteSessions,
  updateCourses,
  updateSessions
} from "../esOperations";
import { getMessageStatus, saveById } from "../firestore";
import { EventType, MessageStatus } from "../types";
import {
  createCourseDeletedEvent,
  createCourseDeletedFromCatalogueEvent,
  createCourseUpdatedEvent,
  createMultipleCoursesDeletedEvent,
  createMultipleCoursesDeletedFromCatalogueEvent,
  createMultipleCoursesUpdatedEvent,
  createMultipleSessionsDeletedEvent,
  createMultipleSessionsUpdatedEvent,
  createSessionDeletedEvent,
  createSessionUpdatedEvent
} from "./helpers/createEvent";

const getEsClientMock = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getEsClient: () => getEsClientMock()
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

const deleteCoursesMock = jest.fn();
const deleteCoursesFromCatalogueMock = jest.fn();
const deleteSessionsMock = jest.fn();
const updateCoursesMock = jest.fn();
const updateSessionsMock = jest.fn();
jest.mock("../esOperations", () => ({
  deleteCourses: (...args: Parameters<typeof deleteCourses>) =>
    deleteCoursesMock(...args),
  deleteCoursesFromCatalogue: (
    ...args: Parameters<typeof deleteCoursesFromCatalogue>
  ) => deleteCoursesFromCatalogueMock(...args),
  deleteSessions: (...args: Parameters<typeof deleteSessions>) =>
    deleteSessionsMock(...args),
  updateCourses: (...args: Parameters<typeof updateCourses>) =>
    updateCoursesMock(...args),
  updateSessions: (...args: Parameters<typeof updateSessions>) =>
    updateSessionsMock(...args)
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

  it("returns 500 if DOCEBO_API_CATALOGUE_IDS contains unexpected values", async () => {
    const originDoceboApiCatalogIds = process.env.DOCEBO_API_CATALOGUE_IDS;
    process.env.DOCEBO_API_CATALOGUE_IDS = "fake-value1,fake-value-2";

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

  it("returns 400 if request body does not have payload nor payloads", async () => {
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: {
        event: EventType.courseUpdated,
        fired_by_batch_action: false,
        message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303"
      },
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "payload was not provided"
    });
    expect(getDoceboWebhookMessageStatus).not.toHaveBeenCalled();
    expect(saveDoceboWebhookMessageMock).not.toHaveBeenCalled();
    expect(getEsClientMock).not.toHaveBeenCalled();
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

  it("returns 400 if eventType === 'course.updated' and course does not belong to the allowed catalogues", async () => {
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({ catalogue_id: catalogueIds?.[0], sub_items: [] })
    ]);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent({ course_id: 1 }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Courses with ID 1 do not belong to allowed catalogues"
    });
    expect(updateCoursesMock).not.toHaveBeenCalled();
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns error if 'updateCourses' function returns an error", async () => {
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateCoursesMock.mockResolvedValue({
      errorCode: 400,
      errorMessage: "Provided course can not be updated"
    });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Provided course can not be updated"
    });
    expect(updateCoursesMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseIds: [courseId],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock()
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
  });

  it("returns 200 if courses have been updated successfully", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateCoursesMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseUpdatedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(updateCoursesMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseIds: [courseId],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock()
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
  });

  it("calls 'updateCourses' correctly if multiple courses have been updated", async () => {
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
    const course1Id = 1;
    const course2Id = 2;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [
        createCatalogueSubItem({ item_id: course1Id.toString() }),
        createCatalogueSubItem({ item_id: course2Id.toString() })
      ]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateCoursesMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleCoursesUpdatedEvent([
        {
          fired_at: "2023-09-21 13:35:33",
          course_id: course1Id,
          name: "Course name",
          code: "course-code",
          type: "elearning",
          update_date: "2023-09-21 13:35:33",
          language: "english_uk",
          duration: 0,
          start_date: "2023-09-21",
          end_date: "2030-10-24"
        },
        {
          fired_at: "2023-09-21 13:35:33",
          course_id: course2Id,
          name: "Course name",
          code: "course-code",
          type: "elearning",
          update_date: "2023-09-21 13:35:33",
          language: "english_uk",
          duration: 0,
          start_date: "2023-09-21",
          end_date: "2030-10-24"
        }
      ]),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(updateCoursesMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseIds: [course1Id, course2Id],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock()
    });
  });

  it("returns 400 if eventType === 'session.updated' and course does not belong to the allowed catalogues", async () => {
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({ catalogue_id: catalogueIds?.[0], sub_items: [] })
    ]);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionUpdatedEvent({ course_id: 1 }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Courses with ID 1 do not belong to allowed catalogues"
    });
    expect(updateSessionsMock).not.toHaveBeenCalled();
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
    expect(getEsClientMock).not.toHaveBeenCalled();
  });

  it("returns error if 'updateSessions' function returns an error", async () => {
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue({
      errorCode: 400,
      errorMessage: "Provided sessions can not be updated"
    });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionUpdatedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Provided sessions can not be updated"
    });
    expect(updateSessionsMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseId,
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
  });

  it("returns 200 if sessions have been updated successfully", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionUpdatedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(updateSessionsMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseId,
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
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
  });

  it("calls 'updateSessions' correctly if multiple sessions have been updated", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleSessionsUpdatedEvent([
        {
          fired_at: "2024-02-07 11:42:12",
          course_id: 1,
          course_code: "course code",
          session_id: 1,
          session_code: "session 1 code",
          session_name: "session 1 name",
          migrated_webinar_session_id: null
        },
        {
          fired_at: "2024-02-07 11:42:12",
          course_id: 1,
          course_code: "course code",
          session_id: 2,
          session_code: "session 1 code",
          session_name: "session 1 name",
          migrated_webinar_session_id: null
        }
      ]),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(updateSessionsMock).toHaveBeenCalledWith({
      catalogues: [catalogue],
      courseId,
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
    });
  });

  it("returns 400 if eventType === 'session.deleted' and course does not belong to the allowed catalogues", async () => {
    fetchCataloguesMock.mockResolvedValue([
      createCatalogue({ catalogue_id: catalogueIds?.[0], sub_items: [] })
    ]);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionDeletedEvent({ course_id: 1 }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Courses with ID 1 do not belong to allowed catalogues"
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

  it("returns error if 'deleteSessions' function returns an error", async () => {
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    deleteSessionsMock.mockResolvedValue({
      errorCode: 400,
      errorMessage: "Provided sessions can not be deleted"
    });
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionDeletedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Provided sessions can not be deleted"
    });
    expect(deleteSessionsMock).toHaveBeenCalledWith({
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
    });
    expect(saveDoceboWebhookMessageMock).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION,
      {
        id: req.body.message_id,
        status: MessageStatus.Failed
      }
    );
  });

  it("returns 200 if sessions have been deleted successfully", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    deleteSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createSessionDeletedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(deleteSessionsMock).toHaveBeenCalledWith({
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
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
  });

  it("calls 'deleteSessions' correctly if multiple sessions have been deleted", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleSessionsDeletedEvent([
        {
          fired_at: "2024-02-07 11:42:12",
          course_id: 1,
          course_code: "course code",
          session_id: 1,
          session_code: "session 1 code",
          session_name: "session 1 name",
          migrated_webinar_session_id: null
        },
        {
          fired_at: "2024-02-07 11:42:12",
          course_id: 1,
          course_code: "course code",
          session_id: 2,
          session_code: "session 1 code",
          session_name: "session 1 name",
          migrated_webinar_session_id: null
        }
      ]),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(deleteSessionsMock).toHaveBeenCalledWith({
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
    });
  });

  it("returns 200 if courses have been deleted successfully", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedEvent({ course_id: courseId }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(deleteCoursesMock).toHaveBeenCalledWith({
      courseIds: [courseId],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock()
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
  });

  it("calls 'deleteCourses' correctly if multiple courses have been deleted", async () => {
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
    const course1Id = 1;
    const course2Id = 2;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [
        createCatalogueSubItem({ item_id: course1Id.toString() }),
        createCatalogueSubItem({ item_id: course2Id.toString() })
      ]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleCoursesDeletedEvent([
        {
          fired_at: "2023-09-21 13:35:33",
          course_id: course1Id,
          name: "Course name",
          code: "course-code",
          type: "elearning",
          deletion_date: "2023-09-21 13:35:33",
          language: "english_uk",
          duration: 0,
          start_date: "2023-09-21",
          end_date: "2030-10-24"
        },
        {
          fired_at: "2023-09-21 13:35:33",
          course_id: course2Id,
          name: "Course name",
          code: "course-code",
          type: "elearning",
          deletion_date: "2023-09-21 13:35:33",
          language: "english_uk",
          duration: 0,
          start_date: "2023-09-21",
          end_date: "2030-10-24"
        }
      ]),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(deleteCoursesMock).toHaveBeenCalledWith({
      courseIds: [course1Id, course2Id],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock()
    });
  });

  it("returns 200 if courses have been deleted from catalogue successfully", async () => {
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
    const courseId = 1;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [createCatalogueSubItem({ item_id: courseId.toString() })]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createCourseDeletedFromCatalogueEvent({ course_id: courseId }),
      headers: defaultHeaders
    });
    await handleRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(deleteCoursesFromCatalogueMock).toHaveBeenCalledWith({
      allowedCatalogueIds: catalogueIds,
      courseIds: [courseId],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
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
  });

  it("calls 'deleteCoursesFromCatalogue' correctly if multiple courses have been deleted", async () => {
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
    const course1Id = 1;
    const course2Id = 2;
    const catalogue = createCatalogue({
      catalogue_id: catalogueIds?.[0],
      sub_items: [
        createCatalogueSubItem({ item_id: course1Id.toString() }),
        createCatalogueSubItem({ item_id: course2Id.toString() })
      ]
    });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    updateSessionsMock.mockResolvedValue(undefined);
    const res = mockResponse();
    const req = mockRequest({
      method: "POST",
      body: createMultipleCoursesDeletedFromCatalogueEvent([
        {
          fired_at: "2023-09-22 08:46:42",
          catalog_id: 1,
          course_id: course1Id
        },
        {
          fired_at: "2023-09-22 08:46:42",
          catalog_id: 1,
          course_id: course2Id
        }
      ]),
      headers: defaultHeaders
    });

    await handleRequest(req, res);

    expect(deleteCoursesFromCatalogueMock).toHaveBeenCalledWith({
      allowedCatalogueIds: catalogueIds,
      courseIds: [course1Id, course2Id],
      doceboMessageId: req.body.message_id,
      esClient: getEsClientMock(),
      req
    });
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
    expect(getCourseByIdMock).not.toHaveBeenCalled();
    expect(fetchCataloguesMock).not.toHaveBeenCalled();
  });
});
