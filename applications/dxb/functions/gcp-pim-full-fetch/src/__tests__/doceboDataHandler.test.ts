import {
  createCatalogue,
  createCatalogueSubItem,
  createCourse
} from "@bmi/docebo-types";
import { fetchDoceboData } from "../doceboDataHandler";

const fetchCataloguesMock = jest.fn();
const fetchCoursesMock = jest.fn();

jest.mock("@bmi/docebo-api", () => ({
  getCachedDoceboApi: () => ({
    fetchCatalogues: fetchCataloguesMock,
    fetchCourses: fetchCoursesMock
  })
}));

describe("fetchDoceboData", () => {
  it("throws an error correctly", async () => {
    const error = new Error("An error occurred");
    fetchCataloguesMock.mockRejectedValue(error);
    await expect(fetchDoceboData(1)).rejects.toThrow(
      `Did not manage to pull Docebo data: ${JSON.stringify(error)}`
    );
  });

  it("calls 'fetchCatalogues' correctly if process.env.DOCEBO_API_CATALOGUE_IDS exists", async () => {
    const initial = process.env.DOCEBO_API_CATALOGUE_IDS;
    process.env.DOCEBO_API_CATALOGUE_IDS = "1,2,3";
    fetchCataloguesMock.mockResolvedValue([]);

    await fetchDoceboData(1);
    expect(fetchCataloguesMock).toHaveBeenCalledWith({
      catalogueIds: [1, 2, 3]
    });
    process.env.DOCEBO_API_CATALOGUE_IDS = initial;
  });

  it("returns correct data", async () => {
    const catalogue = createCatalogue({
      sub_items: [
        createCatalogueSubItem({ item_id: "11" }),
        createCatalogueSubItem({ item_id: "22" })
      ]
    });
    const course1 = createCourse({ id_course: 11 });
    const course2 = createCourse({ id_course: 22 });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    fetchCoursesMock.mockResolvedValue([course1, course2]);

    const res = await fetchDoceboData(1);
    expect(res).toEqual([
      {
        id: `${course1.id_course}-${catalogue.catalogue_id}`,
        courseId: course1.id_course,
        code: course1.code,
        name: course1.name,
        slug: course1.slug_name,
        courseType: course1.course_type,
        imgUrl: course1.img_url,
        categoryId: course1.category.id,
        categoryName: course1.category.name,
        catalogueId: catalogue.catalogue_id,
        catalogueName: catalogue.catalogue_name,
        catalogueDescription: catalogue.catalogue_description
      },
      {
        id: `${course2.id_course}-${catalogue.catalogue_id}`,
        courseId: course2.id_course,
        code: course2.code,
        name: course2.name,
        slug: course2.slug_name,
        courseType: course2.course_type,
        imgUrl: course2.img_url,
        categoryId: course2.category.id,
        categoryName: course2.category.name,
        catalogueId: catalogue.catalogue_id,
        catalogueName: catalogue.catalogue_name,
        catalogueDescription: catalogue.catalogue_description
      }
    ]);
  });

  it("should filter out courses that do not belong to any catalogue", async () => {
    const catalogue = createCatalogue({
      sub_items: [createCatalogueSubItem({ item_id: "11" })]
    });
    const course1 = createCourse({ id_course: 11 });
    const course2 = createCourse({ id_course: 22 });
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    fetchCoursesMock.mockResolvedValue([course1, course2]);

    const res = await fetchDoceboData(1);
    expect(res).toEqual([
      {
        id: `${course1.id_course}-${catalogue.catalogue_id}`,
        courseId: course1.id_course,
        code: course1.code,
        name: course1.name,
        slug: course1.slug_name,
        courseType: course1.course_type,
        imgUrl: course1.img_url,
        categoryId: course1.category.id,
        categoryName: course1.category.name,
        catalogueId: catalogue.catalogue_id,
        catalogueName: catalogue.catalogue_name,
        catalogueDescription: catalogue.catalogue_description
      }
    ]);
  });

  it("works correctly if 'fetchCourses' returns an empty array", async () => {
    const catalogue = createCatalogue();
    fetchCataloguesMock.mockResolvedValue([catalogue]);
    fetchCoursesMock.mockResolvedValue([]);

    const res = await fetchDoceboData(1);
    expect(res).toEqual([]);
  });
});
