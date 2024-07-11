import createContentfulLink from "../types/helpers/ContentfulLinkHelper";
import { Page as PageData, Path } from "../utils/path";
import resolveLink from "../ContentfulLink";
import { DataTypeEnum } from "../../../components/link/types";
import createContentfulFormSectionData from "../types/helpers/ContentfulFormSectionHelper";
import creatContentfulParentPage from "../types/helpers/ContentfulParentPageHelper";
import type { ContentfulFormSection } from "../types/FormSection";

const resolveFormSectionMock = jest.fn();
jest.mock("../ContentfulFormSection", () => ({
  __esModule: true,
  default: (formSectionData: ContentfulFormSection) =>
    resolveFormSectionMock(formSectionData)
}));

const resolvePathMock = jest.fn();
const getUrlFromPathMock = jest.fn();
jest.mock("../utils/path", () => ({
  resolvePath: (pageData: PageData) => resolvePathMock(pageData),
  getUrlFromPath: (path: Path) => getUrlFromPathMock(path)
}));

const pathMock: Path = [
  {
    id: "path-id",
    path: "path",
    label: "label",
    queryParams: "query params",
    slug: "slug"
  }
];

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  resolveFormSectionMock.mockResolvedValue("resolved-form-section");
  resolvePathMock.mockResolvedValue(pathMock);
  getUrlFromPathMock.mockReturnValue("url-from-path");
});

describe("ContentfulLink resolver", () => {
  it("should not call form section resolver if dialogContent field is null", async () => {
    const resolvedLink = await resolveLink(
      createContentfulLink({ dialogContent: null })
    );
    expect(resolveFormSectionMock).not.toHaveBeenCalled();
    expect(resolvedLink.dialogContent).toBeNull();
  });

  it("should not call path resolvers if linkedPage field is null", async () => {
    const resolvedLink = await resolveLink(
      createContentfulLink({ linkedPage: null })
    );
    expect(resolvePathMock).not.toHaveBeenCalled();
    expect(getUrlFromPathMock).not.toHaveBeenCalled();
    expect(resolvedLink.linkedPage).toBeNull();
  });

  it("should return parameters as null if not provided", async () => {
    const resolvedLink = await resolveLink(
      createContentfulLink({ parameters: null, type: DataTypeEnum.External })
    );
    expect(resolvedLink.parameters).toBeNull();
  });

  it("should return parameters as null if link type is not 'Visualiser'", async () => {
    const resolvedLink = await resolveLink(
      createContentfulLink({
        type: DataTypeEnum.External,
        parameters: { viewMode: "tile", tileId: "10" }
      })
    );
    expect(resolvedLink.parameters).toBeNull();
  });

  it("should return correct data if all the allowed fields provided", async () => {
    const linkData = createContentfulLink({
      __typename: "Link",
      icon: "FilePDF",
      isLabelHidden: false,
      label: "Link label",
      queryParams: "?name=FakeName",
      url: "http://localhost:3000/link-url",
      type: DataTypeEnum.Visualiser,
      parameters: { tileId: 10, colourId: 9, sidingId: 9, viewMode: "tile" },
      dialogContent: createContentfulFormSectionData(),
      sys: {
        id: "link-id"
      },
      linkedPage: {
        __typename: "Page",
        sys: {
          id: "some-id"
        },
        title: "Linked page title",
        slug: "slug",
        parentPage: creatContentfulParentPage()
      },
      asset: {
        url: "http://localhost:3000/asset.pdf"
      },
      hubSpotCTAID: "hubspot-cta-id"
    });

    expect(await resolveLink(linkData)).toEqual({
      __typename: "Link",
      id: "link-id",
      icon: "FilePDF",
      isLabelHidden: false,
      label: "Link label",
      queryParams: "?name=FakeName",
      url: "http://localhost:3000/link-url",
      type: DataTypeEnum.Visualiser,
      parameters: { tileId: 10, colourId: 9, sidingId: 9, viewMode: "tile" },
      dialogContent: "resolved-form-section",
      linkedPage: {
        path: "url-from-path"
      },
      asset: {
        url: "http://localhost:3000/asset.pdf"
      },
      hubSpotCTAID: "hubspot-cta-id"
    });
  });

  describe("viewMode parameter", () => {
    it("should return viewMode parameter as 'tile' if it is nor number not string", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: {} }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'tile' if it is a string and has a value other than 'tile' or 'roof'", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: "fake value" }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'tile' if 'tile' value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: "fake value" }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'roof' if 'roof' value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: "roof" }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("roof");
    });

    it("should return viewMode parameter as 'tile' if a number greater than 1 provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: 2 }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'tile' if a number less than 0 provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: -1 }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'tile' if 0 value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: 0 }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("tile");
    });

    it("should return viewMode parameter as 'tile' if 1 value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { viewMode: 1 }
        })
      );
      expect(resolvedLink.parameters.viewMode).toBe("roof");
    });
  });

  describe("tileId parameter", () => {
    it("should return tileId parameter as null if it is nor number not string", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { tileId: undefined }
        })
      );
      expect(resolvedLink.parameters.tileId).toBe(null);
    });

    it("should return tileId parameter as null if it has a wrong numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { tileId: "some numeric value" }
        })
      );
      expect(resolvedLink.parameters.tileId).toBe(null);
    });

    it("should return correct value if a numeric value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { tileId: 10.1 }
        })
      );
      expect(resolvedLink.parameters.tileId).toBe(10.1);
    });

    it("should return parsed string value if is numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { tileId: "10.1" }
        })
      );
      expect(resolvedLink.parameters.tileId).toBe(10.1);
    });
  });

  describe("colourId parameter", () => {
    it("should return colourId parameter as null if it is nor number not string", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { colourId: undefined }
        })
      );
      expect(resolvedLink.parameters.colourId).toBe(null);
    });

    it("should return colourId parameter as null if it has a wrong numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { colourId: "some numeric value" }
        })
      );
      expect(resolvedLink.parameters.colourId).toBe(null);
    });

    it("should return correct value if a numeric value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { colourId: 10.1 }
        })
      );
      expect(resolvedLink.parameters.colourId).toBe(10.1);
    });

    it("should return parsed string value if is numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { colourId: "10.1" }
        })
      );
      expect(resolvedLink.parameters.colourId).toBe(10.1);
    });
  });

  describe("sidingId parameter", () => {
    it("should return sidingId parameter as null if it is nor number not string", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { sidingId: undefined }
        })
      );
      expect(resolvedLink.parameters.sidingId).toBe(null);
    });

    it("should return sidingId parameter as null if it has a wrong numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { sidingId: "some numeric value" }
        })
      );
      expect(resolvedLink.parameters.sidingId).toBe(null);
    });

    it("should return correct value if a numeric value provided", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { sidingId: 10.1 }
        })
      );
      expect(resolvedLink.parameters.sidingId).toBe(10.1);
    });

    it("should return parsed string value if is numeric value", async () => {
      const resolvedLink = await resolveLink(
        createContentfulLink({
          type: DataTypeEnum.Visualiser,
          parameters: { sidingId: "10.1" }
        })
      );
      expect(resolvedLink.parameters.sidingId).toBe(10.1);
    });
  });
});
