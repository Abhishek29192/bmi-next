import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { createTraining } from "@bmi/elasticsearch-types";
import TrainingCatalogue, { Props } from "../components/training-catalogue";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";

const countryCode = "no";
const defaultImage = "https://fake-default-image";

const defaultProps: Props = {
  countryCode: countryCode,
  defaultImageUrl: defaultImage,
  fetchPaginatedTrainings: jest.fn(),
  collapseCatalogueCourses: jest.fn(),
  total: 1,
  courses: [createTraining()]
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Training Catalogue component", () => {
  it("renders catalogue description correctly", () => {
    renderWithProviders(
      <TrainingCatalogue
        {...defaultProps}
        courses={[
          createTraining({
            catalogueDescription: "<p>catalogue description</p>"
          })
        ]}
      />
    );
    expect(screen.getByTestId("catalogue-description")).toHaveTextContent(
      "catalogue description"
    );
  });

  it("renders without 'Show more' button if there are 6 or less than 6 courses", () => {
    const trainings = new Array(6);
    trainings.fill(createTraining());

    renderWithProviders(
      <TrainingCatalogue {...defaultProps} total={6} courses={trainings} />
    );
    expect(
      screen.queryByText("MC: trainingCatalogue.showMore")
    ).not.toBeInTheDocument();
  });

  it("renders with 'Show more' button if there are more than 6 courses", () => {
    renderWithProviders(<TrainingCatalogue {...defaultProps} total={7} />);
    expect(
      screen.getByText("MC: trainingCatalogue.showMore")
    ).toBeInTheDocument();
  });

  it("calls 'fetchPaginatedTrainings' and renders 'Show less' if a user clicks 'Show more'", async () => {
    renderWithProviders(<TrainingCatalogue {...defaultProps} total={13} />);

    expect(
      screen.queryByText("MC: trainingCatalogue.showLess")
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("MC: trainingCatalogue.showMore"));
    expect(defaultProps.fetchPaginatedTrainings).toHaveBeenCalledWith(
      defaultProps.courses[0].catalogueId,
      6
    );
    expect(
      screen.queryByText("MC: trainingCatalogue.showLess")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("MC: trainingCatalogue.showMore"));
    expect(defaultProps.fetchPaginatedTrainings).toHaveBeenCalledWith(
      defaultProps.courses[0].catalogueId,
      12
    );

    expect(
      screen.queryByText("MC: trainingCatalogue.showMore")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("MC: trainingCatalogue.showLess")
    ).toBeInTheDocument();
  });

  it("calls 'collapseCatalogueCourses' and renders 'Show more' once a user clicks 'Show less' button", async () => {
    renderWithProviders(<TrainingCatalogue {...defaultProps} total={7} />);

    expect(
      screen.queryByText("MC: trainingCatalogue.showLess")
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("MC: trainingCatalogue.showMore"));

    expect(
      await screen.findByText("MC: trainingCatalogue.showLess")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("MC: trainingCatalogue.showLess"));
    expect(defaultProps.collapseCatalogueCourses).toHaveBeenCalledWith(
      defaultProps.courses[0].catalogueId
    );

    expect(
      screen.queryByText("MC: trainingCatalogue.showLess")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("MC: trainingCatalogue.showMore")
    ).toBeInTheDocument();
  });

  it("renders with the default image if not provided", () => {
    const training = createTraining({ imgUrl: undefined });

    renderWithProviders(
      <TrainingCatalogue {...defaultProps} courses={[training]} />
    );
    expect(screen.getByAltText(training.name).getAttribute("src")).toBe(
      defaultImage
    );
  });

  it("renders correct label for 'Flat' category", () => {
    renderWithProviders(
      <TrainingCatalogue
        {...defaultProps}
        courses={[createTraining({ category: "Flat" })]}
      />
    );
    expect(screen.getByText("MC: trainingCategory.flat")).toBeInTheDocument();
  });

  it("renders correct label for 'Pitched' category", () => {
    renderWithProviders(
      <TrainingCatalogue
        {...defaultProps}
        courses={[createTraining({ category: "Pitched" })]}
      />
    );
    expect(
      screen.getByText("MC: trainingCategory.pitched")
    ).toBeInTheDocument();
  });

  it("renders correct label for 'Other' category", () => {
    renderWithProviders(
      <TrainingCatalogue
        {...defaultProps}
        courses={[createTraining({ category: "Other" })]}
      />
    );
    expect(screen.getByText("MC: trainingCategory.other")).toBeInTheDocument();
  });
});
