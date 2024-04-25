import { ThemeProvider } from "@bmi-digital/components";
import { createTraining } from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import TrainingRegistrationHeader from "../components/TrainingRegistrationHeader";

describe("Training Registration Header component", () => {
  it("should render the title correctly", () => {
    const training = createTraining();
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader training={training} />
      </ThemeProvider>
    );
    expect(
      screen.getByText(`${training.courseName} MC: training.registration`)
    ).toBeInTheDocument();
  });

  it("should render training code correctly", () => {
    const training = createTraining();
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader training={training} />
      </ThemeProvider>
    );
    expect(screen.getByText(training.courseCode)).toBeInTheDocument();
  });

  it("should render training category correctly", () => {
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader
          training={createTraining({ category: "Pitched" })}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByText("MC: trainingCategory.pitched")
    ).toBeInTheDocument();
  });

  it("should render training type correctly", () => {
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader
          training={createTraining({ courseType: "elearning" })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("MC: trainingType.elearning")).toBeInTheDocument();
  });

  it("should render price correctly if training is paid", () => {
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader
          training={createTraining({
            price: 100,
            currencySymbol: "€",
            onSale: true
          })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("€100")).toBeInTheDocument();
  });

  it("should render price correctly if training is free", () => {
    render(
      <ThemeProvider>
        <TrainingRegistrationHeader
          training={createTraining({
            price: 0,
            onSale: false
          })}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("MC: training.price.free")).toBeInTheDocument();
  });

  it("should render training start date correctly", () => {
    const startDate = new Date(1703800800000);

    render(
      <ThemeProvider>
        <TrainingRegistrationHeader
          training={createTraining({ startDate: startDate.getTime() })}
        />
      </ThemeProvider>
    );
    expect(
      /** The idea of startDate.getDate() is to keep the test green
       * for different timezones. The date will change
       * depending on the timezone and as a result the test will fail */
      screen.getByText(`${startDate.getDate()}. desember 2023`)
    ).toBeInTheDocument();
  });
});
