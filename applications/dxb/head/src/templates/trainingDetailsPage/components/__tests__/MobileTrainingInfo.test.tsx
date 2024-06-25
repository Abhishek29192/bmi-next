import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import { typographyClasses } from "@bmi-digital/components/typography";
import MobileTrainingInfo, {
  MobileTrainingInfoProps
} from "../MobileTrainingInfo";

const trainingData: MobileTrainingInfoProps = {
  name: "Test course",
  categoryName: "Pitched",
  code: "IT_TEST_01",
  course_type: "elearning",
  img_url: "https://fake-image.jpg",
  price: "0",
  currencySymbol: "€"
};

describe("MobileTrainingInfo component", () => {
  it("renders image correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} />
      </ThemeProvider>
    );

    const trainingImage = screen.getByTestId("training-image");
    expect(trainingImage).toHaveAttribute("src", trainingData.img_url);
    expect(trainingImage).toHaveAttribute("alt", trainingData.name);
  });

  it("renders training name correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} />
      </ThemeProvider>
    );

    const title = screen.getByRole("heading", {
      level: 1,
      name: trainingData.name
    });
    expect(title).toHaveTextContent(trainingData.name);
    expect(title).toHaveClass(typographyClasses.underline);
  });

  it("renders training code correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} />
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
        <MobileTrainingInfo {...trainingData} categoryName="Pitched" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.pitched"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("pitched-training-category-icon")
    ).toBeInTheDocument();
  });

  it("renders 'flat 'training category correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} categoryName="Flat" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.flat"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("flat-training-category-icon")
    ).toBeInTheDocument();
  });

  it("renders 'Other 'training category correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} categoryName="Other" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingCategory.other"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("other-training-category-icon")
    ).toBeInTheDocument();
  });

  it("renders training 'elearning' type correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} course_type="elearning" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.elearning"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("elearning-training-type-icon")
    ).toBeInTheDocument();
  });

  it("renders training 'webinar' type correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} course_type="webinar" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.webinar"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("webinar-training-type-icon")
    ).toBeInTheDocument();
  });

  it("renders training 'classroom' type correctly", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} course_type="classroom" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: trainingType.classroom"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("classroom-training-type-icon")
    ).toBeInTheDocument();
  });

  it("renders training price correctly if a training is free", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} price="0" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "MC: training.price.free"
      })
    ).toBeInTheDocument();
  });

  it("renders training price correctly if a training is paid", () => {
    render(
      <ThemeProvider>
        <MobileTrainingInfo {...trainingData} price="100" currencySymbol="€" />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 6,
        name: "€100"
      })
    ).toBeInTheDocument();
  });
});
