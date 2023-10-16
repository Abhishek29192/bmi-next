import React from "react";
import { screen } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import { createTraining } from "@bmi/elasticsearch-types";
import TrainingListerPage from "../training-lister-page";
import { TrainingListerPageProps } from "../types";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import { UseTrainings } from "../hooks/useTrainings";
import TrainingCatalogue from "../components/training-catalogue";

const breadcrumbs = [
  {
    id: "test",
    label: "test",
    slug: "/test"
  }
];

const props: TrainingListerPageProps = {
  data: {
    contentfulTrainingListerPage: {
      __typename: "ContentfulTrainingListerPage",
      title: "Contentful training lister page title",
      subtitle: "Contentful training lister page subtitle",
      breadcrumbTitle: "All trainings",
      featuredMedia: createImageData(),
      path: "/all-trainings",
      seo: {
        metaTitle: "Training liter page",
        metaDescription: "How can we help?",
        noIndex: false
      },
      breadcrumbs
    },
    contentfulSite: createMockSiteData()
  },
  pageContext: { variantCodeToPathMap: {} }
};

jest.mock("../../../utils/breadcrumbUtils", () => ({
  ...jest.requireActual("../../../utils/breadcrumbUtils"),
  updateBreadcrumbTitleFromContentful: jest
    .fn()
    .mockReturnValue([{ id: "id", label: "label", slug: "slug" }])
}));

const useTrainingsResult: ReturnType<UseTrainings> = {
  initialLoading: false,
  groupedTrainings: {},
  total: {},
  fetchPaginatedTrainings: jest.fn(),
  collapseCatalogueCourses: jest.fn()
};

jest.mock("../hooks/useTrainings", () => ({
  useTrainings: () => useTrainingsResult
}));

jest.mock("../components/training-catalogue");

describe("Training lister page", () => {
  it("renders correctly if initialLoading === true", () => {
    const originInitialLoading = useTrainingsResult.initialLoading;
    useTrainingsResult.initialLoading = true;
    renderWithRouter(
      <ThemeProvider>
        <TrainingListerPage {...props} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("progress-indicator")).toBeInTheDocument();
    expect(updateBreadcrumbTitleFromContentful).toHaveBeenCalledWith(
      breadcrumbs,
      props.data.contentfulTrainingListerPage.breadcrumbTitle
    );
    expect(
      screen.getByTestId("training-landing-page-hero-breadcrumbs")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("training-lister-page-breadcrumbs-bottom")
    ).toBeInTheDocument();
    useTrainingsResult.initialLoading = originInitialLoading;
  });

  it("renders correctly if initialLoading === false", () => {
    const originInitialLoading = useTrainingsResult.initialLoading;
    useTrainingsResult.initialLoading = false;
    renderWithRouter(
      <ThemeProvider>
        <TrainingListerPage {...props} />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("progress-indicator")).not.toBeInTheDocument();
    expect(updateBreadcrumbTitleFromContentful).toHaveBeenCalledWith(
      breadcrumbs,
      props.data.contentfulTrainingListerPage.breadcrumbTitle
    );
    expect(
      screen.getByTestId("training-landing-page-hero-breadcrumbs")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("training-lister-page-breadcrumbs-bottom")
    ).toBeInTheDocument();
    useTrainingsResult.initialLoading = originInitialLoading;
  });

  it("works correctly if useTrainings returns trainings", () => {
    const training1 = createTraining({
      courseId: 1,
      catalogueId: 1,
      id: "1-1"
    });
    const training2 = createTraining({
      courseId: 2,
      catalogueId: 2,
      id: "2-2"
    });

    const initialTrainings = useTrainingsResult.groupedTrainings;
    const initialTotal = useTrainingsResult.total;
    useTrainingsResult.groupedTrainings = { 1: [training1], 2: [training2] };
    useTrainingsResult.total = { 1: 1, 2: 1 };
    renderWithRouter(
      <ThemeProvider>
        <TrainingListerPage {...props} />
      </ThemeProvider>
    );

    expect(TrainingCatalogue).toHaveBeenCalledTimes(2);
    expect(TrainingCatalogue).toHaveBeenNthCalledWith(
      1,
      {
        defaultImageUrl:
          props.data.contentfulTrainingListerPage.featuredMedia.image.file.url,
        courses: [training1],
        countryCode: props.data.contentfulSite.countryCode,
        fetchPaginatedTrainings: useTrainingsResult.fetchPaginatedTrainings,
        collapseCatalogueCourses: useTrainingsResult.collapseCatalogueCourses,
        total: useTrainingsResult.total["1"]
      },
      {}
    );
    expect(TrainingCatalogue).toHaveBeenNthCalledWith(
      2,
      {
        defaultImageUrl:
          props.data.contentfulTrainingListerPage.featuredMedia.image.file.url,
        courses: [training2],
        countryCode: props.data.contentfulSite.countryCode,
        fetchPaginatedTrainings: useTrainingsResult.fetchPaginatedTrainings,
        collapseCatalogueCourses: useTrainingsResult.collapseCatalogueCourses,
        total: useTrainingsResult.total["2"]
      },
      {}
    );

    useTrainingsResult.groupedTrainings = initialTrainings;
    useTrainingsResult.total = initialTotal;
  });

  it("calls updateBreadcrumbTitleFromContentful function correctly if breadcrumbs === null", () => {
    renderWithRouter(
      <ThemeProvider>
        <TrainingListerPage
          {...props}
          data={{
            ...props.data,
            contentfulTrainingListerPage: {
              ...props.data.contentfulTrainingListerPage,
              breadcrumbs: null
            }
          }}
        />
      </ThemeProvider>
    );

    expect(updateBreadcrumbTitleFromContentful).toHaveBeenCalledWith(
      [],
      props.data.contentfulTrainingListerPage.breadcrumbTitle
    );
  });
});
