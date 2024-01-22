import { createCourse } from "@bmi/gatsby-source-docebo";
import TrainingDetailsPage, {
  getTrainingListerPage
} from "../TrainingDetailsPage";
import type { Context, ResolveArgs } from "../types/Gatsby";
import type {
  ContentfulAssetNode,
  ContentfulImageNode,
  TrainingListerPage
} from "../types/Contentful";
import type { GatsbyTrainingNode } from "../types/Docebo";

const findOneMock = jest.fn();
const getNodeByIdMock = jest.fn();
const context: Context = {
  nodeModel: {
    getNodesByIds: jest.fn(),
    findAll: jest.fn(),
    findOne: findOneMock,
    getNodeById: getNodeByIdMock
  }
};

const course: GatsbyTrainingNode = {
  ...createCourse(),
  id: "course-node-id",
  parent: null,
  children: [],
  internal: {
    type: "DoceboCourses",
    contentDigest: "content-digest",
    owner: "@bmi/gatsby-source-docebo",
    counter: 1
  }
};

const args: ResolveArgs = { categoryCodes: [], allowFilterBy: [] };

const trainingListerPage: TrainingListerPage = {
  breadcrumbTitle: "Breadcrumbs title",
  title: "Page title",
  subtitle: "Page subtitle",
  parent: null,
  name: "name",
  slug: "slug",
  featuredMedia___NODE: "featured-media-node",
  seo___NODE: null,
  parentPage___NODE: null,
  id: "id",
  spaceId: "space-id",
  contentful_id: "contentful-id",
  createdAt: "Sun Oct 22 2023 17:30:24 GMT+0300 (Eastern European Summer Time)",
  updatedAt: "Sun Oct 22 2023 17:30:24 GMT+0300 (Eastern European Summer Time)",
  children: [],
  internal: {
    type: "type",
    contentDigest: "contentDigest",
    owner: "owner"
  }
};

const imageNode: ContentfulImageNode = {
  title: "image-title",
  altText: "alt-text",
  type: null,
  image___NODE: "image-node-id",
  focalPoint___NODE: null,
  caption___NODE: null,
  id: "source",
  children: [],
  parent: null,
  internal: { type: "", contentDigest: "", owner: "" }
};

const assetNode: ContentfulAssetNode = {
  file: {
    url: "//image-url.jpg",
    details: {
      image: { width: 200, height: 200 },
      size: 10
    },
    fileName: "fake-file-name.jpg",
    contentType: "content type"
  },
  title: "title",
  description: "description",
  url: "//image-url.jpg",
  placeholderUrl: "//fake-placeholder-url.jpg",
  mimeType: "image/jpeg",
  filename: "fake-file-name.jpg",
  width: 200,
  height: 200,
  size: 10,
  id: "source",
  children: [],
  parent: null,
  internal: { type: "", contentDigest: "", owner: "" }
};

jest.mock("../utils/path", () => ({
  resolvePath: jest.fn().mockImplementation((source: TrainingListerPage) => [
    {
      id: source.id,
      label: source.title,
      slug: source.slug
    }
  ])
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  process.env.MARKET_TAG_NAME = "no";
});

describe("getTrainingListerPage", () => {
  it("returns the data if process.env.MARKET_TAG_NAME is not defined", async () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    delete process.env.MARKET_TAG_NAME;
    findOneMock.mockReturnValue(trainingListerPage);

    const res = await getTrainingListerPage(context);
    expect(findOneMock).toHaveBeenCalledWith({
      query: {
        filter: {}
      },
      type: "ContentfulTrainingListerPage"
    });

    expect(res).toEqual(trainingListerPage);
    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });

  it("returns the data if process.env.MARKET_TAG_NAME is defined", async () => {
    const originalMarketTagName = process.env.MARKET_TAG_NAME;
    process.env.MARKET_TAG_NAME = "no";
    findOneMock.mockReturnValue(trainingListerPage);

    const res = await getTrainingListerPage(context);
    expect(findOneMock).toHaveBeenCalledWith({
      query: {
        filter: {
          metadata: {
            tags: {
              elemMatch: {
                contentful_id: {
                  eq: "no"
                }
              }
            }
          }
        }
      },
      type: "ContentfulTrainingListerPage"
    });

    expect(res).toEqual(trainingListerPage);
    process.env.MARKET_TAG_NAME = originalMarketTagName;
  });
});

describe("TrainingDetailsPage resolver", () => {
  describe("Breadcrumbs", () => {
    it("returns an array of one item if training lister page does not exist", async () => {
      findOneMock.mockResolvedValue(null);
      const res = await TrainingDetailsPage.breadcrumbs.resolve(
        course,
        args,
        context
      );

      expect(res).toEqual([
        {
          id: course.id_course.toString(),
          label: course.name,
          slug: course.slug_name
        }
      ]);
    });

    it("returns breadcrumbs correctly if training lister page exists", async () => {
      findOneMock.mockResolvedValue(trainingListerPage);
      const res = await TrainingDetailsPage.breadcrumbs.resolve(
        course,
        args,
        context
      );

      expect(res).toEqual([
        {
          id: trainingListerPage.id,
          label: trainingListerPage.title,
          slug: trainingListerPage.slug
        },
        {
          id: course.id_course.toString(),
          label: course.name,
          slug: course.slug_name
        }
      ]);
    });
  });

  describe("Image URL", () => {
    it("returns image url if provided", async () => {
      const imageUrl = "https://fake-image-url.jpg";
      const res = await TrainingDetailsPage.img_url.resolve(
        { ...course, img_url: imageUrl },
        args,
        context
      );

      expect(res).toEqual(imageUrl);
      expect(context.nodeModel.findOne).not.toHaveBeenCalled();
      expect(context.nodeModel.getNodeById).not.toHaveBeenCalled();
    });

    it("returns featuredImage of training lister page if source.img_url is not provided", async () => {
      findOneMock.mockResolvedValue(trainingListerPage);
      getNodeByIdMock
        .mockResolvedValueOnce(imageNode)
        .mockResolvedValueOnce(assetNode);

      const res = await TrainingDetailsPage.img_url.resolve(
        { ...course, img_url: null },
        args,
        context
      );

      expect(res).toEqual(assetNode.file.url);
      expect(context.nodeModel.findOne).toHaveBeenCalledWith({
        query: {
          filter: {
            metadata: {
              tags: {
                elemMatch: {
                  contentful_id: {
                    eq: "no"
                  }
                }
              }
            }
          }
        },
        type: "ContentfulTrainingListerPage"
      });
      expect(context.nodeModel.getNodeById).toHaveBeenCalledTimes(2);
      expect(context.nodeModel.getNodeById).toHaveBeenNthCalledWith(1, {
        type: "ContentfulImage",
        id: trainingListerPage.featuredMedia___NODE
      });
      expect(context.nodeModel.getNodeById).toHaveBeenNthCalledWith(2, {
        type: "ContentfulAsset",
        id: imageNode.image___NODE
      });
    });
  });
});
