import React from "react";
import { render } from "@testing-library/react";
import { Course, CourseEnrollmentsConnection } from "@bmi/intouch-api-types";
import { TrainingCourseDetail } from "..";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";

describe("TrainingCourseDetail component", () => {
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
    const lmsUrl = "/api/docebo-sso";

    const { container } = render(
      <I18nextProvider>
        <TrainingCourseDetail course={course} lmsUrl={lmsUrl} />
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
