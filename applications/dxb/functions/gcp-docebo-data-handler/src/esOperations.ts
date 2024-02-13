import logger from "@bmi-digital/functions-logger";
import {
  CurrencyFields,
  DoceboApiService,
  getCachedDoceboApi,
  transformCourseCategory
} from "@bmi/docebo-api";
import {
  getIndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";
import { isDefined } from "@bmi/utils";
import type { Catalogue, ExtendedCourse } from "@bmi/docebo-types";
import type { Training } from "@bmi/elasticsearch-types";
import type { IndexOperation } from "@bmi/functions-es-client";
import { getUnique, isMultipleEventsPayload } from "./utils";
import type { Client } from "@elastic/elasticsearch";
import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type {
  CatalogCourseDeleted,
  MultipleCoursesRemovedFromCatalogue,
  MultipleSessionsDeleted,
  MultipleSessionsUpdatedEvent,
  SessionDeleted,
  SessionUpdatedEvent
} from "./types";

const deleteItemByQuery = async (
  esClient: Client,
  query: Record<string, unknown>
): Promise<void> => {
  const index = `${process.env.ES_INDEX_NAME_TRAININGS}_write`;
  esClient.deleteByQuery({
    index: index,
    body: {
      query
    }
  });
};

export const deleteCourses = async ({
  courseIds,
  doceboMessageId,
  esClient
}: {
  courseIds: number[];
  doceboMessageId: string;
  esClient: Client;
}) => {
  await deleteItemByQuery(esClient, {
    terms: { courseId: courseIds }
  });

  logger.info({
    message: `Courses with course_id: ${courseIds.join()} have been successfully deleted`
  });
};

export const deleteCoursesFromCatalogue = async ({
  allowedCatalogueIds,
  courseIds,
  doceboMessageId,
  esClient,
  req
}: {
  allowedCatalogueIds: number[];
  courseIds: number[];
  doceboMessageId: string;
  esClient: Client;
  req: Request<
    ParamsDictionary,
    any,
    CatalogCourseDeleted | MultipleCoursesRemovedFromCatalogue
  >;
}): Promise<undefined | { errorMessage: string; errorCode: number }> => {
  const uniqueCatalogueIds = getUniqueCatalogueIds(req, allowedCatalogueIds);

  if (!uniqueCatalogueIds.length) {
    return {
      errorMessage: "Provided catalogues are not supported by this market",
      errorCode: 400
    };
  }

  await deleteItemByQuery(esClient, {
    bool: {
      must: [
        {
          terms: {
            courseId: courseIds
          }
        },
        {
          terms: {
            "catalogueId.keyword": uniqueCatalogueIds
          }
        }
      ]
    }
  });

  logger.info({
    message: `Courses with ID ${courseIds.join(
      ", "
    )} from catalogues ${uniqueCatalogueIds.join(
      ", "
    )} have been successfully deleted`
  });
};

export const deleteSessions = async ({
  doceboMessageId,
  esClient,
  req
}: {
  doceboMessageId: string;
  esClient: Client;
  req: Request<ParamsDictionary, any, SessionDeleted | MultipleSessionsDeleted>;
}) => {
  const sessionIds = getSessionIds(req);

  await deleteItemByQuery(esClient, {
    terms: {
      sessionId: sessionIds
    }
  });
  logger.info({
    message: `Sessions with session_id: ${sessionIds.join(
      ", "
    )} have been successfully deleted`
  });
};

export const updateCourses = async ({
  catalogues,
  courseIds,
  doceboMessageId,
  esClient
}: {
  catalogues: Catalogue[];
  courseIds: number[];
  doceboMessageId: string;
  esClient: Client;
}): Promise<undefined | { errorMessage: string; errorCode: number }> => {
  const doceboApi = getCachedDoceboApi();
  const indexName = `${process.env.ES_INDEX_NAME_TRAININGS}_write`;
  const courses = await getCourses(courseIds, doceboApi);

  if (!courses.length) {
    return {
      errorCode: 500,
      errorMessage: `Did not manage to get courses with the following IDs: ${courseIds.join(
        ", "
      )}`
    };
  }

  const currency = await doceboApi.getCurrency();
  if (!currency) {
    return {
      errorCode: 500,
      errorMessage: "Did not manage to get currency"
    };
  }

  const currentTime = new Date().getTime();
  const transformedSessions = transformSessions({
    catalogues,
    courses,
    currency,
    currentTime
  });

  if (!transformedSessions.length) {
    return {
      errorCode: 400,
      errorMessage: "Given courses do not have active sessions"
    };
  }

  logger.info({
    message: `Sessions to be updated - ${JSON.stringify(transformedSessions)}`
  });

  await performBulkUpdate(transformedSessions, indexName, esClient);
};

export const updateSessions = async ({
  catalogues,
  courseId,
  doceboMessageId,
  esClient,
  req
}: {
  catalogues: Catalogue[];
  courseId?: number;
  doceboMessageId: string;
  esClient: Client;
  req: Request<
    ParamsDictionary,
    any,
    SessionUpdatedEvent | MultipleSessionsUpdatedEvent
  >;
}): Promise<undefined | { errorMessage: string; errorCode: number }> => {
  const sessionIds = getSessionIds(req);
  const uniqueSessionIds = getUnique(sessionIds);

  if (!courseId) {
    return { errorCode: 400, errorMessage: "courseId was not provided" };
  }

  const doceboApi = getCachedDoceboApi();
  const indexName = `${process.env.ES_INDEX_NAME_TRAININGS}_write`;
  const course = await doceboApi.getCourseById(courseId);

  if (!course) {
    return {
      errorCode: 500,
      errorMessage: `Did not manage to get docebo course with ID: ${courseId}`
    };
  }

  const currentTime = new Date().getTime();
  const activeSessions = (course.sessions || []).filter((session) => {
    if (!uniqueSessionIds.includes(session.id_session)) {
      return false;
    }

    const sessionStartTime = new Date(session.start_date).getTime();
    return sessionStartTime > currentTime;
  });

  const outdatedSessionIDs = uniqueSessionIds.filter(
    (sessionId) =>
      !activeSessions.find(
        (activeSession) => sessionId !== activeSession.id_session
      )
  );

  /**
   * Checks if items exist in elasticsearch
   * To remove them and trigger a new build only if they exist
   */
  const canBeRemoved = !!(
    await esClient.search({
      index: indexName,
      body: {
        query: {
          terms: { sessionId: outdatedSessionIDs }
        }
      }
    })
  ).body.hits.hits.length;

  if (!activeSessions.length && !canBeRemoved) {
    return {
      errorCode: 400,
      errorMessage: "There are no sessions to either update or delete"
    };
  }

  if (canBeRemoved) {
    await deleteItemByQuery(esClient, {
      terms: {
        sessionId: outdatedSessionIDs
      }
    });
    logger.info({
      message: `Sessions with ID ${outdatedSessionIDs.join(
        ", "
      )} are planned for the past. Such sessions will not be indexed`
    });
  }

  if (!activeSessions.length) {
    logger.info({
      message: `There are no active sessions to be updated. All sessions are planned for the past`
    });
    return;
  }

  const currency = await doceboApi.getCurrency();
  if (!currency) {
    return {
      errorCode: 500,
      errorMessage: "Did not manage to get currency"
    };
  }

  const transformedSessions = transformSessions({
    catalogues,
    courses: [{ ...course, sessions: activeSessions }],
    currency,
    currentTime
  });

  logger.info({
    message: `Sessions to be updated - ${JSON.stringify(transformedSessions)}`
  });

  await performBulkUpdate(transformedSessions, indexName, esClient);
};

const getCourses = async (
  courseIds: number[],
  doceboApi: DoceboApiService
): Promise<ExtendedCourse[]> => {
  const coursePromises = courseIds.map((courseId) =>
    doceboApi.getCourseById(courseId)
  );
  return (await Promise.all(coursePromises)).filter(isDefined);
};

const transformSessions = ({
  catalogues,
  courses,
  currency,
  currentTime
}: {
  catalogues: Catalogue[];
  courses: ExtendedCourse[];
  currency: CurrencyFields;
  currentTime: number;
}): Training[] => {
  return courses
    .flatMap((course) => {
      const courseCatalogues = catalogues.filter((catalogue) =>
        catalogue.sub_items.find(({ item_id }) => Number(item_id) === course.id)
      );

      return courseCatalogues.flatMap((catalogue) =>
        (course.sessions || []).map((session) => {
          const sessionStartTime = new Date(session.start_date).getTime();

          if (currentTime >= sessionStartTime) {
            return;
          }

          return {
            id: `${catalogue.catalogue_id}-${course.id}-${session.id_session}`,
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
            category: transformCourseCategory(course.category),
            onSale: course.on_sale,
            price: course.price,
            currency: currency.currency_currency,
            currencySymbol: currency.currency_symbol,
            catalogueId: catalogue.catalogue_id.toString(),
            catalogueName: catalogue.catalogue_name,
            catalogueDescription: catalogue.catalogue_description
          };
        })
      );
    })
    .filter(isDefined);
};

const performBulkUpdate = async (
  transformedSessions: Training[],
  indexName: string,
  esClient: Client
) => {
  const bulkOperations = transformedSessions.reduce<
    (IndexOperation | Training)[]
  >(
    (allOperations, training) => [
      ...allOperations,
      ...getIndexOperation<Training>(indexName, training, training.id)
    ],
    []
  );
  await performBulkOperations(esClient, [bulkOperations], indexName);
};

const getSessionIds = (
  req: Request<
    ParamsDictionary,
    any,
    | SessionDeleted
    | SessionUpdatedEvent
    | MultipleSessionsUpdatedEvent
    | MultipleSessionsDeleted
  >
): number[] =>
  (isMultipleEventsPayload(req.body)
    ? req.body.payloads.map((payload) => payload.session_id)
    : [req.body.payload.session_id]
  ).filter(Boolean);

const getUniqueCatalogueIds = (
  req: Request<
    ParamsDictionary,
    any,
    CatalogCourseDeleted | MultipleCoursesRemovedFromCatalogue
  >,
  allowedCatalogueIds: number[]
): number[] => {
  const catalogueIds = (
    isMultipleEventsPayload(req.body)
      ? req.body.payloads.map((payload) => payload.catalog_id)
      : [req.body.payload.catalog_id]
  ).filter((catalogueId) => allowedCatalogueIds.includes(catalogueId));
  return getUnique(catalogueIds);
};
