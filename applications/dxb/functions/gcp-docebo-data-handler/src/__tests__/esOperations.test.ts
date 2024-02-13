import { mockRequest } from "@bmi-digital/fetch-mocks";
import {
  createCatalogue,
  createCatalogueSubItem,
  createCourseSession,
  createExtendedCourse
} from "@bmi/docebo-types";
import { createTraining as createESTraining } from "@bmi/elasticsearch-types";
import {
  getIndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";
import {
  deleteCourses,
  deleteCoursesFromCatalogue,
  deleteSessions,
  updateCourses,
  updateSessions
} from "../esOperations";
import {
  createCourseDeletedFromCatalogueEvent,
  createMultipleCoursesDeletedFromCatalogueEvent,
  createMultipleSessionsDeletedEvent,
  createMultipleSessionsUpdatedEvent,
  createSessionDeletedEvent,
  createSessionUpdatedEvent
} from "./helpers/createEvent";
import type { Client } from "@elastic/elasticsearch";

const esSearchMock = jest.fn();
const esClientMock = {
  deleteByQuery: jest.fn(),
  search: esSearchMock
} as unknown as Client;

const getIndexOperationMock = jest.fn();
jest.mock("@bmi/functions-es-client", () => ({
  getIndexOperation: (...args: Parameters<typeof getIndexOperation>) =>
    getIndexOperationMock(...args),
  performBulkOperations: jest.fn()
}));

const getCourseByIdMock = jest.fn();
const getCurrencyMock = jest.fn();
jest.mock("@bmi/docebo-api", () => ({
  ...jest.requireActual("@bmi/docebo-api"),
  getCachedDoceboApi: () => ({
    getCourseById: getCourseByIdMock,
    getCurrency: getCurrencyMock
  })
}));

afterEach(() => {
  jest.resetAllMocks();
});

beforeEach(() => {
  getCurrencyMock.mockResolvedValue({
    currency_currency: "EUR",
    currency_symbol: "€"
  });
  getIndexOperationMock.mockReturnValue(["index-operation"]);
  esSearchMock.mockResolvedValue({ body: { hits: { hits: [] } } });
});

const webhookMessageId = "dc158028-e6ce-4f9f-a076-aa436a913eee";

describe("esOperations", () => {
  describe("deleteCourses", () => {
    it("deletes courses based on passed IDs", async () => {
      const courseIds = [1, 2, 3];
      await deleteCourses({
        courseIds,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });

      expect(esClientMock.deleteByQuery).toHaveBeenCalledTimes(1);
      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { courseId: courseIds }
          }
        }
      });
    });
  });

  describe("deleteCoursesFromCatalogue", () => {
    it("returns an error if provided catalogue ID does not match allowedCatalogueIds", async () => {
      const req = mockRequest({
        body: createCourseDeletedFromCatalogueEvent({ catalog_id: 111 })
      });
      const res = await deleteCoursesFromCatalogue({
        allowedCatalogueIds: [1],
        courseIds: [1, 2],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req
      });

      expect(res).toEqual({
        errorCode: 400,
        errorMessage: "Provided catalogues are not supported by this market"
      });
      expect(esClientMock.deleteByQuery).not.toHaveBeenCalled();
    });

    it("deletes courses if single-payload event provided", async () => {
      const catalogueId = 1;
      const courseIds = [1, 2];
      const req = mockRequest({
        body: createCourseDeletedFromCatalogueEvent({
          catalog_id: catalogueId
        })
      });
      await deleteCoursesFromCatalogue({
        allowedCatalogueIds: [catalogueId],
        courseIds: courseIds,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req
      });

      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            bool: {
              must: [
                { terms: { courseId: courseIds } },
                {
                  terms: {
                    "catalogueId.keyword": [catalogueId]
                  }
                }
              ]
            }
          }
        }
      });
    });

    it("deletes courses if multiple payloads provided", async () => {
      const courseId = 1;
      const req = mockRequest({
        body: createMultipleCoursesDeletedFromCatalogueEvent([
          {
            fired_at: "2023-09-22 08:46:42",
            catalog_id: 1,
            course_id: courseId
          },
          {
            fired_at: "2023-09-22 08:46:42",
            catalog_id: 2,
            course_id: courseId
          }
        ])
      });
      await deleteCoursesFromCatalogue({
        allowedCatalogueIds: [1, 2],
        courseIds: [courseId],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req
      });

      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            bool: {
              must: [
                { terms: { courseId: [courseId] } },
                {
                  terms: {
                    "catalogueId.keyword": [1, 2]
                  }
                }
              ]
            }
          }
        }
      });
    });
  });

  describe("deleteSessions", () => {
    it("deletes a session if a single-payload event provided", async () => {
      const req = mockRequest({
        body: createSessionDeletedEvent({ session_id: 1 })
      });

      await deleteSessions({
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req
      });
      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { sessionId: [1] }
          }
        }
      });
    });

    it("deletes a session if multiple payloads provided", async () => {
      const req = mockRequest({
        body: createMultipleSessionsDeletedEvent([
          {
            fired_at: "2024-02-05 16:26:37",
            course_id: 1,
            course_code: "Course code",
            session_id: 1,
            session_code: "Session 1 code",
            session_name: "Session 1 name",
            migrated_webinar_session_id: null
          },
          {
            fired_at: "2024-02-05 16:26:37",
            course_id: 1,
            course_code: "Course code",
            session_id: 2,
            session_code: "Session 2 code",
            session_name: "Session 2 name",
            migrated_webinar_session_id: null
          }
        ])
      });

      await deleteSessions({
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req
      });
      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { sessionId: [1, 2] }
          }
        }
      });
    });
  });

  describe("updateCourses", () => {
    it("returns an error if 'getCourseById' returns undefined", async () => {
      const catalogue = createCatalogue();
      getCourseByIdMock.mockResolvedValue(undefined);

      const res = await updateCourses({
        catalogues: [catalogue],
        courseIds: [1, 2],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });

      expect(res).toEqual({
        errorCode: 500,
        errorMessage:
          "Did not manage to get courses with the following IDs: 1, 2"
      });
      expect(getCourseByIdMock).toHaveBeenCalledTimes(2);
      expect(getCourseByIdMock).toHaveBeenCalledWith(1);
      expect(getCourseByIdMock).toHaveBeenCalledWith(2);
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("returns an error if 'getCurrency' returns undefined", async () => {
      const catalogue = createCatalogue();
      const course = createExtendedCourse();
      getCourseByIdMock.mockResolvedValue(course);
      getCurrencyMock.mockResolvedValue(undefined);

      const res = await updateCourses({
        catalogues: [catalogue],
        courseIds: [course.id],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });

      expect(res).toEqual({
        errorCode: 500,
        errorMessage: "Did not manage to get currency"
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("returns an error if a course does not have sessions", async () => {
      const course = createExtendedCourse({ sessions: undefined });
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });
      getCourseByIdMock.mockResolvedValue(course);

      const res = await updateCourses({
        catalogues: [catalogue],
        courseIds: [course.id],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });
      expect(res).toEqual({
        errorCode: 400,
        errorMessage: "Given courses do not have active sessions"
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("returns an error if a course does not have sessions planned for the future", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() - 3600);
      const course = createExtendedCourse({
        sessions: [
          createCourseSession({ start_date: sessionStartDate.toString() })
        ]
      });
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });
      getCourseByIdMock.mockResolvedValue(course);

      const res = await updateCourses({
        catalogues: [catalogue],
        courseIds: [course.id],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });
      expect(res).toEqual({
        errorCode: 400,
        errorMessage: "Given courses do not have active sessions"
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("indexes a course if it has a session planned for the future", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session = createCourseSession({
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session] });
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });
      getCourseByIdMock.mockResolvedValue(course);

      await updateCourses({
        catalogues: [catalogue],
        courseIds: [course.id],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });
      expect(getIndexOperationMock).toHaveBeenCalledTimes(1);
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-298-1",
          sessionId: session.id_session,
          sessionName: session.name,
          sessionSlug: session.slug_name,
          startDate: session.start_date,
          endDate: session.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: course.category.name,
          onSale: course.on_sale,
          price: course.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue.catalogue_id.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        },
        "1-298-1"
      );
      expect(performBulkOperations).toHaveBeenCalledTimes(1);
    });

    it("indexes data correctly if multiple courses and catalogues provided", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session1 = createCourseSession({
        id_session: 1,
        start_date: sessionStartDate.toString(),
        name: "Session 1",
        slug_name: "session-1"
      });
      const session2 = createCourseSession({
        id_session: 2,
        start_date: sessionStartDate.toString(),
        name: "Session 2",
        slug_name: "session-2"
      });
      const course1 = createExtendedCourse({ id: 1, sessions: [session1] });
      const course2 = createExtendedCourse({ id: 2, sessions: [session2] });
      const catalogue1 = createCatalogue({
        catalogue_id: 1,
        sub_items: [createCatalogueSubItem({ item_id: course1.id.toString() })]
      });
      const catalogue2 = createCatalogue({
        catalogue_id: 2,
        sub_items: [createCatalogueSubItem({ item_id: course2.id.toString() })]
      });
      getCourseByIdMock
        .mockResolvedValueOnce(course1)
        .mockResolvedValueOnce(course2);

      await updateCourses({
        catalogues: [catalogue1, catalogue2],
        courseIds: [course1.id, course2.id],
        doceboMessageId: webhookMessageId,
        esClient: esClientMock
      });
      expect(getIndexOperationMock).toHaveBeenCalledTimes(2);
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-1-1",
          sessionId: session1.id_session,
          sessionName: session1.name,
          sessionSlug: session1.slug_name,
          startDate: session1.start_date,
          endDate: session1.end_date,
          courseId: course1.id,
          courseName: course1.name,
          courseSlug: course1.slug_name,
          courseCode: course1.code,
          courseType: course1.type,
          courseImg: course1.thumbnail,
          category: course1.category.name,
          onSale: course1.on_sale,
          price: course1.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue1.catalogue_id.toString(),
          catalogueName: catalogue1.catalogue_name,
          catalogueDescription: catalogue1.catalogue_description
        },
        "1-1-1"
      );
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "2-2-2",
          sessionId: session2.id_session,
          sessionName: session2.name,
          sessionSlug: session2.slug_name,
          startDate: session2.start_date,
          endDate: session2.end_date,
          courseId: course2.id,
          courseName: course2.name,
          courseSlug: course2.slug_name,
          courseCode: course2.code,
          courseType: course2.type,
          courseImg: course2.thumbnail,
          category: course2.category.name,
          onSale: course2.on_sale,
          price: course2.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue2.catalogue_id.toString(),
          catalogueName: catalogue2.catalogue_name,
          catalogueDescription: catalogue2.catalogue_description
        },
        "2-2-2"
      );
      expect(performBulkOperations).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateSessions", () => {
    it("returns an error if course ID was not provided", async () => {
      const res = await updateSessions({
        catalogues: [createCatalogue()],
        courseId: undefined,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({ body: createSessionUpdatedEvent() })
      });

      expect(res).toEqual({
        errorCode: 400,
        errorMessage: "courseId was not provided"
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("returns an error if 'getCourseById' returns undefined", async () => {
      const courseId = 1;
      getCourseByIdMock.mockResolvedValue(undefined);
      const res = await updateSessions({
        catalogues: [createCatalogue()],
        courseId,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({ body: createSessionUpdatedEvent() })
      });

      expect(res).toEqual({
        errorCode: 500,
        errorMessage: "Did not manage to get docebo course with ID: 1"
      });
      expect(getCourseByIdMock).toHaveBeenCalledWith(courseId);
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("returns an error if sessions are planned for te past and can not be removed because they do not exist in Elasticsearch", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() - 3600);
      const session = createCourseSession({
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session] });
      getCourseByIdMock.mockResolvedValue(course);
      esSearchMock.mockResolvedValue({ body: { hits: { hits: [] } } });

      const res = await updateSessions({
        catalogues: [createCatalogue()],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createSessionUpdatedEvent({ session_id: session.id_session })
        })
      });

      expect(res).toEqual({
        errorCode: 400,
        errorMessage: "There are no sessions to either update or delete"
      });
      expect(esSearchMock).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { sessionId: [session.id_session] }
          }
        }
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("deletes a sessions if it is planned for the past and exist in Elasticsearch", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() - 3600);
      const session = createCourseSession({
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session] });
      getCourseByIdMock.mockResolvedValue(course);
      esSearchMock.mockResolvedValue({
        body: { hits: { hits: [{ _source: createESTraining() }] } }
      });

      await updateSessions({
        catalogues: [createCatalogue()],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createSessionUpdatedEvent({ session_id: session.id_session })
        })
      });

      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { sessionId: [session.id_session] }
          }
        }
      });
    });

    it("deletes a sessions if it does not exist in course properties but exists in Elasticsearch", async () => {
      const course = createExtendedCourse({ sessions: undefined });
      getCourseByIdMock.mockResolvedValue(course);
      esSearchMock.mockResolvedValue({
        body: { hits: { hits: [{ _source: createESTraining() }] } }
      });
      const sessionUpdatedEvent = createSessionUpdatedEvent();

      await updateSessions({
        catalogues: [createCatalogue()],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: sessionUpdatedEvent
        })
      });

      expect(esClientMock.deleteByQuery).toHaveBeenCalledWith({
        index: `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        body: {
          query: {
            terms: { sessionId: [sessionUpdatedEvent.payload.session_id] }
          }
        }
      });
    });

    it("returns an error if 'getCurrency' returns undefined", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session = createCourseSession({
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session] });
      getCourseByIdMock.mockResolvedValue(course);
      getCurrencyMock.mockResolvedValue(undefined);

      const res = await updateSessions({
        catalogues: [createCatalogue()],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createSessionUpdatedEvent({ session_id: session.id_session })
        })
      });

      expect(res).toEqual({
        errorCode: 500,
        errorMessage: "Did not manage to get currency"
      });
      expect(getIndexOperationMock).not.toHaveBeenCalled();
      expect(performBulkOperations).not.toHaveBeenCalled();
    });

    it("updates data correctly if one session provided ", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session = createCourseSession({
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session] });
      getCourseByIdMock.mockResolvedValue(course);
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });

      await updateSessions({
        catalogues: [catalogue],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createSessionUpdatedEvent({
            session_id: session.id_session
          })
        })
      });

      expect(getIndexOperationMock).toHaveBeenCalledTimes(1);
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-298-1",
          sessionId: session.id_session,
          sessionName: session.name,
          sessionSlug: session.slug_name,
          startDate: session.start_date,
          endDate: session.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: course.category.name,
          onSale: course.on_sale,
          price: course.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue.catalogue_id.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        },
        "1-298-1"
      );
      expect(performBulkOperations).toHaveBeenCalledTimes(1);
    });

    it("works correctly if multiple sessions provided", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session1 = createCourseSession({
        id_session: 1,
        start_date: sessionStartDate.toString()
      });
      const session2 = createCourseSession({
        id_session: 2,
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({ sessions: [session1, session2] });
      getCourseByIdMock.mockResolvedValue(course);
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });

      await updateSessions({
        catalogues: [catalogue],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createMultipleSessionsUpdatedEvent([
            {
              fired_at: "2024-02-07 11:42:12",
              course_id: course.id,
              course_code: "course code",
              session_id: session1.id_session,
              session_code: "session code",
              session_name: "session name",
              migrated_webinar_session_id: null
            },
            {
              fired_at: "2024-02-07 11:42:12",
              course_id: course.id,
              course_code: "course code",
              session_id: session2.id_session,
              session_code: "session code",
              session_name: "session name",
              migrated_webinar_session_id: null
            }
          ])
        })
      });

      expect(getIndexOperationMock).toHaveBeenCalledTimes(2);
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-298-1",
          sessionId: session1.id_session,
          sessionName: session1.name,
          sessionSlug: session1.slug_name,
          startDate: session1.start_date,
          endDate: session1.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: course.category.name,
          onSale: course.on_sale,
          price: course.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue.catalogue_id.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        },
        "1-298-1"
      );
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-298-2",
          sessionId: session2.id_session,
          sessionName: session2.name,
          sessionSlug: session2.slug_name,
          startDate: session2.start_date,
          endDate: session2.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: course.category.name,
          onSale: course.on_sale,
          price: course.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue.catalogue_id.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        },
        "1-298-2"
      );
      expect(performBulkOperations).toHaveBeenCalledTimes(1);
    });

    it("should ignore session if it does not exist in the request payload", async () => {
      const sessionStartDate = new Date();
      sessionStartDate.setSeconds(sessionStartDate.getSeconds() + 3600);
      const session1 = createCourseSession({
        id_session: 1,
        start_date: sessionStartDate.toString()
      });
      const session2 = createCourseSession({
        id_session: 2,
        start_date: sessionStartDate.toString()
      });
      const course = createExtendedCourse({
        sessions: [session1, session2]
      });
      getCourseByIdMock.mockResolvedValue(course);
      const catalogue = createCatalogue({
        sub_items: [createCatalogueSubItem({ item_id: course.id.toString() })]
      });

      await updateSessions({
        catalogues: [catalogue],
        courseId: course.id,
        doceboMessageId: webhookMessageId,
        esClient: esClientMock,
        req: mockRequest({
          body: createSessionUpdatedEvent({
            fired_at: "2024-02-07 11:42:12",
            course_id: course.id,
            course_code: "course code",
            session_id: session1.id_session,
            session_code: "session code",
            session_name: "session name",
            migrated_webinar_session_id: null
          })
        })
      });

      expect(getIndexOperationMock).toHaveBeenCalledTimes(1);
      expect(getIndexOperationMock).toHaveBeenCalledWith(
        `${process.env.ES_INDEX_NAME_TRAININGS}_write`,
        {
          id: "1-298-1",
          sessionId: session1.id_session,
          sessionName: session1.name,
          sessionSlug: session1.slug_name,
          startDate: session1.start_date,
          endDate: session1.end_date,
          courseId: course.id,
          courseName: course.name,
          courseSlug: course.slug_name,
          courseCode: course.code,
          courseType: course.type,
          courseImg: course.thumbnail,
          category: course.category.name,
          onSale: course.on_sale,
          price: course.price,
          currency: "EUR",
          currencySymbol: "€",
          catalogueId: catalogue.catalogue_id.toString(),
          catalogueName: catalogue.catalogue_name,
          catalogueDescription: catalogue.catalogue_description
        },
        "1-298-1"
      );
      expect(performBulkOperations).toHaveBeenCalledTimes(1);
    });
  });
});
