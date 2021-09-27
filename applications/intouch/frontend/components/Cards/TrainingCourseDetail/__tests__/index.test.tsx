import React from "react";
import { render, screen } from "@testing-library/react";
import { Course, CourseEnrollmentsConnection } from "@bmi/intouch-api-types";
import { TrainingCourseDetail } from "..";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";

const course: Course = {
  id: 1,
  nodeId: "1",
  courseId: 125,
  slug: "slug",
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

const testCourseUrl = "https://intouch.test.com/test-course";

const courseWithEnrollments: Course = {
  ...course,
  courseEnrollments: {
    nodes: [
      {
        id: 1,
        url: testCourseUrl,
        nodeId: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ],
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false
    },
    totalCount: 1
  }
};

describe("TrainingCourseDetail component", () => {
  it("links to SSO without query params if there are no enrollments", () => {
    render(
      <I18nextProvider>
        <TrainingCourseDetail course={course} lmsUrl="/api/docebo-sso" />
      </I18nextProvider>
    );
    expect(screen.getByText("viewTraining").closest("a").href).toEqual(
      "http://localhost/api/docebo-sso?path=/learn/course/internal/view/classroom/125/slug"
    );
  });

  it("uses enrollment url to SSO without query params if there are no enrollments", () => {
    render(
      <I18nextProvider>
        <TrainingCourseDetail
          course={courseWithEnrollments}
          lmsUrl="/api/docebo-sso"
        />
      </I18nextProvider>
    );
    expect(screen.getByText("viewTraining").closest("a").href).toEqual(
      "http://localhost/api/docebo-sso?path=https://intouch.test.com/test-course"
    );
  });

  describe("snapshots", () => {
    it("no enrollments", () => {
      const { container } = render(
        <I18nextProvider>
          <TrainingCourseDetail course={course} lmsUrl="/api/docebo-sso" />
        </I18nextProvider>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with enrollment", () => {
      const { container } = render(
        <I18nextProvider>
          <TrainingCourseDetail
            course={courseWithEnrollments}
            lmsUrl="/api/docebo-sso"
          />
        </I18nextProvider>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
