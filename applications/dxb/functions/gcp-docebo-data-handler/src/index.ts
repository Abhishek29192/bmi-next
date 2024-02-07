import logger from "@bmi-digital/functions-logger";
import { getCachedDoceboApi, transformCourseCategory } from "@bmi/docebo-api";
import { Training } from "@bmi/elasticsearch-types";
import fetchRetry from "@bmi/fetch-retry";
import {
  IndexOperation,
  getEsClient,
  getIndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";
import { isDefined } from "@bmi/utils";
import { Client } from "@elastic/elasticsearch";
import { HttpFunction, Response } from "@google-cloud/functions-framework";
import { getMessageStatus, saveById } from "./firestore";
import { EventType, MessageStatus, MultipleCoursesDeletedEvent } from "./types";

const {
  BUILD_TRIGGER_ENDPOINT,
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD,
  DOCEBO_API_CATALOGUE_IDS,
  ES_APIKEY,
  ES_CLOUD_ID,
  ES_INDEX_NAME_TRAININGS,
  FIRESTORE_ROOT_COLLECTION,
  GCP_PROJECT_ID
} = process.env;

export const handleRequest: HttpFunction = async (req, res) => {
  if (!GCP_PROJECT_ID) {
    logger.error({ message: "GCP_PROJECT_ID was not provided" });
    return res.status(500).send({ message: "GCP_PROJECT_ID was not provided" });
  }

  if (!FIRESTORE_ROOT_COLLECTION) {
    logger.error({ message: "FIRESTORE_ROOT_COLLECTION was not provided" });
    return res
      .status(500)
      .send({ message: "FIRESTORE_ROOT_COLLECTION was not provided" });
  }

  if (!BUILD_TRIGGER_ENDPOINT) {
    logger.error({ message: "BUILD_TRIGGER_ENDPOINT was not provided" });
    return res
      .status(500)
      .send({ message: "BUILD_TRIGGER_ENDPOINT was not provided" });
  }

  if (!DOCEBO_API_URL) {
    logger.error({ message: "DOCEBO_API_URL was not provided" });
    return res.status(500).send({ message: "DOCEBO_API_URL was not provided" });
  }

  if (!DOCEBO_API_CLIENT_ID) {
    logger.error({
      message: "DOCEBO_API_CLIENT_ID was not provided"
    });
    return res
      .status(500)
      .send({ message: "DOCEBO_API_CLIENT_ID was not provided" });
  }

  if (!DOCEBO_API_CLIENT_SECRET) {
    logger.error({ message: "DOCEBO_API_CLIENT_SECRET was not provided" });
    return res
      .status(500)
      .send({ message: "DOCEBO_API_CLIENT_SECRET was not provided" });
  }

  if (!DOCEBO_API_USERNAME) {
    logger.error({ message: "DOCEBO_API_USERNAME was not provided" });
    return res
      .status(500)
      .send({ message: "DOCEBO_API_USERNAME was not provided" });
  }

  if (!DOCEBO_API_PASSWORD) {
    logger.error({ message: "DOCEBO_API_PASSWORD was not provided" });
    return res
      .status(500)
      .send({ message: "DOCEBO_API_PASSWORD was not provided" });
  }

  if (!DOCEBO_API_CATALOGUE_IDS) {
    logger.error({ message: "DOCEBO_API_CATALOGUE_IDS was not provided" });
    return res
      .status(500)
      .send({ message: "DOCEBO_API_CATALOGUE_IDS was not provided" });
  }

  if (!ES_APIKEY) {
    logger.error({ message: "ES_APIKEY was not provided" });
    return res.status(500).send({ message: "ES_APIKEY was not provided" });
  }

  if (!ES_CLOUD_ID) {
    logger.error({ message: "ES_CLOUD_ID was not provided" });
    return res.status(500).send({ message: "ES_CLOUD_ID was not provided" });
  }

  if (!ES_INDEX_NAME_TRAININGS) {
    logger.error({ message: "ES_INDEX_NAME_TRAININGS was not provided" });
    return res
      .status(500)
      .send({ message: "ES_INDEX_NAME_TRAININGS was not provided" });
  }

  logger.info({ message: `Received data: ${JSON.stringify(req.body)}` });

  if (!req.body.message_id) {
    logger.error({ message: "message_id was not provided" });
    return res.status(400).send({ message: "message_id was not provided" });
  }

  try {
    const messageStatus = await getMessageStatus(
      FIRESTORE_ROOT_COLLECTION,
      req.body.message_id
    );

    if (
      messageStatus === MessageStatus.InProgress ||
      messageStatus === MessageStatus.Succeeded
    ) {
      logger.info({ message: "This event has been already handled" });
      return res
        .status(200)
        .json({ message: "This event has been already handled" });
    }

    await saveById(FIRESTORE_ROOT_COLLECTION, {
      id: req.body.message_id,
      status: MessageStatus.InProgress
    });

    if (
      req.headers["authorization"] !==
      `Basic ${btoa(`${DOCEBO_API_USERNAME}:${DOCEBO_API_PASSWORD}`)}`
    ) {
      logger.error({ message: "Authorization failed." });
      await saveById(FIRESTORE_ROOT_COLLECTION, {
        id: req.body.message_id,
        status: MessageStatus.Failed
      });
      return res.sendStatus(401);
    }

    if (!req.body.event) {
      logger.error({ message: "Event was not provided" });
      await saveById(FIRESTORE_ROOT_COLLECTION, {
        id: req.body.message_id,
        status: MessageStatus.Failed
      });
      return res.status(400).send({ message: "Event was not provided" });
    }

    if (!Object.values(EventType).includes(req.body.event)) {
      logger.error({
        message: `Received unexpected event - "${req.body.event}"`
      });
      await saveById(FIRESTORE_ROOT_COLLECTION, {
        id: req.body.message_id,
        status: MessageStatus.Failed
      });
      return res.status(400).send({
        message: `Received unexpected event - "${req.body.event}"`
      });
    }

    const esClient = await getEsClient();

    if (req.body.event === EventType.courseDeleted) {
      if (!req.body.payload && !req.body.payloads) {
        logger.error({ message: "payload was not provided" });
        await saveById(FIRESTORE_ROOT_COLLECTION, {
          id: req.body.message_id,
          status: MessageStatus.Failed
        });
        return res.status(400).send({ message: "payload was not provided" });
      }

      const idsToDelete = req.body.payload
        ? [req.body.payload.course_id]
        : (req.body.payloads as MultipleCoursesDeletedEvent["payloads"]).map(
            ({ course_id }) => course_id
          );

      const filteredIds = idsToDelete.filter(isDefined);
      if (!filteredIds.length) {
        logger.error({ message: "No courses to delete" });
        await saveById(FIRESTORE_ROOT_COLLECTION, {
          id: req.body.message_id,
          status: MessageStatus.Failed
        });
        return res.status(400).send({ message: "No courses to delete" });
      }

      await deleteCourseByQuery(esClient, {
        terms: { courseId: filteredIds }
      });

      logger.info({
        message: `Courses with course_id: ${filteredIds.join()} have been successfully deleted`
      });
    }

    if (req.body.event === EventType.catalogueCourseDeleted) {
      if (!req.body.payload?.catalog_id || !req.body.payload?.course_id) {
        logger.error({ message: "catalog_id or course_id was not provided" });
        await saveById(FIRESTORE_ROOT_COLLECTION, {
          id: req.body.message_id,
          status: MessageStatus.Failed
        });

        return res
          .status(400)
          .send({ message: "catalog_id or course_id was not provided" });
      }

      await deleteCourseByQuery(esClient, {
        bool: {
          must: [
            {
              match: {
                courseId: req.body.payload.course_id
              }
            },
            {
              match: {
                "catalogueId.keyword": req.body.payload.catalog_id
              }
            }
          ]
        }
      });

      logger.info({
        message: `Course with id ${req.body.payload.course_id} from catalog_id ${req.body.payload.catalog_id} has been successfully deleted`
      });
    }

    if (req.body.event === EventType.courseUpdated) {
      if (!req.body.payload?.course_id) {
        logger.error({ message: "course_id was not provided" });
        await saveById(FIRESTORE_ROOT_COLLECTION, {
          id: req.body.message_id,
          status: MessageStatus.Failed
        });
        return res.status(400).send({ message: "course_id was not provided" });
      }

      const courseCanNotBeUpdated = Boolean(
        await updateCourse(
          res,
          req.body.message_id,
          esClient,
          req.body.payload.course_id
        )
      );

      if (courseCanNotBeUpdated) {
        return;
      }

      logger.info({
        message: `Course with id ${req.body.payload.course_id} has been successfully updated`
      });
    }

    // Constants for setting up metadata server request
    // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
    const tokenUrl = `http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${BUILD_TRIGGER_ENDPOINT}`;
    // fetch the auth token
    const tokenResponse = await fetch(tokenUrl, {
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    const token = await tokenResponse.text();
    await fetchRetry(BUILD_TRIGGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      },
      body: JSON.stringify({ isFullFetch: false })
    });
    logger.info({ message: "Build triggered successfully" });

    await saveById(FIRESTORE_ROOT_COLLECTION, {
      id: req.body.message_id,
      status: MessageStatus.Succeeded
    });

    return res.sendStatus(200);
  } catch (err) {
    logger.error({ message: (err as Error).message });
    await saveById(FIRESTORE_ROOT_COLLECTION, {
      id: req.body.message_id,
      status: MessageStatus.Failed
    });
    return res.status(500).send({
      message: `Something went wrong: ${(err as Error).message}`
    });
  }
};

const deleteCourseByQuery = async (
  client: Client,
  query: Record<string, unknown>
): Promise<void> => {
  const index = `${ES_INDEX_NAME_TRAININGS}_write`;
  client.deleteByQuery({
    index: index,
    body: {
      query
    }
  });
};

const updateCourse = async (
  res: Response,
  messageId: string,
  esClient: Client,
  courseId: number
) => {
  const doceboApi = getCachedDoceboApi();
  const indexName = `${ES_INDEX_NAME_TRAININGS}_write`;
  const course = await doceboApi.getCourseById(courseId);
  if (!course) {
    logger.info({
      message: `Course with "course_id: ${courseId}" does not exist`
    });
    await saveById(FIRESTORE_ROOT_COLLECTION!, {
      id: messageId,
      status: MessageStatus.Failed
    });
    return res
      .status(400)
      .json({ message: `Course with "course_id: ${courseId}" does not exist` });
  }

  const catalogueIds = DOCEBO_API_CATALOGUE_IDS?.split(",")?.map(Number);
  const catalogues = await doceboApi.fetchCatalogues({ catalogueIds });

  const courseCatalogues = catalogues?.filter((catalogue) =>
    catalogue.sub_items.find(({ item_id }) => Number(item_id) === course.id)
  );

  if (!courseCatalogues?.length) {
    logger.info({
      message: `Course with "course_id: ${courseId}" does not belong to any catalog`
    });
    await saveById(FIRESTORE_ROOT_COLLECTION!, {
      id: messageId,
      status: MessageStatus.Succeeded
    });
    return res.sendStatus(200);
  }

  const currency = await doceboApi.getCurrency();

  // The same course with the same ID can be in multiple catalogues
  const transformedCourses: Training[] = courseCatalogues.flatMap((catalogue) =>
    (course.sessions || [])
      .map((session) => {
        const sessionStartTime = new Date(session.start_date).getTime();
        const currentTime = new Date().getTime();

        if (sessionStartTime <= currentTime) {
          //if the condition above passes, it means that session is not active anymore
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
      .filter(isDefined)
  );

  if (!transformedCourses.length) {
    logger.info({
      message: "There are no sessions to update"
    });
    await saveById(FIRESTORE_ROOT_COLLECTION!, {
      id: messageId,
      status: MessageStatus.Succeeded
    });
    return res.sendStatus(200);
  }

  logger.info({
    message: `Sessions to be updated - ${JSON.stringify(transformedCourses)}`
  });

  const bulkOperations = transformedCourses.reduce<
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
