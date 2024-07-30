import { Filter as FilterType } from "@bmi-digital/components/filters";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { createTraining } from "@bmi/elasticsearch-types";
import { screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import TrainingCatalogue from "../components/training-catalogue";
import { UseTrainings } from "../hooks/useTrainings";
import TrainingListerPage from "../training-lister-page";
import { TrainingListerPageProps } from "../types";
import createRichText from "../../../__tests__/helpers/RichTextHelper";

const breadcrumbs = [
  {
    id: "test",
    label: "test",
    slug: "/test"
  }
];

const filters: FilterType[] = [
  {
    filterCode: "filter1",
    label: "filter1",
    name: "filter1",
    value: [],
    options: [
      {
        value: "value",
        label: "filterLabel",
        isDisabled: false
      }
    ]
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
      searchTips: {
        __typename: "TitleWithContent",
        title: "",
        name: "",
        content: createRichText({
          json: {
            nodeType: BLOCKS.DOCUMENT,
            data: {},
            content: []
          }
        })
      },
      path: "/all-trainings",
      seo: {
        metaTitle: "Training liter page",
        metaDescription: "How can we help?",
        noIndex: false
      },
      breadcrumbs,
      filters
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
  collapseCatalogueCourses: jest.fn(),
  handleFiltersChange: jest.fn(),
  handleResetFilters: jest.fn(),
  filters,
  searchQuery: ""
};

jest.mock("../hooks/useTrainings", () => ({
  useTrainings: () => useTrainingsResult
}));

jest.mock("../components/training-catalogue");

jest.mock("../components/training-no-results", () => ({
  __esModule: true,
  default: () => <div data-testid="no-results-section"></div>
}));

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

  it("renders no-results section if initialLoading = false nad there are no trainings", () => {
    const originInitialLoading = useTrainingsResult.initialLoading;
    const initialTrainings = useTrainingsResult.groupedTrainings;
    useTrainingsResult.initialLoading = false;
    useTrainingsResult.groupedTrainings = {};
    renderWithRouter(
      <ThemeProvider>
        <TrainingListerPage {...props} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("no-results-section")).toBeInTheDocument();
    useTrainingsResult.initialLoading = originInitialLoading;
    useTrainingsResult.groupedTrainings = initialTrainings;
  });

  it("works correctly if useTrainings returns trainings", () => {
    const training1 = createTraining({
      courseId: 1,
      catalogueId: "1",
      id: "1-1"
    });
    const training2 = createTraining({
      courseId: 2,
      catalogueId: "2",
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
          props.data.contentfulTrainingListerPage.featuredMedia.image.url,
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
          props.data.contentfulTrainingListerPage.featuredMedia.image.url,
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
