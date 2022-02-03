import React from "react";
import { render } from "@testing-library/react";
import { TrainingSidePanel } from "..";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";

describe("TrainingSidePanel component", () => {
  it("renders correctly", () => {
    const courseCatalog = [
      {
        course: {
          name: "Flat Course",
          technology: "FLAT",
          courseEnrollments: {
            nodes: []
          }
        }
      },
      {
        course: {
          name: "Pitch Course",
          technology: "PITCH",
          courseEnrollments: {
            nodes: [
              {
                id: 1,
                courseId: 1,
                url: "",
                status: "enrolled"
              }
            ]
          }
        }
      }
    ];
    const { container } = render(
      <I18nProvider>
        <TrainingSidePanel courseCatalog={courseCatalog} />
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when no courseCatalog is passed", () => {
    const { container } = render(
      <I18nProvider>
        <TrainingSidePanel courseCatalog={[]} />
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when no technology is passed", () => {
    const courseCatalog = [
      {
        course: {
          name: "Flat Course",
          technology: null,
          courseEnrollments: {
            nodes: []
          }
        }
      }
    ];

    const { container } = render(
      <I18nProvider>
        <TrainingSidePanel courseCatalog={courseCatalog} />
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
