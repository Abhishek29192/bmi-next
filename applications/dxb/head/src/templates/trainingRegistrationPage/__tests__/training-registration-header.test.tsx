import { ThemeProvider } from "@bmi-digital/components";
import { createTraining } from "@bmi/elasticsearch-types";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import TrainingRegistrationHeader from "../components/TrainingRegistrationHeader";

const esIndexNameTrainings = "dxb-all-trainings_read";

describe("Training Registration Header component", () => {
  it("should render correctly if all data is available", async () => {
    const training = createTraining({
      onSale: true,
      price: 1000,
      startDate: "2023-12-29 00:00:00"
    });
    render(
      <ThemeProvider>
        <ConfigProvider
          configOverride={{
            esIndexNameTrainings: esIndexNameTrainings
          }}
        >
          <TrainingRegistrationHeader training={training} />
        </ConfigProvider>
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      `${training.courseName} MC: training.registration`
    );
    expect(screen.getByTestId("training-id")).toBeInTheDocument();
    expect(screen.getByTestId("training-category")).toBeInTheDocument();
    expect(screen.getByTestId("training-type")).toBeInTheDocument();
    expect(screen.getByTestId("training-price")).toBeInTheDocument();
    expect(screen.getByText("€1000")).toBeInTheDocument();
    expect(screen.getByTestId("training-start-date")).toBeInTheDocument();
  });

  it("should render component with 'FREE' if training is not on sale", async () => {
    const training = createTraining({ onSale: false });
    render(
      <ThemeProvider>
        <ConfigProvider
          configOverride={{
            esIndexNameTrainings: esIndexNameTrainings
          }}
        >
          <TrainingRegistrationHeader training={training} />
        </ConfigProvider>
      </ThemeProvider>
    );

    expect(screen.getByText("MC: training.price.free")).toBeInTheDocument();
  });

  it("should not render startDate container if startDate property is not provided", async () => {
    const training = createTraining({ startDate: null });
    render(
      <ThemeProvider>
        <ConfigProvider
          configOverride={{
            esIndexNameTrainings: esIndexNameTrainings
          }}
        >
          <TrainingRegistrationHeader training={training} />
        </ConfigProvider>
      </ThemeProvider>
    );

    expect(screen.queryByTestId("training-start-date")).not.toBeInTheDocument();
  });
});
