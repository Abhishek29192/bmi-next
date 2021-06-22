import React from "react";
import { Course } from "@bmi/intouch-api-types";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { CourseDescription } from "../CourseDescription";

type TrainingCourseDetailProps = { course: Course; lmsUrl: string };

export const TrainingCourseDetail = ({
  course,
  lmsUrl
}: TrainingCourseDetailProps) => {
  const { t } = useTranslation("training-page");
  const { name, trainingType, image, description, courseEnrollments } = course;
  const { status = "General", url = null } = courseEnrollments.nodes[0] || {};
  return (
    <CourseDescription
      title={name}
      type={trainingType}
      status={status}
      image={image}
      lmsUrl={!url ? lmsUrl : `${lmsUrl}?path=${url}}`}
    >
      <Typography variant="h5">{t("Description")}</Typography>

      <Typography
        component="div"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </CourseDescription>
  );
};
