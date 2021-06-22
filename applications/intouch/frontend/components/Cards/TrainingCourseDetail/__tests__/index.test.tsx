import React from "react";
import { render } from "@testing-library/react";
import { Course, CourseEnrollmentsConnection } from "@bmi/intouch-api-types";
import { TrainingCourseDetail } from "..";

describe("TrainingCover component", () => {
  it("render correctly", () => {
    const course: Course = {
      id: 1,
      nodeId: "1",
      courseId: 125,
      technology: "OTHER",
      name: "GCP roofing methodology",
      trainingType: "classroom",
      courseEnrollments: {
        nodes: []
      } as CourseEnrollmentsConnection,
      image: "",
      description: "GCP roofing methodology description",
      createdAt: "",
      updatedAt: "",
      courseCatalogues: null
    };

    const { container } = render(
      <TrainingCourseDetail course={course} lmsUrl={""} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
