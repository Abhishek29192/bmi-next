import { updateBreadcrumbTitleFromContentful } from "../breadcrumbUtils";
import { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

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
