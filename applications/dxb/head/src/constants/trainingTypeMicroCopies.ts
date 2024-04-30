import { CourseType } from "@bmi/docebo-types";
import { MicroCopyValues, microCopy } from "@bmi/microcopies";

export const trainingTypeMicroCopies: Record<CourseType, MicroCopyValues> = {
  classroom: microCopy.TRAINING_TYPE_CLASSROOM,
  elearning: microCopy.TRAINING_TYPE_ELEARNING,
  webinar: microCopy.TRAINING_TYPE_WEBINAR
};
