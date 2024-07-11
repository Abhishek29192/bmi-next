import createBreadcrumbItem from "../../__tests__/helpers/BreadcrumbItemHelper";
import { DataTypeEnum, NavigationData } from "../../components/link/types";
import {
  checkIfActiveLabelInParentNode,
  updateBreadcrumbTitleFromContentful
} from "../breadcrumbUtils";

describe("updateBreadcrumbTitleFromContentful function", () => {
  const breadcrumbs = [
    createBreadcrumbItem(),
    createBreadcrumbItem(),
    createBreadcrumbItem()
  ];

  it("should replace the last breadcrumb item's label with the breadcrumbTitle when defined and return the new breadcrumb array", () => {
    const mockBreadcrumbTitle = "mock-breadcrumb-title";

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
      breadcrumbs,
      mockBreadcrumbTitle
    );

    const result = [...breadcrumbs];
    result[result.length - 1].label = mockBreadcrumbTitle;

    expect(enhancedBreadcrumbs).toEqual(result);
  });

  it("should not replace the last breadcrumb item's label with the breadcrumbTitle if null and return the original breadcrumb array", () => {
    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
      breadcrumbs,
      null
    );
    expect(enhancedBreadcrumbs).toEqual(breadcrumbs);
  });
});

describe("checkIfActiveLabelInParentNode function", () => {
  const mockBreadcrumbs = "label-mock";
  it("should return parentNode", () => {
    const mockNestedNavigation: NavigationData = {
      __typename: "Navigation",
      label: "Main navigation",
      link: null,
      links: [
        {
          __typename: "Navigation",
          label: "test link",
          link: null,
          links: [
            {
              __typename: "Link",
              id: "id-mock",
              url: null,
              label: "label-mock",
              isLabelHidden: null,
              icon: "Phone",
              linkedPage: null,
              type: DataTypeEnum.External,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null,
              queryParams: null
            }
          ]
        }
      ]
    };
    const res = checkIfActiveLabelInParentNode(
      mockBreadcrumbs,
      mockNestedNavigation
    );
    expect(res).toEqual("test link");
  });
  it("should return empty strings", () => {
    const mockNestedNavigation: NavigationData = {
      __typename: "Navigation",
      label: "Main navigation",
      link: null,
      links: [
        {
          __typename: "Navigation",
          label: "Get in touch",
          link: null,
          links: [
            {
              __typename: "Link",
              id: "",
              label: "+44 (0) 1234567890",
              url: "tel:+4401234567890",
              isLabelHidden: null,
              icon: "Phone",
              linkedPage: null,
              type: DataTypeEnum.External,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null,
              queryParams: null
            }
          ]
        },
        {
          __typename: "Navigation",
          label: "About BMI",
          link: null,
          links: [
            {
              __typename: "Link",
              id: "",
              label: "Our story",
              url: null,
              isLabelHidden: null,
              icon: null,
              linkedPage: {
                path: "landing-page"
              },
              type: DataTypeEnum.Internal,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null,
              queryParams: null
            }
          ]
        }
      ]
    };
    const res = checkIfActiveLabelInParentNode(
      mockBreadcrumbs,
      mockNestedNavigation
    );
    expect(res).toEqual("");
  });
});
