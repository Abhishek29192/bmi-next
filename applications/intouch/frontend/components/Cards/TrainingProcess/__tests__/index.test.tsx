import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { TrainingProcessCard } from "..";

describe("TrainingProcessCard component", () => {
  it("renders correctly", () => {
    const data = {
      items: [
        {
          pageSubHeading: "The Training Process",
          step1Heading: "Step 1",
          step1SubHeading: "Find the right training",
          step1Description: `Search our extensive library of classroom training, workshops,
      online webinars and e-learning courses to find what you need and
      take your skills to the next level.`,
          step2Heading: "Step 2",
          step2SubHeading: "Increase your skills",
          step2Description: `Continue personal development to hone your skills in areas where you
      need additional knowledge.`,
          step3Heading: "Step 3",
          step3SubHeading: "Get certified",
          step3Description: `Develop your training achievements by collecting BMI certificates,
      which you can additionally share with others. They will always be
      visible on your profile.`
        }
      ]
    };

    const { container } = render(
      <ThemeProvider>
        <TrainingProcessCard data={data} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
