import { CourseType } from "@bmi/docebo-types";

export enum EventType {
  courseDeleted = "course.deleted",
  courseUpdated = "course.updated",
  catalogueCourseDeleted = "catalog.course.deleted",
  sessionDeleted = "ilt.session.deleted",
  sessionUpdated = "ilt.session.updated"
}

type BaseFields = {
  fired_at: string;
  course_id: number;
  name: string;
  type: CourseType;
  code: string;
  language: string;
  duration: number;
  start_date: string | null;
  end_date: string | null;
};

type BasicEvent<E extends EventType, P extends Record<string, unknown>> = {
  event: E;
  fired_by_batch_action: boolean;
  message_id: string;
  payload: P;
};

export type CourseDeletedEvent = BasicEvent<
  EventType.courseDeleted,
  BaseFields & { deletion_date: string }
>;

export type CourseUpdatedEvent = BasicEvent<
  EventType.courseUpdated,
  BaseFields & { update_date: string }
>;

export type CatalogCourseDeleted = BasicEvent<
  EventType.catalogueCourseDeleted,
  {
    fired_at: string;
    catalog_id: number;
    course_id: number;
  }
>;

export type SessionDeleted = BasicEvent<
  EventType.sessionDeleted,
  {
    fired_at: string;
    course_id: number;
    course_code: string;
    session_id: number;
    session_code: string;
    session_name: string;
    migrated_webinar_session_id: null | number;
  }
>;

export type SessionUpdatedEvent = BasicEvent<
  EventType.sessionUpdated,
  {
    fired_at: string;
    course_id: number;
    course_code: string;
    session_id: number;
    session_code: string;
    session_name: string;
    migrated_webinar_session_id: number | null;
  }
>;

export type MultipleSessionsDeleted = {
  event: EventType.sessionDeleted;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: SessionDeleted["payload"][];
};

export type MultipleCoursesDeletedEvent = {
  event: EventType.courseDeleted;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: CourseDeletedEvent["payload"][];
};

export type MultipleCoursesRemovedFromCatalogue = {
  event: EventType.catalogueCourseDeleted;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: CatalogCourseDeleted["payload"][];
};

export type MultipleCoursesUpdatedEvent = {
  event: EventType.courseUpdated;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: CourseUpdatedEvent["payload"][];
};

export type MultipleSessionsUpdatedEvent = {
  event: EventType.sessionUpdated;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: SessionUpdatedEvent["payload"][];
};

export type BatchEvents =
  | MultipleCoursesDeletedEvent
  | MultipleCoursesRemovedFromCatalogue
  | MultipleCoursesUpdatedEvent
  | MultipleSessionsUpdatedEvent
  | MultipleSessionsDeleted;

export enum MessageStatus {
  InProgress = "in-progress",
  Failed = "failed",
  Succeeded = "succeeded"
}

export type DoceboMessageLog = {
  id: string;
  status: MessageStatus;
};
