import {
  CatalogCourseDeleted,
  CourseDeletedEvent,
  CourseUpdatedEvent,
  EventType,
  MultipleCoursesDeletedEvent,
  MultipleCoursesRemovedFromCatalogue,
  MultipleCoursesUpdatedEvent,
  MultipleSessionsDeleted,
  MultipleSessionsUpdatedEvent,
  SessionDeleted,
  SessionUpdatedEvent
} from "../../types";

export const createCourseDeletedEvent = (
  eventDetails: Partial<CourseDeletedEvent["payload"]> = {}
): CourseDeletedEvent => ({
  event: EventType.courseDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payload: {
    ...createCourseDeletedPayload(),
    ...eventDetails
  }
});

export const createCourseUpdatedEvent = (
  eventDetails: Partial<CourseUpdatedEvent["payload"]> = {}
): CourseUpdatedEvent => ({
  event: EventType.courseUpdated,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payload: {
    fired_at: "2023-09-21 13:35:33",
    course_id: 297,
    name: "Course name",
    code: "course-code",
    type: "elearning",
    update_date: "2023-09-21 13:35:33",
    language: "english_uk",
    duration: 0,
    start_date: "2023-09-21",
    end_date: "2030-10-24",
    ...eventDetails
  }
});

export const createMultipleCoursesUpdatedEvent = (
  payloads: MultipleCoursesUpdatedEvent["payloads"]
): MultipleCoursesUpdatedEvent => ({
  event: EventType.courseUpdated,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payloads: payloads || [
    {
      fired_at: "2023-09-21 13:35:33",
      course_id: 297,
      name: "Course name",
      code: "course-code",
      type: "elearning",
      update_date: "2023-09-21 13:35:33",
      language: "english_uk",
      duration: 0,
      start_date: "2023-09-21",
      end_date: "2030-10-24"
    }
  ]
});

export const createCourseDeletedFromCatalogueEvent = (
  eventDetails: Partial<CatalogCourseDeleted["payload"]> = {}
): CatalogCourseDeleted => ({
  event: EventType.catalogueCourseDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payload: {
    fired_at: "2023-09-22 08:46:42",
    catalog_id: 65,
    course_id: 298,
    ...eventDetails
  }
});

export const createMultipleCoursesDeletedFromCatalogueEvent = (
  events?: CatalogCourseDeleted["payload"][]
): MultipleCoursesRemovedFromCatalogue => ({
  event: EventType.catalogueCourseDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payloads: events || [
    { fired_at: "2023-09-22 08:46:42", catalog_id: 65, course_id: 298 }
  ]
});

export const createMultipleCoursesDeletedEvent = (
  courseDeletedEvents?: MultipleCoursesDeletedEvent["payloads"]
): MultipleCoursesDeletedEvent => ({
  event: EventType.courseDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payloads: courseDeletedEvents || [
    {
      fired_at: "2023-09-21 13:35:33",
      course_id: 1,
      name: "Course name",
      code: "course-code",
      type: "elearning",
      deletion_date: "2023-09-21 13:35:33",
      language: "english_uk",
      duration: 0,
      start_date: "2023-09-21",
      end_date: "2030-10-24"
    }
  ]
});

export const createCourseDeletedPayload = (
  payloadDetails: Partial<CourseDeletedEvent["payload"]> = {}
): CourseDeletedEvent["payload"] => ({
  fired_at: "2023-09-21 13:35:33",
  course_id: 297,
  name: "Course name",
  code: "course-code",
  type: "elearning",
  deletion_date: "2023-09-21 13:35:33",
  language: "english_uk",
  duration: 0,
  start_date: "2023-09-21",
  end_date: "2030-10-24",
  ...payloadDetails
});

export const createSessionDeletedEvent = (
  payloadDetails: Partial<SessionDeleted["payload"]> = {}
): SessionDeleted => ({
  event: EventType.sessionDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20240205-162641-dc3cc8ef-1247-4056-8e69-1b11e415313e",
  payload: {
    fired_at: "2024-02-05 16:26:37",
    course_id: 1,
    course_code: "Course code",
    session_id: 1,
    session_code: "Session Code",
    session_name: "Session name",
    migrated_webinar_session_id: null,
    ...payloadDetails
  }
});

export const createMultipleSessionsDeletedEvent = (
  events?: MultipleSessionsDeleted["payloads"]
): MultipleSessionsDeleted => ({
  event: EventType.sessionDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20240205-162641-dc3cc8ef-1247-4056-8e69-1b11e415313e",
  payloads: events || [
    {
      fired_at: "2024-02-05 16:26:37",
      course_id: 1,
      course_code: "Course code",
      session_id: 1,
      session_code: "Session Code",
      session_name: "Session name",
      migrated_webinar_session_id: null
    }
  ]
});

export const createSessionUpdatedEvent = (
  payload: Partial<SessionUpdatedEvent["payload"]> = {}
): SessionUpdatedEvent => ({
  event: EventType.sessionUpdated,
  fired_by_batch_action: false,
  message_id: "wh-20240207-114213-565ac3c1-dc80-4c3a-9f60-01c7f9c727b3",
  payload: {
    fired_at: "2024-02-07 11:42:12",
    course_id: 342,
    course_code: "course code",
    session_id: 231,
    session_code: "session code",
    session_name: "session name",
    migrated_webinar_session_id: null,
    ...payload
  }
});

export const createMultipleSessionsUpdatedEvent = (
  payloads?: MultipleSessionsUpdatedEvent["payloads"]
): MultipleSessionsUpdatedEvent => ({
  event: EventType.sessionUpdated,
  fired_by_batch_action: false,
  message_id: "wh-20240207-114213-565ac3c1-dc80-4c3a-9f60-01c7f9c727b3",
  payloads: payloads || [
    {
      fired_at: "2024-02-07 11:42:12",
      course_id: 342,
      course_code: "course code",
      session_id: 231,
      session_code: "session code",
      session_name: "session name",
      migrated_webinar_session_id: null
    }
  ]
});
