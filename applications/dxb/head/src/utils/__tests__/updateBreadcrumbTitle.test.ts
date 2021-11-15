import { updateBreadcrumbTitleFromContentfull } from "../updateBreadcrumbTitle";
import { Data as BreadcrumbsData } from "../../components/Breadcrumbs";

describe("updateBreadcrumbTitleFromContentfull function", () => {
  it("should update title of breadcrumb by contentful if updated title exist", () => {
    const mockBreadcrumbs: BreadcrumbsData = [
      {
        label: "label-mock",
        id: "id-mock",
        slug: "slug-mock"
      }
    ];
    const mockBreadcrumbTitle: string | null = "mock-breadcrumb-title";

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentfull(
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
  it("should not update title of breadcrumb by contentful if updated title does not exist", () => {
    const mockBreadcrumbs: BreadcrumbsData = [
      {
        label: "label-mock",
        id: "id-mock",
        slug: "slug-mock"
      }
    ];
    const mockBreadcrumbTitle: string | null = null;

    const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentfull(
      mockBreadcrumbs,
      mockBreadcrumbTitle
    );
    const result = [...mockBreadcrumbs];

    expect(enhancedBreadcrumbs).toEqual(result);
  });
});
