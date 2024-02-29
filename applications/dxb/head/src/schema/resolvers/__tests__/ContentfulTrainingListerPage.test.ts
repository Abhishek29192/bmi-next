import { createCatalogue, createCatalogueSubItem } from "@bmi/docebo-types";
import { createCourse } from "@bmi/gatsby-source-docebo";
import { microCopy } from "@bmi/microcopies";
import ContentfulTrainingListerPage from "../ContentfulTrainingListerPage";
import { getMicroCopies } from "../utils/getMicrocopies";
import type { TrainingListerPage } from "../types/Contentful";
import type { Context } from "../types/Gatsby";

const findAllMock = jest.fn();
const context: Context = {
  nodeModel: {
    getNodesByIds: jest.fn(),
    findAll: findAllMock,
    findOne: jest.fn(),
    getNodeById: jest.fn()
  }
};

const getMicroCopiesMock = jest.fn().mockResolvedValue([]);
jest.mock("../utils/getMicrocopies", () => ({
  getMicroCopies: (...args: Parameters<typeof getMicroCopies>) =>
    getMicroCopiesMock(...args)
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

beforeEach(() => {
  getMicroCopiesMock.mockReturnValue([]);
});

const contentfulTrainingListerPage: TrainingListerPage = {
  breadcrumbTitle: "Breadcrumbs title",
  title: "Page title",
  subtitle: "Page subtitle",
  site___NODE: ["site-node"],
  link___NODE: "link-node",
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

describe("ContentfulTrainingListerPage resolver", () => {
  it("returns an empty array if 'getMicroCopies' returns undefined", async () => {
    getMicroCopiesMock.mockResolvedValue(undefined);
    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(res).toEqual([]);
    expect(context.nodeModel.findAll).not.toHaveBeenCalled();
  });

  it("returns an empty array if there are no courses", async () => {
    getMicroCopiesMock.mockResolvedValue(undefined);
    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(res).toEqual([]);
    expect(context.nodeModel.findAll).not.toHaveBeenCalled();
  });

  it("returns filters correctly if getMicroCopies returns an empty array", async () => {
    getMicroCopiesMock.mockResolvedValue([]);

    findAllMock.mockResolvedValueOnce({ entries: [] });
    getMicroCopiesMock.mockResolvedValue([]);

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );
    expect(res).toEqual([]);
    expect(context.nodeModel.findAll).toHaveBeenCalledTimes(1);
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCourses"
      },
      { connectionType: "DoceboCourses" }
    );
  });

  it("filters out catalogues with no courses", async () => {
    const course = createCourse();
    const catalogue1 = createCatalogue({
      catalogue_id: 1,
      catalogue_name: "Catalogue 1",
      sub_items: [
        createCatalogueSubItem({ item_id: course.id_course.toString() })
      ]
    });
    const catalogue2 = createCatalogue({
      catalogue_id: 2,
      catalogue_name: "catalogue 2",
      sub_items: []
    });

    findAllMock
      .mockResolvedValueOnce({ entries: [course] })
      .mockResolvedValueOnce({ entries: [catalogue1, catalogue2] });

    getMicroCopiesMock.mockResolvedValue([
      { key: microCopy.TRAINING_FILTER_LABEL_CATALOGUE, value: "Catalogues" },
      { key: microCopy.TRAINING_FILTER_LABEL_CATEGORY, value: "Categories" },
      { key: microCopy.TRAINING_CATEGORY_PITCHED, value: "Pitched" }
    ]);

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(context.nodeModel.findAll).toHaveBeenCalledTimes(2);
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCatalogues"
      },
      { connectionType: "DoceboCatalogues" }
    );
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCourses"
      },
      { connectionType: "DoceboCourses" }
    );
    expect(res).toEqual([
      {
        filterCode: "catalogueId",
        name: "catalogue",
        label: "Catalogues",
        value: [],
        options: [
          {
            value: `${catalogue1.catalogue_id}`,
            label: catalogue1.catalogue_name
          }
        ]
      },
      {
        filterCode: "category",
        name: "category",
        label: "Categories",
        value: [],
        options: [
          {
            value: "Pitched",
            label: "Pitched"
          }
        ]
      }
    ]);
  });

  it("filters out catalogues with no active courses", async () => {
    const course = createCourse();
    const catalogue1 = createCatalogue({
      catalogue_id: 1,
      catalogue_name: "Catalogue 1",
      sub_items: [
        createCatalogueSubItem({ item_id: course.id_course.toString() })
      ]
    });
    const catalogue2 = createCatalogue({
      catalogue_id: 2,
      catalogue_name: "catalogue 2",
      sub_items: [createCatalogueSubItem({ item_id: "fake-id" })]
    });

    findAllMock
      .mockResolvedValueOnce({ entries: [course] })
      .mockResolvedValueOnce({ entries: [catalogue1, catalogue2] });

    getMicroCopiesMock.mockResolvedValue([
      { key: microCopy.TRAINING_FILTER_LABEL_CATALOGUE, value: "Catalogues" },
      { key: microCopy.TRAINING_FILTER_LABEL_CATEGORY, value: "Categories" },
      { key: microCopy.TRAINING_CATEGORY_PITCHED, value: "Pitched" }
    ]);

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(context.nodeModel.findAll).toHaveBeenCalledTimes(2);
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCatalogues"
      },
      { connectionType: "DoceboCatalogues" }
    );
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCourses"
      },
      { connectionType: "DoceboCourses" }
    );
    expect(res).toEqual([
      {
        filterCode: "catalogueId",
        name: "catalogue",
        label: "Catalogues",
        value: [],
        options: [
          {
            value: `${catalogue1.catalogue_id}`,
            label: catalogue1.catalogue_name
          }
        ]
      },
      {
        filterCode: "category",
        name: "category",
        label: "Categories",
        value: [],
        options: [
          {
            value: "Pitched",
            label: "Pitched"
          }
        ]
      }
    ]);
  });

  it("returns filters correctly if corresponding microcopy provided", async () => {
    const course = createCourse();
    const catalogue = createCatalogue({
      catalogue_id: 1,
      catalogue_name: "Catalogue 1",
      sub_items: [
        createCatalogueSubItem({ item_id: course.id_course.toString() })
      ]
    });

    findAllMock
      .mockResolvedValueOnce({ entries: [course] })
      .mockResolvedValueOnce({ entries: [catalogue] });

    getMicroCopiesMock.mockResolvedValue([
      { key: microCopy.TRAINING_FILTER_LABEL_CATALOGUE, value: "Catalogues" },
      { key: microCopy.TRAINING_FILTER_LABEL_CATEGORY, value: "Categories" },
      { key: microCopy.TRAINING_CATEGORY_PITCHED, value: "Pitched" }
    ]);

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(context.nodeModel.findAll).toHaveBeenCalledTimes(2);
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCatalogues"
      },
      { connectionType: "DoceboCatalogues" }
    );
    expect(context.nodeModel.findAll).toHaveBeenCalledWith(
      {
        query: {},
        type: "DoceboCourses"
      },
      { connectionType: "DoceboCourses" }
    );
    expect(res).toEqual([
      {
        filterCode: "catalogueId",
        name: "catalogue",
        label: "Catalogues",
        value: [],
        options: [
          {
            value: `${catalogue.catalogue_id}`,
            label: catalogue.catalogue_name
          }
        ]
      },
      {
        filterCode: "category",
        name: "category",
        label: "Categories",
        value: [],
        options: [
          {
            value: "Pitched",
            label: "Pitched"
          }
        ]
      }
    ]);
  });

  it("returns filters correctly if a course with 'Flat' category provided", async () => {
    const course = createCourse({ categoryName: "Flat" });

    findAllMock
      .mockResolvedValueOnce({ entries: [course] })
      .mockResolvedValueOnce({ entries: [] });

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(res).toEqual(
      expect.arrayContaining([
        {
          filterCode: "category",
          name: "category",
          label: `MC: ${microCopy.TRAINING_FILTER_LABEL_CATEGORY}`,
          value: [],
          options: [
            {
              value: "Flat",
              label: `MC: ${microCopy.TRAINING_CATEGORY_FLAT}`
            }
          ]
        }
      ])
    );
  });

  it("returns filters correctly if a course with 'Other' category provided", async () => {
    const course = createCourse({ categoryName: "Other" });

    findAllMock
      .mockResolvedValueOnce({ entries: [course] })
      .mockResolvedValueOnce({ entries: [] });

    const res = await ContentfulTrainingListerPage.filters.resolve(
      contentfulTrainingListerPage,
      {},
      context
    );

    expect(res).toEqual(
      expect.arrayContaining([
        {
          filterCode: "category",
          name: "category",
          label: `MC: ${microCopy.TRAINING_FILTER_LABEL_CATEGORY}`,
          value: [],
          options: [
            {
              value: "Other",
              label: `MC: ${microCopy.TRAINING_CATEGORY_OTHER}`
            }
          ]
        }
      ])
    );
  });
});
