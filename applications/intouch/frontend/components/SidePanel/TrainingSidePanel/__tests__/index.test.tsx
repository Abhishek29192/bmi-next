import React from "react";
import { render } from "@testing-library/react";
import { TrainingSidePanel } from "..";
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
      <TrainingSidePanel courseCatalog={courseCatalog} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly when no courseCatalog is passed", () => {
    const { container } = render(<TrainingSidePanel courseCatalog={null} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
