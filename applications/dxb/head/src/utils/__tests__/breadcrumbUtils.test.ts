import {
  updateBreadcrumbTitleFromContentful,
  checkIfActiveLabelInParentNode
} from "../breadcrumbUtils";
import { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import { DataTypeEnum, NavigationData } from "../../components/Link";

describe("updateBreadcrumbTitleFromContentful function", () => {
  it("should update title of breadcrumb by contentful if updated title exist and should not be truncated if the length less than 20 characters", () => {
    const mockBreadcrumbs: BreadcrumbsData = [
      {
        label: "label-mock",
        id: "id-mock",
        slug: "slug-mock"
      }
    ];
    const mockBreadcrumbTitle: string | null = "mock-breadcrumb";

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
      mockBreadcrumbs,
      mockBreadcrumbTitle
    );
    const result = [
      {
        ...mockBreadcrumbs[0],
        label: mockBreadcrumbTitle
      }
    ];

    expect(enhancedBreadcrumbs).toEqual(result);
  });
  it("should update title of breadcrumb by contentful if updated title exist and truncate it, if it is more than 20 characters and add '...' at the end", () => {
    const mockBreadcrumbs: BreadcrumbsData = [
      {
        label: "label-mock",
        id: "id-mock",
        slug: "slug-mock"
      }
    ];
    const mockBreadcrumbTitle: string | null = "mock-breadcrumb-title";
    const mockBreadcrumbTitleTruncated = "mock-breadcrumb-tit...";

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
      mockBreadcrumbs,
      mockBreadcrumbTitle
    );
    const result = [
      {
        ...mockBreadcrumbs[0],
        label: mockBreadcrumbTitleTruncated
      }
    ];

    expect(enhancedBreadcrumbs).toEqual(result);
  });
  it("should not update title of breadcrumb by contentful if updated title does not exist", () => {
    const mockBreadcrumbs: BreadcrumbsData = [
      {
        label: "label-mock",
        id: "id-mock",
        slug: "slug-mock"
      }
    ];
    const mockBreadcrumbTitle: string | null = null;

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
      mockBreadcrumbs,
      mockBreadcrumbTitle
    );
    const result = [...mockBreadcrumbs];

    expect(enhancedBreadcrumbs).toEqual(result);
  });
});

describe("checkIfActiveLabelInParentNode function", () => {
  const mockBreadcrumbs = "label-mock";
  it("should return parentNode", () => {
    const mockNestedNavigation: NavigationData = {
      __typename: "ContentfulNavigation",
      label: "Main navigation",
      link: null,
      links: [
        {
          __typename: "ContentfulNavigation",
          label: "test link",
          link: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "id-mock",
              url: null,
              label: "label-mock",
              isLabelHidden: null,
              icon: "Phone",
              linkedPage: null,
              type: DataTypeEnum.External,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null
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
      __typename: "ContentfulNavigation",
      label: "Main navigation",
      link: null,
      links: [
        {
          __typename: "ContentfulNavigation",
          label: "Get in touch",
          link: null,
          links: [
            {
              __typename: "ContentfulLink",
              id: "",
              label: "+44 (0) 1234567890",
              url: "tel:+4401234567890",
              isLabelHidden: null,
              icon: "Phone",
              linkedPage: null,
              type: DataTypeEnum.External,
              parameters: null,
              dialogContent: null,
              hubSpotCTAID: null
            }
          ]
        },
        {
          __typename: "ContentfulNavigation",
          label: "About BMI",
          link: null,
          links: [
            {
              __typename: "ContentfulLink",
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
              hubSpotCTAID: null
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
