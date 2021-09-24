import React from "react";
import { Course } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { CourseDescription } from "../CourseDescription";

type TrainingCourseDetailProps = { course: Course; lmsUrl: string };

const COURSE_BASE_PATH = "/learn/course/internal/view";

const getCourseUrl = (course, lmsUrl) => {
  const { trainingType, courseId, slug } = course || {};

  if (trainingType && courseId && slug) {
    return `${lmsUrl}?path=${COURSE_BASE_PATH}/${trainingType}/${courseId}/${slug}`;
  }

  return lmsUrl;
};

export const TrainingCourseDetail = ({
  course,
  lmsUrl
}: TrainingCourseDetailProps) => {
  const { t } = useTranslation("training-page");
  const { name, trainingType, image, description, courseEnrollments } = course;
  const { status = "", url = null } = courseEnrollments.nodes[0] || {};
  return (
    <CourseDescription
      title={name}
      type={trainingType}
      status={status}
      image={image}
      lmsUrl={!url ? getCourseUrl(course, lmsUrl) : `${lmsUrl}?path=${url}`}
    >
      <Typography variant="h5">{t("Description")}</Typography>

      <Typography
        component="div"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </CourseDescription>
  );
};
