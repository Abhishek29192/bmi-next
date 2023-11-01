import { CourseType } from "@bmi/docebo-types";

export enum EventType {
  courseDeleted = "course.deleted",
  courseUpdated = "course.updated",
  catalogueCourseDeleted = "catalog.course.deleted"
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

export type CourseEvent<
  E extends EventType,
  P extends Record<string, unknown>
> = {
  event: E;
  fired_by_batch_action: boolean;
  message_id: string;
  payload: P;
};

export type CourseDeletedEvent = CourseEvent<
  EventType.courseDeleted,
  BaseFields & { deletion_date: string }
>;

export type CourseUpdatedEvent = CourseEvent<
  EventType.courseUpdated,
  BaseFields & { update_date: string }
>;

export type CatalogCourseDeleted = CourseEvent<
  EventType.catalogueCourseDeleted,
  {
    fired_at: string;
    catalog_id: number;
    course_id: number;
  }
>;

export type MultipleCoursesDeletedEvent = {
  event: EventType.courseDeleted;
  fired_by_batch_action: boolean;
  message_id: string;
  payloads: (BaseFields & { deletion_date: string })[];
};

export enum MessageStatus {
  InProgress = "in-progress",
  Failed = "failed",
  Succeeded = "succeeded"
}

export type DoceboMessageLog = {
  id: string;
  status: MessageStatus;
};
