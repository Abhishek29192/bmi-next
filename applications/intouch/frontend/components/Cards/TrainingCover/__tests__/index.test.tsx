import React from "react";
import { render } from "@testing-library/react";
import { TrainingCover } from "..";
import { TrainingQuery } from "../../../../graphql/generated/operations";

describe("TrainingCover component", () => {
  it("render correctly", () => {
    const trainingContent: TrainingQuery["trainingContentCollection"] = {
      items: [
        {
          pageHeading: "BMI Academy",
          description:
            "BMI Academy provides you with the skills you need to fit BMI products.",
          lmsCtaLabel: "Your training plan",
          image: {
            url: ""
          },
          pageSubHeading: "The training process",
          step1Heading: "Step 1",
          step1SubHeading: "Find the right training",
          step1Description:
            "Browse our extensive list of online and on-site training options from the BMI Academy training catalogue to find out which course will take your skills to the next level.",
          step2Heading: "Step 2",
          step2SubHeading: "Improve your skills",
          step2Description:
            "Continuous personal development will keep your skills sharp and make you a valuable asset to the projects you work on.",
          step3Heading: "Step 3",
          step3SubHeading: "Get certified",
          step3Description:
            "Taking courses that carry certifications will let others know that you have the skills needed to carry out certain work."
        }
      ]
    };

    const { container } = render(
      <TrainingCover trainingContentCollection={trainingContent} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders null when no trainingContent is passed", () => {
    const { container } = render(
      <TrainingCover trainingContentCollection={null} />
    );
    expect(container.firstChild).toBeNull();
  });
});
