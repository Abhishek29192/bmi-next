import { createCatalogue, createCourse } from "@bmi/docebo-types";
import { microCopy } from "@bmi/microcopies";
import { getMicroCopies } from "../utils/getMicrocopies";
import ContentfulTrainingListerPage from "../ContentfulTrainingListerPage";
import type { Context } from "../types/Gatsby";
import type { TrainingListerPage } from "../types/Contentful";

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
  children: []
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

  it("returns filters correctly if getMicroCopies returns an empty array", async () => {
    const catalogue1 = createCatalogue({
      catalogue_id: 1,
      catalogue_name: "Catalogue 1"
    });
    const catalogue2 = createCatalogue({
      catalogue_id: 2,
      catalogue_name: "Catalogue 2"
    });
    const course = createCourse({ category: { name: "Pitched", id: 1 } });

    findAllMock
      .mockResolvedValueOnce({ entries: [catalogue1, catalogue2] })
      .mockResolvedValueOnce({ entries: [course] });
    getMicroCopiesMock.mockResolvedValue([]);

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
        label: `MC: ${microCopy.TRAINING_FILTER_LABEL_CATALOGUE}`,
        value: [],
        options: [
          {
            value: `${catalogue1.catalogue_id}`,
            label: catalogue1.catalogue_name
          },
          {
            value: `${catalogue2.catalogue_id}`,
            label: catalogue2.catalogue_name
          }
        ]
      },
      {
        filterCode: "category",
        name: "category",
        label: `MC: ${microCopy.TRAINING_FILTER_LABEL_CATEGORY}`,
        value: [],
        options: [
          {
            value: "Pitched",
            label: `MC: ${microCopy.TRAINING_CATEGORY_PITCHED}`
          }
        ]
      }
    ]);
  });

  it("returns filters correctly if corresponding microcopy provided", async () => {
    const catalogue1 = createCatalogue({
      catalogue_id: 1,
      catalogue_name: "Catalogue 1"
    });
    const catalogue2 = createCatalogue({
      catalogue_id: 2,
      catalogue_name: "Catalogue 2"
    });
    const course = createCourse({ category: { name: "Pitched", id: 1 } });

    findAllMock
      .mockResolvedValueOnce({ entries: [catalogue1, catalogue2] })
      .mockResolvedValueOnce({ entries: [course] });
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
          },
          {
            value: `${catalogue2.catalogue_id}`,
            label: catalogue2.catalogue_name
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
    const course = createCourse({ category: { name: "Flat", id: 1 } });

    findAllMock
      .mockResolvedValueOnce({ entries: [] })
      .mockResolvedValueOnce({ entries: [course] });

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

  it("returns filters correctly if a course with 'non-allowed' category provided", async () => {
    const course = createCourse({ category: { name: "Fake category", id: 1 } });

    findAllMock
      .mockResolvedValueOnce({ entries: [] })
      .mockResolvedValueOnce({ entries: [course] });

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
