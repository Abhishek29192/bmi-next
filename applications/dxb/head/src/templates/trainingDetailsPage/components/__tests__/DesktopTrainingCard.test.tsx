import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import DesktopTrainingCard, {
  DesktopTrainingCardProps
} from "../DesktopTrainingCard";

const trainingData: DesktopTrainingCardProps = {
  name: "Test course",
  categoryName: "Pitched",
  code: "IT_TEST_01",
  course_type: "elearning",
  img_url: "https://fake-image.jpg",
  price: "0",
  currencySymbol: "€",
  sessionsContainerId: "active-sessions"
};

describe("DesktopTrainingCard component", () => {
  it("should render img correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard
          {...trainingData}
          img_url="https://fake-image.jpg"
        />
      </ThemeProvider>
    );
    expect(screen.getByAltText(trainingData.name)).toHaveAttribute(
      "src",
      trainingData.img_url
    );
  });

  it("should render title correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", { level: 4, name: trainingData.name })
    ).toBeInTheDocument();
  });

  it("should render subtitle correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 5,
        name: `MC: training.courseCodeLabel ${trainingData.code}`
      })
    ).toBeInTheDocument();
  });

  it("renders 'pitched 'training category correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} categoryName="Pitched" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.pitched"
      })
    ).toBeInTheDocument();
  });

  it("renders 'flat 'training category correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} categoryName="Flat" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.flat"
      })
    ).toBeInTheDocument();
  });

  it("renders 'Other 'training category correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} categoryName="Other" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.other"
      })
    ).toBeInTheDocument();
  });

  it("renders training 'elearning' type correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} course_type="elearning" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.elearning"
      })
    ).toBeInTheDocument();
  });

  it("renders training 'webinar' type correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} course_type="webinar" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.webinar"
      })
    ).toBeInTheDocument();
  });

  it("renders training 'classroom' type correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} course_type="classroom" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.classroom"
      })
    ).toBeInTheDocument();
  });

  it("should render training price if provided", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} price="100" currencySymbol="€" />
      </ThemeProvider>
    );
    expect(screen.getByText("€100")).toBeInTheDocument();
  });

  it("should render correct microcopy if a course is free", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} price="0" />
      </ThemeProvider>
    );
    expect(screen.getByText("MC: training.price.free")).toBeInTheDocument();
  });

  it("renders the footer button correctly", () => {
    render(
      <ThemeProvider>
        <DesktopTrainingCard {...trainingData} price="0" />
      </ThemeProvider>
    );

    const footerButton = screen.getByTestId(
      "training-details-card-footer-button"
    );
    expect(footerButton).toHaveTextContent(
      "MC: trainingDetails.see.available.sessions.button"
    );
    expect(footerButton).toHaveAttribute(
      "href",
      `#${trainingData.sessionsContainerId}`
    );
  });
});
