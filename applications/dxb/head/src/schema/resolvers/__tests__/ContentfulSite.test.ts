import resolveContentfulSite from "../ContentfulSite";
import createContentfulSite, {
  createContentfulResources
} from "../types/helpers/ContentfulSiteHelper";
import createContentfulNavigation from "../types/helpers/ContentfulNavigationHelper";
import createContentfulTitleWithContent from "../types/helpers/ContentfulTitleWithContent";
import createContentfulRichText from "../types/helpers/ContentfulRichText";
import type { Navigation } from "../types/Site";
import type { ContentfulRichText } from "../types/RichText";
import type { ContentfulTitleWithContentData } from "../types/TitleWithContent";

const resolveNavigationMock = jest.fn();
jest.mock("../ContentfulNavigation", () => ({
  __esModule: true,
  default: (navigation: Navigation) => resolveNavigationMock(navigation)
}));

const resolveTitleWithContentMock = jest.fn();
jest.mock("../ContentfulTitleWithContent", () => ({
  __esModule: true,
  default: (titleWithContent: ContentfulTitleWithContentData) =>
    resolveTitleWithContentMock(titleWithContent)
}));

const resolveRichTextMock = jest.fn();
jest.mock("../ContentfulRichText", () => ({
  __esModule: true,
  default: (richText: ContentfulRichText) => resolveRichTextMock(richText)
}));

const resolveMicroCopiesMock = jest.fn();
jest.mock("../ContentfulMicroCopy", () => ({
  __esModule: true,
  default: () => resolveMicroCopiesMock()
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveNavigationMock.mockResolvedValue("resolved-navigation");
  resolveTitleWithContentMock.mockResolvedValue("resolved-title-with-content");
  resolveRichTextMock.mockResolvedValue("resolved-rich-text");
  resolveMicroCopiesMock.mockResolvedValue("resolved-microcopies");
});

describe("ContentfulSite resolver", () => {
  it("should return null for menuUtilities field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ menuUtilities: null })
    );
    expect(resolvedSite.menuUtilities).toBeNull();
  });

  it("should resolve menuUtilities field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ menuUtilities: createContentfulNavigation() })
    );
    expect(resolvedSite.menuUtilities).toBe("resolved-navigation");
  });

  it("should return null for footerMainNavigation field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ footerMainNavigation: null })
    );
    expect(resolvedSite.footerMainNavigation).toBeNull();
  });

  it("should resolve footerMainNavigation field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        footerMainNavigation: createContentfulNavigation()
      })
    );
    expect(resolvedSite.footerMainNavigation).toBe("resolved-navigation");
  });

  it("should return null for footerSecondaryNavigation field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ footerSecondaryNavigation: null })
    );
    expect(resolvedSite.footerSecondaryNavigation).toBeNull();
  });

  it("should resolve footerSecondaryNavigation field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        footerSecondaryNavigation: createContentfulNavigation()
      })
    );
    expect(resolvedSite.footerSecondaryNavigation).toBe("resolved-navigation");
  });

  it("should return null for pitchedRoofCalculatorConfig field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ pitchedRoofCalculatorConfig: null })
    );
    expect(resolvedSite.pitchedRoofCalculatorConfig).toBeNull();
  });

  it("should resolve pitchedRoofCalculatorConfig field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        pitchedRoofCalculatorConfig: {
          needHelpSection: createContentfulTitleWithContent(),
          roofShapesCollection: {
            items: [
              { roofShapeId: "1" },
              { roofShapeId: "2" },
              { roofShapeId: "3" }
            ]
          },
          hubSpotFormId: "hub-spot-form-id"
        }
      })
    );
    expect(resolvedSite.pitchedRoofCalculatorConfig).toEqual({
      needHelpSection: "resolved-title-with-content",
      roofShapes: [
        { roofShapeId: "1" },
        { roofShapeId: "2" },
        { roofShapeId: "3" }
      ],
      hubSpotFormId: "hub-spot-form-id"
    });
  });

  it("should return null for visualiserHouseTypes field if visualiserHouseTypesCollection field is not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({ visualiserHouseTypesCollection: null })
    );
    expect(resolvedSite.visualiserHouseTypes).toBeNull();
  });

  it("should return visualiserHouseTypes field if visualiserHouseTypesCollection field is provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        visualiserHouseTypesCollection: {
          items: [
            {
              houseModel: {
                url: "house-model-url"
              }
            }
          ]
        }
      })
    );
    expect(resolvedSite.visualiserHouseTypes).toEqual([
      { houseModel: { url: "house-model-url" } }
    ]);
  });

  it("should call 'getMicroCopies' if resources provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        resources: createContentfulResources()
      })
    );
    expect(resolvedSite.resources.microCopy).toBe("resolved-microcopies");
  });

  it("should return null for welcomeDialogBody field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        resources: createContentfulResources({ welcomeDialogBody: null })
      })
    );
    expect(resolvedSite.resources.welcomeDialogBody).toBeNull();
  });

  it("should resolve welcomeDialogBody field if not provided", async () => {
    const resolvedSite = await resolveContentfulSite(
      createContentfulSite({
        resources: createContentfulResources({
          welcomeDialogBody: createContentfulRichText()
        })
      })
    );
    expect(resolvedSite.resources.welcomeDialogBody).toBe("resolved-rich-text");
  });
});
