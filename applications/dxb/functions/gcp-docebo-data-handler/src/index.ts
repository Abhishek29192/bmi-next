import logger from "@bmi-digital/functions-logger";
import { getCachedDoceboApi } from "@bmi/docebo-api";
import fetchRetry from "@bmi/fetch-retry";
import { getEsClient } from "@bmi/functions-es-client";
import { HttpFunction } from "@google-cloud/functions-framework";
import {
  deleteCourses,
  deleteCoursesFromCatalogue,
  deleteSessions,
  updateCourses,
  updateSessions
} from "./esOperations";
import { getMessageStatus, saveById } from "./firestore";
import { EventType, MessageStatus } from "./types";
import { getUnique, isMultipleEventsPayload } from "./utils";

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

  const catalogueIds = DOCEBO_API_CATALOGUE_IDS?.split(",")
    ?.map(Number)
    .filter(Boolean);
  if (!catalogueIds.length) {
    logger.error({
      message: "Please provide correct catalogue IDs. E.g. 1,2,3,..."
    });
    return res.status(500).send({
      message: "Please provide correct catalogue IDs. E.g. 1,2,3,..."
    });
  }

  logger.info({ message: `Received data: ${JSON.stringify(req.body)}` });

  if (!req.body.payload && !req.body.payloads) {
    logger.error({ message: "payload was not provided" });
    return res.status(400).send({ message: "payload was not provided" });
  }

  if (!req.body.message_id) {
    logger.error({ message: "message_id was not provided" });
    return res.status(400).send({ message: "message_id was not provided" });
  }

  try {
    const messageStatus = await getMessageStatus(
      FIRESTORE_ROOT_COLLECTION,
      req.body.message_id
    );

    if (messageStatus) {
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

    const courseIds: number[] = (
      isMultipleEventsPayload(req.body)
        ? req.body.payloads.map(({ course_id }) => course_id)
        : [req.body.payload.course_id]
    ).filter(Boolean);

    const doceboApi = getCachedDoceboApi();
    const catalogues = await doceboApi.fetchCatalogues({ catalogueIds });

    /**
     * Takes courses that belong to allowed catalogues only
     * Does not do "filtering" for "Course deleted" and "Course deleted from catalogue" events because for such events courses have been already deleted
     * and they will not be found in catalogues
     */
    const filteredCourseIds =
      req.body.event === EventType.courseDeleted ||
      req.body.event === EventType.catalogueCourseDeleted
        ? courseIds
        : courseIds.filter((courseId) =>
            catalogues.find((catalogue) =>
              catalogue.sub_items.find(
                (subItem) => subItem.item_id === courseId.toString()
              )
            )
          );
    const uniqueCourseIds = getUnique(filteredCourseIds);

    if (!uniqueCourseIds.length) {
      logger.info({
        message: `Courses with ID ${courseIds.join(
          ", "
        )} do not belong to allowed catalogues`
      });
      await saveById(FIRESTORE_ROOT_COLLECTION, {
        id: req.body.message_id,
        status: MessageStatus.Failed
      });
      return res.status(400).json({
        message: `Courses with ID ${courseIds.join(
          ", "
        )} do not belong to allowed catalogues`
      });
    }

    const esClient = await getEsClient();
    let result;
    if (req.body.event === EventType.courseDeleted) {
      result = await deleteCourses({
        courseIds: uniqueCourseIds,
        doceboMessageId: req.body.message_id,
        esClient
      });
    } else if (req.body.event === EventType.sessionDeleted) {
      result = await deleteSessions({
        doceboMessageId: req.body.message_id,
        esClient,
        req
      });
    } else if (req.body.event === EventType.catalogueCourseDeleted) {
      result = await deleteCoursesFromCatalogue({
        allowedCatalogueIds: catalogueIds,
        courseIds: uniqueCourseIds,
        doceboMessageId: req.body.message_id,
        esClient,
        req
      });
    } else if (req.body.event === EventType.courseUpdated) {
      result = await updateCourses({
        catalogues,
        courseIds: uniqueCourseIds,
        doceboMessageId: req.body.message_id,
        esClient
      });
    } else if (req.body.event === EventType.sessionUpdated) {
      result = await updateSessions({
        catalogues,
        //For this event only one course will be always passed in, so we can use the first item
        courseId: uniqueCourseIds[0],
        doceboMessageId: req.body.message_id,
        esClient,
        req
      });
    }

    if (result?.errorCode) {
      await saveById(FIRESTORE_ROOT_COLLECTION, {
        id: req.body.message_id,
        status: MessageStatus.Failed
      });
      logger.error({ message: result.errorMessage });
      return res
        .status(result.errorCode)
        .json({ message: result.errorMessage });
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
