import React from "react";
import { render } from "@testing-library/react";
import { TrainingSidePanel } from "..";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";
import { TrainingQuery } from "../../../../graphql/generated/operations";

describe("TrainingSidePanel component", () => {
  it("renders correctly", () => {
    const courseCatalog: TrainingQuery["courseCatalogues"] = {
      nodes: [
        {
          course: {
            name: "Flat Course",
            technology: "Flat",
            courseEnrollments: {
              nodes: []
            }
          }
        },
        {
          course: {
            name: "Pitch Course",
            technology: "Pitch",
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
      ]
    };

    const { container } = render(
      <I18nProvider>
        <TrainingSidePanel courseCatalog={courseCatalog} />
      </I18nProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when no courseCatalog is passed", () => {
    const { container } = render(
      <I18nProvider>
        <TrainingSidePanel courseCatalog={null} />
      </I18nProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
