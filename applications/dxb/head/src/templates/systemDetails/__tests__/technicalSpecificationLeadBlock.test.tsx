import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";
import { Data as SDPSpecificationNotesData } from "../../../components/ContentfulSpecificationNotes";
import { DataTypeEnum } from "../../../components/link/types";
import { Classification, Feature } from "../../../types/pim";
import Component from "../technicalSpecificationLeadBlock";
import createCardCollectionSection from "../../../__tests__/helpers/CardCollectionSection";
import createRichText from "../../../__tests__/helpers/RichTextHelper";

const technicalSpecClassifications: Classification[] = [
  {
    name: "systemAttributes",
    features: [
      {
        name: "feature1",
        value: "200"
      }
    ]
  }
];

const featureUnit = {
  name: "height",
  unitType: "metric",
  symbol: "in"
};

const specificationNotesData: SDPSpecificationNotesData = {
  __typename: "ContentfulSpecificationNotesWithCta",
  name: "specification notes name",
  title: "specification notes title",
  description: createRichText({
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_3,
          content: [
            { nodeType: "text", value: "test rich text", marks: [], data: {} }
          ],
          data: {}
        }
      ]
    }
  }),
  cta: {
    __typename: "Link",
    id: "string",
    label: "ImALink",
    icon: null,
    isLabelHidden: null,
    url: "https://www.external.co.uk",
    linkedPage: null,
    type: DataTypeEnum.Dialog,
    parameters: null,
    dialogContent: createCardCollectionSection(),
    hubSpotCTAID: null,
    queryParams: null
  }
};

const featureWithUnit: Feature = {
  ...technicalSpecClassifications[0].features[0]
};

describe("TechnicalSpecificationLeadBlock tests", () => {
  beforeEach(() => {
    // resolve useDimensions (useState) hook in ProductFeatureTable
    jest.mock("react", () => ({
      ...jest.requireActual("react"),
      useState: (initial: unknown) => [initial, jest.fn()]
    }));
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("should render correctly", () => {
    describe("when no classifications provided", () => {
      it("With tech spec an empty set", () => {
        const { container } = render(
          <ThemeProvider>
            <Component technicalSpecClassifications={[]} />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.queryByTestId(
            "technical-specification-classifications-accordion-wrapper"
          )
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId(
            "technical-specification-classifications-table-wrapper"
          )
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(featureUnit.symbol, {
            exact: false
          })
        ).not.toBeInTheDocument();
      });
    });

    describe("when One classifications provided", () => {
      it("With no feature units", () => {
        const { container } = render(
          <ThemeProvider>
            <Component
              technicalSpecClassifications={technicalSpecClassifications}
            />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.queryByTestId(
            "technical-specification-classifications-accordion-wrapper"
          )
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId(
            "technical-specification-classifications-table-wrapper"
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByText(featureUnit.symbol, {
            exact: false
          })
        ).not.toBeInTheDocument();
      });

      it("With a feature units", () => {
        const classifications: Classification[] = [
          {
            name: "systemAttributes",
            features: [featureWithUnit]
          }
        ];
        const { container } = render(
          <ThemeProvider>
            <Component technicalSpecClassifications={classifications} />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.getByText(featureWithUnit.value, {
            exact: false
          })
        ).toBeInTheDocument();
      });
    });

    describe("when Multiple classifications provided", () => {
      it("With no feature units", () => {
        const { container } = render(
          <ThemeProvider>
            <Component
              technicalSpecClassifications={[
                ...technicalSpecClassifications,
                ...technicalSpecClassifications
              ]}
            />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.getByTestId(
            "technical-specification-classifications-accordion-wrapper"
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(
            "technical-specification-classifications-table-wrapper"
          )
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(featureUnit.symbol, {
            exact: false
          })
        ).not.toBeInTheDocument();
      });

      it("With more than one feature units", () => {
        const classifications: Classification[] = [
          {
            name: "systemAttributes",
            features: [featureWithUnit, featureWithUnit]
          },
          {
            name: "systemAttributes",
            features: [featureWithUnit, featureWithUnit]
          }
        ];
        const { container } = render(
          <ThemeProvider>
            <Component technicalSpecClassifications={classifications} />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.getAllByText(featureWithUnit.value, {
            exact: false
          })
        ).toBeTruthy();
      });
    });

    describe("when specification provided", () => {
      it("With specification", () => {
        const { container } = render(
          <ThemeProvider>
            <Component
              technicalSpecClassifications={[
                ...technicalSpecClassifications,
                ...technicalSpecClassifications
              ]}
              specificationNotes={specificationNotesData}
            />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(screen.getByTestId("specificationNotes")).toBeInTheDocument();
      });

      it("With no specification", () => {
        const { container } = render(
          <ThemeProvider>
            <Component
              technicalSpecClassifications={[
                ...technicalSpecClassifications,
                ...technicalSpecClassifications
              ]}
            />
          </ThemeProvider>
        );

        expect(container).toMatchSnapshot();
        expect(
          screen.queryByTestId("specificationNotes")
        ).not.toBeInTheDocument();
      });

      it("should pass correct gtm data data", async () => {
        const expectedGTM = JSON.stringify({
          id: "cta-click1",
          action: "https://www.external.co.uk",
          label: "specification notes title - ImALink"
        });
        render(
          <ThemeProvider>
            <Component
              technicalSpecClassifications={[
                ...technicalSpecClassifications,
                ...technicalSpecClassifications
              ]}
              specificationNotes={specificationNotesData}
            />
          </ThemeProvider>
        );

        const specificationNotesCTA = screen.getByRole("button", {
          name: "ImALink"
        });
        expect(specificationNotesCTA).toHaveAttribute("data-gtm", expectedGTM);
      });
    });
  });
});
