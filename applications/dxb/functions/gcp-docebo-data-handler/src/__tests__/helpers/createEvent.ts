import {
  EventType,
  CourseDeletedEvent,
  CourseUpdatedEvent,
  CatalogCourseDeleted,
  MultipleCoursesDeletedEvent
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

export const createMultipleCoursesDeletedEvent = (
  courseDeletedEvents: MultipleCoursesDeletedEvent["payloads"] = []
): MultipleCoursesDeletedEvent => ({
  event: EventType.courseDeleted,
  fired_by_batch_action: false,
  message_id: "wh-20230921-133538-552060e3-33fe-429f-8c37-d5ba896a8303",
  payloads: [
    {
      fired_at: "2023-09-21 13:35:33",
      course_id: 297,
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
      course_id: 322,
      name: "Course name 2",
      code: "course-code 2",
      type: "webinar",
      deletion_date: "2023-09-21 13:35:33",
      language: "english_uk",
      duration: 0,
      start_date: "2023-09-21",
      end_date: "2030-10-24"
    },
    ...courseDeletedEvents
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
